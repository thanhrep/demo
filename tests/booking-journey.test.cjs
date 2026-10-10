const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'booking-journey.js'), 'utf8');

function harness(reduced = false) {
  let now = 0, serial = 0, observer;
  const frames = new Map();
  const events = new Map();
  function element() {
    const classes = new Set();
    return {
      style: {}, attrs: {}, disabled: false, hidden: true, textContent: '',
      classList: {
        add: name => classes.add(name),
        contains: name => classes.has(name),
        toggle(name, value) { if (value) classes.add(name); else classes.delete(name); }
      },
      setAttribute(name, value) { this.attrs[name] = value; },
      addEventListener(name, action) { events.set(this, { ...events.get(this), [name]: action }); },
      click() { events.get(this).click(); }
    };
  }
  const section = element(), map = element(), road = element(), rider = element();
  const controls = element(), pause = element(), replay = element(), caption = element();
  rider.offsetWidth = 43; rider.offsetHeight = 35;
  map.getBoundingClientRect = () => ({left: 0, top: 0});
  const paths = Array.from({length: 3}, element);
  paths.forEach(item => {
    item.getTotalLength = () => 120 * (item.attrs.d.split('C').length - 1);
    item.getPointAtLength = distance => ({x: 23, y: 50 + distance});
  });
  road.querySelectorAll = () => paths;
  const buttons = Array.from({length: 3}, element);
  const steps = buttons.map((_, i) => {
    const step = element(), pin = element();
    pin.getBoundingClientRect = () => ({left: 6, top: 33 + i * 120, width: 34, height: 34});
    step.querySelector = () => pin;
    return step;
  });
  section.querySelector = selector => ({'.journey-map':map, '.journey-road':road, '.journey-rider':rider,
    '.journey-controls':controls, '.journey-pause':pause, '.journey-replay':replay, '.journey-caption':caption})[selector];
  section.querySelectorAll = selector => selector === '.journey-step' ? steps : buttons;
  const media = {matches: reduced, addEventListener(_, action) {this.change = action;}};
  const document = {hidden:false, querySelector:()=>section, addEventListener(name, action) {this[name] = action;}};
  vm.runInNewContext(source, {
    document, window: {matchMedia: query => query.includes('reduced') ? media : {matches:true}, IntersectionObserver:true},
    ResizeObserver: class {observe() {}},
    IntersectionObserver: class {constructor(action) {observer = action;} observe() {}},
    requestAnimationFrame(action) {frames.set(++serial, action); return serial;},
    cancelAnimationFrame(id) {frames.delete(id);}
  });
  return {
    section, rider, controls, pause, replay, buttons, media, document,
    visible(value) {observer([{isIntersecting:value, intersectionRatio:value ? 1 : 0}]);},
    advance(ms) {for (let elapsed=0; elapsed<ms; elapsed+=16) {now+=16; const pending=[...frames.values()]; frames.clear(); pending.forEach(action=>action(now));}},
    queued() {return frames.size;}
  };
}

const normal = harness();
assert.equal(normal.queued(), 0, 'No animation before entering the section');
assert.equal(normal.controls.hidden, false);
normal.visible(true);
assert.equal(normal.section.classList.contains('journey-reveal'), true);
normal.advance(2100);
const moving = normal.rider.style.transform;
normal.advance(300);
assert.notEqual(normal.rider.style.transform, moving, 'Rider really advances along the road');
normal.pause.click();
const paused = normal.rider.style.transform;
normal.advance(1000);
assert.equal(normal.rider.style.transform, paused);
assert.equal(normal.pause.attrs['aria-pressed'], 'true');
normal.pause.click(); normal.advance(300);
assert.notEqual(normal.rider.style.transform, paused, 'Resume continues without restarting');
normal.visible(false);
const offscreen = normal.rider.style.transform;
normal.advance(1000);
assert.equal(normal.rider.style.transform, offscreen, 'Offscreen animation is suspended');
normal.visible(true); normal.advance(300);
normal.document.hidden = true; normal.document.visibilitychange();
const hidden = normal.rider.style.transform;
normal.advance(1000);
assert.equal(normal.rider.style.transform, hidden, 'Hidden tabs do not animate');
normal.document.hidden = false; normal.document.visibilitychange();
normal.advance(8000);
assert.equal(normal.pause.disabled, true, 'One ride finishes; no infinite loop');
assert.equal(normal.buttons[2].attrs['aria-pressed'], 'true');
normal.replay.click(); normal.advance(1800);
assert.equal(normal.pause.disabled, false, 'Replay starts another ride');
normal.buttons[0].click(); normal.advance(1400);
assert.equal(normal.buttons[0].attrs['aria-pressed'], 'true');
assert.equal(normal.rider.style.transform, 'translate3d(1.5px, 20px, 0)', 'Selecting a step returns the rider to its pin');

const reduced = harness(true);
reduced.visible(true); reduced.advance(2500);
assert.equal(reduced.queued(), 0, 'Reduced motion disables autoplay');
assert.equal(reduced.pause.disabled, true);
reduced.buttons[2].click();
assert.equal(reduced.queued(), 0, 'Reduced-motion step selection is instant');
reduced.replay.click(); reduced.advance(2000);
assert.equal(reduced.pause.disabled, false, 'Explicit Play can opt into a single pausable ride');
reduced.pause.click();
const reducedPaused = reduced.rider.style.transform;
reduced.advance(1000);
assert.equal(reduced.rider.style.transform, reducedPaused);
reduced.media.change();
assert.equal(reduced.queued(), 0, 'Changing motion preference cancels the ride');
console.log('PASS: visibility trigger, real motion, pause/resume, offscreen/hidden suspension, finish, replay, step selection and reduced motion.');
