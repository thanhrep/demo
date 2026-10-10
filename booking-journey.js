(() => {
  'use strict';
  const section = document.querySelector('.booking-journey');
  if (!section) return;
  const map = section.querySelector('.journey-map');
  const road = section.querySelector('.journey-road');
  const paths = Array.from(road.querySelectorAll('path'));
  const path = paths[0];
  const progressPath = paths[2];
  const steps = Array.from(section.querySelectorAll('.journey-step'));
  const buttons = Array.from(section.querySelectorAll('[data-journey-step]'));
  const rider = section.querySelector('.journey-rider');
  const controls = section.querySelector('.journey-controls');
  const pause = section.querySelector('.journey-pause');
  const replay = section.querySelector('.journey-replay');
  const caption = section.querySelector('.journey-caption');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let length = 0;
  let middle = .5;
  let position = 0;
  let active = -1;
  let frame = 0;
  let ride = null;
  let inView = false;
  let started = false;
  let userPaused = false;
  const smooth = t => t * t * (3 - 2 * t);

  function highlight(index) {
    if (index === active) return;
    active = index;
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
      step.classList.toggle('is-visited', i < index);
      buttons[i].setAttribute('aria-pressed', String(i === index));
    });
  }

  function place(value) {
    position = Math.max(0, Math.min(1, value));
    if (!length) return;
    const point = path.getPointAtLength(position * length);
    // Keep the rider upright on the mobile road, not rotated into the text.
    rider.style.transform = `translate3d(${point.x - rider.offsetWidth / 2}px, ${point.y - rider.offsetHeight + 5}px, 0)`;
    progressPath.style.strokeDashoffset = String(length * (1 - position));
  }

  function layout() {
    const bounds = map.getBoundingClientRect();
    const points = steps.map(step => {
      const pin = step.querySelector('.journey-pin').getBoundingClientRect();
      return { x: pin.left + pin.width / 2 - bounds.left, y: pin.top + pin.height / 2 - bounds.top };
    });
    const vertical = window.matchMedia('(max-width: 800px)').matches;
    const curves = points.slice(1).map((point, i) => {
      const previous = points[i];
      return vertical
        ? `C ${previous.x - 12} ${previous.y + 26}, ${point.x + 12} ${point.y - 26}, ${point.x} ${point.y}`
        : `C ${previous.x + (point.x - previous.x) / 3} ${previous.y + (i ? -18 : 18)}, ${point.x - (point.x - previous.x) / 3} ${point.y + (i ? -18 : 18)}, ${point.x} ${point.y}`;
    });
    const d = `M ${points[0].x} ${points[0].y} ${curves.join(' ')}`;
    paths.forEach(item => item.setAttribute('d', d));
    length = path.getTotalLength();
    // Derive the midpoint from the actual first segment, including wrapped text.
    path.setAttribute('d', `M ${points[0].x} ${points[0].y} ${curves[0]}`);
    middle = path.getTotalLength() / length;
    path.setAttribute('d', d);
    progressPath.style.strokeDasharray = String(length);
    section.classList.add('journey-ready');
    place(position);
  }

  function syncControls() {
    pause.disabled = !ride;
    pause.textContent = userPaused ? 'Resume motion' : 'Pause motion';
    pause.setAttribute('aria-pressed', String(userPaused));
  }

  function syncMotionLabels() {
    replay.textContent = reducedMotion.matches ? 'Play journey ↻' : 'Replay journey ↻';
    caption.textContent = reducedMotion.matches ? 'Reduced motion · play when you are ready' : 'A clear route to your next adventure';
  }

  function cancelFrame() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (ride) ride.last = null;
  }

  function tick(now) {
    frame = 0;
    if (!ride || !inView || document.hidden || userPaused) return;
    if (ride.last !== null) ride.elapsed += Math.min(now - ride.last, 64);
    ride.last = now;
    const t = Math.min(1, ride.elapsed / ride.duration);
    if (ride.tour) {
      const value = t < .12 ? 0 : t < .47 ? middle * smooth((t - .12) / .35)
        : t < .59 ? middle : middle + (1 - middle) * smooth((t - .59) / .41);
      place(value);
      highlight(t < .42 ? 0 : t < .93 ? 1 : 2);
    } else {
      place(ride.from + (ride.to - ride.from) * smooth(t));
    }
    if (t === 1) {
      ride = null;
      syncControls();
    } else frame = requestAnimationFrame(tick);
  }

  function resume() {
    if (ride && inView && !document.hidden && !userPaused && !frame) frame = requestAnimationFrame(tick);
  }

  function start(index, explicitMotion = false) {
    cancelFrame();
    userPaused = false;
    const tour = index === undefined;
    const target = tour ? 1 : [0, middle, 1][index];
    highlight(tour ? 0 : index);
    if (reducedMotion.matches && !explicitMotion) {
      ride = null;
      place(tour ? middle : target);
      if (tour) highlight(1);
    } else {
      if (tour) place(0);
      ride = { from: position, to: target, elapsed: 0, last: null, duration: tour ? 6800 : 1100, tour };
      resume();
    }
    syncControls();
  }

  buttons.forEach((button, i) => button.addEventListener('click', () => start(i)));
  // An intentional play click can opt into this single, pausable ride even
  // when the device requests reduced automatic motion.
  replay.addEventListener('click', () => start(undefined, true));
  pause.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) cancelFrame(); else resume();
    syncControls();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelFrame(); else resume();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      cancelFrame(); ride = null; place([0, middle, 1][Math.max(active, 0)]); syncControls();
    }
    syncMotionLabels();
  });
  layout();
  highlight(0);
  controls.hidden = false;
  syncMotionLabels();
  const resize = new ResizeObserver(layout);
  resize.observe(map);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
      if (!inView) { cancelFrame(); return; }
      if (!started) {
        started = true;
        section.classList.add('journey-reveal');
        start();
      } else resume();
    }, { threshold: .2 }).observe(map);
  } else { inView = true; started = true; start(); }
})();
