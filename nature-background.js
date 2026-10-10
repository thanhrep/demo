/**
 * NatureBackground v5.0 — SKYHAGIANGLOOT 3D Endless Ha Giang Pass Engine
 * Bản dựng chuẩn nét 4K/Retina (100% Real-Time WebGL Shader + 3D Perspective Vector World)
 * Không dùng ảnh tĩnh ghép nối -> Không bao giờ mờ, kéo dài vô tận cho trang web cực dài!
 *
 * Tính năng nổi bật:
 *  1. Cung đường đèo Hà Giang 3D uốn lượn vô tận (Endless 3D Mountain Pass) tiến tới liên tục.
 *  2. Đoàn xe máy phượt đang di chuyển thực tế trên đèo, nghiêng xe ôm cua, bật đèn pha xuyên sương
 *     và treo Cờ Đỏ Sao Vàng Việt Nam bay phấp phới.
 *  3. Cột cờ Lũng Cú / Cờ Tổ Quốc trên các đỉnh núi đá tai mèo phía xa tung bay trong gió.
 *  4. Biển mây cuồn cuộn trôi qua hẻm vực sông Nho Quế xanh ngọc bích & chim đại bàng sải cánh.
 *  5. Logo chữ 3D "SKYHAGIANGLOOT" tự động đổi tông màu hòa hợp với bầu trời/núi rừng từng chặng
 *     và bay lượn mượt mà theo quỹ đạo 3D khi cuộn trang (Scroll Up/Down).
 */
(function (global) {
  'use strict';

  const VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // WebGL Shader kết xuất bầu trời khí quyển độ phân giải gốc 4K, tia nắng mặt trời,
  // dãy núi đá tai mèo Hà Giang đa tầng, biển mây trôi cuồn cuộn và sông Nho Quế dưới hẻm vực.
  const FRAGMENT_SHADER = `
    precision highp float;
    varying vec2 v_uv;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_scroll;     // 0.0 -> 1.0 (chu kỳ ngày/đêm hoặc hành trình xuyên suốt trang dài)
    uniform float u_travelZ;    // Quãng đường di chuyển dọc theo đèo (tăng liên tục theo thời gian + cuộn trang)
    uniform vec2 u_mouse;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.03 + vec2(15.7, 28.3);
        a *= 0.5;
      }
      return v;
    }

    // Địa hình núi đá vôi tai mèo đặc trưng của Cao nguyên đá Đồng Văn - Hà Giang
    float karstMountain(float x, float seed) {
      float n1 = noise(vec2(x * 0.9 + seed, seed * 1.7));
      float n2 = fbm(vec2(x * 2.2 + seed * 3.1, seed * 2.3));
      // Tạo chóp núi đá tai mèo sắc nét kết hợp sườn núi tự nhiên
      float peak = pow(abs(sin(x * 1.15 + seed)), 0.72) * 0.55 + n1 * 0.32 + n2 * 0.18;
      return peak;
    }

    void main() {
      vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
      vec2 uv = v_uv;

      // Chuyển màu thời gian trong ngày mượt mà khi lướt dọc trang web dài:
      // 0.00 - 0.30: Bình minh săn mây vàng cam & xanh ngọc (Sunrise Cloud Hunting)
      // 0.30 - 0.65: Ban ngày nắng trong xanh hùng vĩ (Emerald Karst & Turquoise Nho Que)
      // 0.65 - 0.88: Hoàng hôn rực lửa trên đỉnh Lũng Cú (Golden Crimson Sunset)
      // 0.88 - 1.00: Chạng vạng & Đêm đầy sao Đông Bắc (Starry Twilight Pass)
      float s = clamp(u_scroll, 0.0, 1.0);

      vec3 skyTopA = vec3(0.06, 0.24, 0.48);
      vec3 skyBotA = vec3(0.98, 0.72, 0.44);
      vec3 sunColA = vec3(1.00, 0.88, 0.58);
      vec3 mtnFarA = vec3(0.24, 0.42, 0.54);
      vec3 mtnNearA = vec3(0.06, 0.22, 0.18);

      vec3 skyTopB = vec3(0.05, 0.38, 0.68);
      vec3 skyBotB = vec3(0.56, 0.88, 0.92);
      vec3 sunColB = vec3(1.00, 0.97, 0.84);
      vec3 mtnFarB = vec3(0.18, 0.48, 0.52);
      vec3 mtnNearB = vec3(0.05, 0.26, 0.19);

      vec3 skyTopC = vec3(0.16, 0.10, 0.34);
      vec3 skyBotC = vec3(0.98, 0.45, 0.26);
      vec3 sunColC = vec3(1.00, 0.72, 0.32);
      vec3 mtnFarC = vec3(0.42, 0.22, 0.36);
      vec3 mtnNearC = vec3(0.12, 0.07, 0.14);

      vec3 skyTopD = vec3(0.02, 0.05, 0.14);
      vec3 skyBotD = vec3(0.08, 0.28, 0.38);
      vec3 sunColD = vec3(0.65, 0.95, 0.88);
      vec3 mtnFarD = vec3(0.07, 0.20, 0.28);
      vec3 mtnNearD = vec3(0.02, 0.08, 0.11);

      vec3 skyTop, skyBot, sunCol, mtnFar, mtnNear;
      if (s < 0.33) {
        float k = smoothstep(0.0, 0.33, s);
        skyTop = mix(skyTopA, skyTopB, k);
        skyBot = mix(skyBotA, skyBotB, k);
        sunCol = mix(sunColA, sunColB, k);
        mtnFar = mix(mtnFarA, mtnFarB, k);
        mtnNear = mix(mtnNearA, mtnNearB, k);
      } else if (s < 0.68) {
        float k = smoothstep(0.33, 0.68, s);
        skyTop = mix(skyTopB, skyTopC, k);
        skyBot = mix(skyBotB, skyBotC, k);
        sunCol = mix(sunColB, sunColC, k);
        mtnFar = mix(mtnFarB, mtnFarC, k);
        mtnNear = mix(mtnNearB, mtnNearC, k);
      } else {
        float k = smoothstep(0.68, 1.0, s);
        skyTop = mix(skyTopC, skyTopD, k);
        skyBot = mix(skyBotC, skyBotD, k);
        sunCol = mix(sunColC, sunColD, k);
        mtnFar = mix(mtnFarC, mtnFarD, k);
        mtnNear = mix(mtnNearC, mtnNearD, k);
      }

      float camX = u_mouse.x * 0.06 + sin(u_travelZ * 0.18) * 0.05;
      float camY = u_mouse.y * 0.03;

      // 1. BẦU TRỜI KHÍ QUYỂN & SAO ĐÊM
      float skyGrad = clamp((uv.y - 0.22) / 0.78, 0.0, 1.0);
      vec3 col = mix(skyBot, skyTop, pow(skyGrad, 0.7));

      if (s > 0.65 && uv.y > 0.45) {
        float nightAlpha = smoothstep(0.65, 0.92, s);
        vec2 starGrid = floor(uv * vec2(280.0, 150.0));
        float sv = hash(starGrid);
        if (sv > 0.992) {
          float tw = 0.5 + 0.5 * sin(u_time * 3.5 + sv * 90.0);
          col += vec3(0.85, 0.95, 1.0) * tw * nightAlpha * smoothstep(0.45, 0.75, uv.y);
        }
      }

      // 2. MẶT TRỜI / MẶT TRĂNG & TIA NẮNG XUYÊN MÂY (GOD RAYS)
      vec2 sunPos = vec2(0.72 - camX * 0.4 + sin(s * 3.14159) * 0.08, 0.74 - s * 0.12 + camY);
      vec2 sunDelta = (uv - sunPos) * aspect;
      float sunDist = length(sunDelta);
      float sunDisc = smoothstep(0.06, 0.042, sunDist);
      float sunGlow = exp(-sunDist * 3.8) * 0.68 + exp(-sunDist * 1.3) * 0.30;
      col += sunCol * (sunDisc * 0.95 + sunGlow);

      // 3. MÂY TRỜI CAO NGUYÊN BAY NHANH THEO GIÓ & QUÃNG ĐƯỜNG (u_travelZ)
      if (uv.y > 0.35) {
        vec2 cloudUV = vec2(
          (uv.x - 0.5) * aspect.x * 1.5 + u_time * 0.035 + camX * 0.5,
          uv.y * 2.8 - u_travelZ * 0.04
        );
        float c1 = fbm(cloudUV);
        float c2 = fbm(cloudUV * 2.2 - vec2(u_time * 0.05, 0.0));
        float cloudMask = smoothstep(0.38, 0.72, c1 * 0.65 + c2 * 0.35) *
                          smoothstep(0.35, 0.58, uv.y) * smoothstep(0.98, 0.75, uv.y);
        vec3 cloudColor = mix(skyBot, sunCol, 0.55);
        col = mix(col, cloudColor, cloudMask * 0.65);
      }

      // 4. 4 LỚP NÚI ĐÁ TAI MÈO HÀ GIANG & BIỂN MÂY THUNG LŨNG CUỒN CUỘN
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float depth = fi / 3.0; // 0.0 (xa) -> 1.0 (gần)
        float baseH = mix(0.54, 0.24, depth) + camY;

        // Khi đi dọc đèo (u_travelZ), các dãy núi dịch chuyển parallax tạo cảm giác đang tiến về phía trước
        float panX = (uv.x - 0.5) * aspect.x * mix(1.5, 2.8, depth) +
                     camX * mix(0.3, 1.5, depth) +
                     sin(u_travelZ * 0.08 + fi * 1.7) * mix(0.15, 0.55, depth);

        // Chừa hẻm vực Tu Sản ở giữa (uv.x ~ 0.48) cho dòng sông Nho Quế ở các lớp núi gần
        float canyonCut = (i >= 2) ? exp(-pow((uv.x - 0.48 - camX * 0.3) * 3.8, 2.0)) * 0.22 : 0.0;
        float mtnTop = baseH + karstMountain(panX, fi * 11.3 + 2.5) * mix(0.34, 0.42, depth) - canyonCut;

        if (uv.y < mtnTop) {
          float distFromRidge = mtnTop - uv.y;
          vec3 layerCol = mix(mtnFar, mtnNear, pow(depth, 0.75));

          // Vân đá vôi và thảm rừng xanh trên sườn núi
          float rockDetail = fbm(vec2(panX * 4.5, uv.y * 5.5));
          layerCol *= 0.78 + 0.42 * rockDetail;

          // Ánh nắng vàng chiếu sườn núi phía hướng mặt trời
          float sunSide = smoothstep(0.08, 0.0, distFromRidge) * exp(-abs(uv.x - sunPos.x) * 2.2);
          layerCol += sunCol * sunSide * 0.38;

          // BIỂN MÂY SĂN MÂY HÀ GIANG TRÔI CUỒN CUỘN GIỮA CÁC THUNG LŨNG NÚI
          float cloudBandY = baseH + 0.04;
          float valleyHeight = smoothstep(cloudBandY + 0.16, cloudBandY - 0.05, uv.y);
          float rollingMist = fbm(vec2(panX * 1.8 - u_time * (0.08 + depth * 0.06), uv.y * 5.0 + u_travelZ * 0.08));
          float mistDensity = valleyHeight * smoothstep(0.32, 0.68, rollingMist) * (0.85 - depth * 0.25);

          vec3 mistCol = mix(skyBot, vec3(0.96, 0.98, 1.0), 0.55);
          col = mix(layerCol, mistCol, clamp(mistDensity, 0.0, 0.88));
        }
      }

      // 5. DÒNG SÔNG NHO QUẾ XANH NGỌC BÍCH DƯỚI HẺM VỰC TU SẢN (uv.y < 0.32)
      float riverCenter = 0.48 + camX * 0.3 + sin(uv.y * 12.0 + u_travelZ * 0.4) * 0.045;
      float riverWidth = mix(0.14, 0.025, clamp(uv.y / 0.32, 0.0, 1.0));
      float riverDist = abs(uv.x - riverCenter);

      if (uv.y < 0.32 && riverDist < riverWidth) {
        float riverEdge = smoothstep(riverWidth, riverWidth * 0.55, riverDist);
        float waterRipple = sin(uv.y * 140.0 + u_time * 4.5 + u_travelZ * 2.0) * 0.5 + 0.5;
        vec3 nhoQueCol = mix(vec3(0.04, 0.56, 0.52), vec3(0.18, 0.85, 0.78), waterRipple * 0.45);
        nhoQueCol += sunCol * smoothstep(0.65, 0.95, waterRipple) * 0.35;
        col = mix(col, nhoQueCol, riverEdge * smoothstep(0.32, 0.26, uv.y));
      }

      // 6. TIA NẮNG CHIẾU XUYÊN ĐỈNH ĐÈO
      float rayAng = atan(uv.y - sunPos.y, (uv.x - sunPos.x) * aspect.x);
      float rays = (sin(rayAng * 16.0 + u_time * 0.35) * 0.5 + 0.5) *
                   (sin(rayAng * 9.0 - u_time * 0.25) * 0.5 + 0.5);
      col += sunCol * rays * exp(-sunDist * 1.6) * 0.16;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  class NatureBackground {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          container: document.body,
          logoText: 'SKYHAGIANGLOOT',
          showLogo: true,
          scrollSensitivity: 1.0,
          autoDriveSpeed: 1.35, // Tốc độ xe và cung đường trôi tự động ngay cả khi chưa cuộn chuột
          mouseParallax: true,
          maxPixelRatio: window.innerWidth < 800 ? 1.1 : 1.35,
          // Keep the scenic background animated even when OS reduced-motion is enabled.
          reducedMotion: false,
          zIndex: 1
        },
        options
      );

      this.time = 0;
      this.lastFrame = performance.now();
      this.lastRender = 0;
      this.targetScroll = 0;
      this.currentScroll = 0;
      this.scrollVelocity = 0;
      this.travelZ = 0; // Tọa độ hành trình dọc theo cung đường đèo 3D
      this.targetMouse = { x: 0, y: 0 };
      this.currentMouse = { x: 0, y: 0 };
      this.isDestroyed = false;

      this._initDOM();
      this._initWebGL();
      this._init3DWorldEntities();
      this._bindEvents();
      this._animate = this._animate.bind(this);
      requestAnimationFrame(this._animate);
    }

    _initDOM() {
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'skyhagiang-bg-wrapper';
      Object.assign(this.wrapper.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: String(this.options.zIndex),
        pointerEvents: 'none',
        userSelect: 'none',
        backgroundColor: '#071b24'
      });

      this.glCanvas = document.createElement('canvas');
      Object.assign(this.glCanvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block'
      });

      this.worldCanvas = document.createElement('canvas');
      Object.assign(this.worldCanvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block'
      });

      this.wrapper.appendChild(this.glCanvas);
      this.wrapper.appendChild(this.worldCanvas);

      if (this.options.container === document.body) {
        document.body.prepend(this.wrapper);
      } else {
        this.options.container.appendChild(this.wrapper);
      }
    }

    _initWebGL() {
      const gl =
        this.glCanvas.getContext('webgl', { alpha: false, antialias: true }) ||
        this.glCanvas.getContext('experimental-webgl');
      this.gl = gl;
      if (!gl) { this.wrapper.style.display = 'none'; return; }

      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error('Shader error:', gl.getShaderInfoLog(s));
        }
        return s;
      };

      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(prog);
      this.program = prog;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const loc = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      this.uniforms = {
        resolution: gl.getUniformLocation(prog, 'u_resolution'),
        time: gl.getUniformLocation(prog, 'u_time'),
        scroll: gl.getUniformLocation(prog, 'u_scroll'),
        travelZ: gl.getUniformLocation(prog, 'u_travelZ'),
        mouse: gl.getUniformLocation(prog, 'u_mouse')
      };

      this._resize();
    }

    _init3DWorldEntities() {
      this.ctx = this.worldCanvas.getContext('2d');

      // Đoàn xe máy phượt đang chạy trên đèo (mỗi xe có vị trí z, làn đường, tốc độ riêng & cờ Việt Nam)
      this.riders = [
        { zOffset: 2.2, lane: -0.22, speed: 0.45, hasFlag: true, scale: 1.05, riderColor: '#ff3b30' },
        { zOffset: 4.5, lane: 0.18, speed: 0.38, hasFlag: true, scale: 0.95, riderColor: '#ffcc00' },
        { zOffset: 7.2, lane: -0.15, speed: 0.42, hasFlag: false, scale: 0.90, riderColor: '#00d8ff' }
      ];

      // Đàn chim đại bàng / chim én sải cánh bay lượn trên bầu trời Hà Giang
      this.birds = [];
      for (let i = 0; i < 12; i++) {
        this.birds.push({
          x: Math.random(),
          y: 0.12 + Math.random() * 0.28,
          speed: 0.02 + Math.random() * 0.025,
          size: 7 + Math.random() * 8,
          phase: Math.random() * Math.PI * 2
        });
      }

      // Đám mây sương bay lướt qua ống kính tiền cảnh tạo cảm giác tốc độ 3D
      this.windParticles = [];
      for (let i = 0; i < 40; i++) {
        this.windParticles.push({
          x: Math.random(),
          y: Math.random(),
          z: 0.2 + Math.random() * 0.8,
          size: 1.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    _bindEvents() {
      this._onResize = () => this._resize();
      this._onScroll = () => {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        this.targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      };
      this._onMouseMove = (e) => {
        if (!this.options.mouseParallax) return;
        this.targetMouse.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
        this.targetMouse.y = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      };

      window.addEventListener('resize', this._onResize, { passive: true });
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this._onScroll();
    }

    _resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxPixelRatio);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      this.glCanvas.width = w;
      this.glCanvas.height = h;
      this.worldCanvas.width = w;
      this.worldCanvas.height = h;
      this.dpr = dpr;

      if (this.gl) {
        this.gl.viewport(0, 0, w, h);
      }
    }

    // Hàm tính độ cong uốn lượn 3D của cung đường đèo Hà Giang tại khoảng cách z
    _getRoadCurveX(z) {
      return (
        Math.sin(z * 0.32) * 0.26 +
        Math.cos(z * 0.17 + 1.4) * 0.14 -
        0.18 // Nép nhẹ sang sườn núi bên trái để mở tầm nhìn ra hẻm vực sông Nho Quế & Cột cờ
      );
    }

    _getRoadElevationY(z) {
      return Math.sin(z * 0.24 + 0.8) * 0.035;
    }

    // Vẽ lá cờ đỏ sao vàng Việt Nam uốn lượn mềm mại bằng sóng vải 3D
    _drawWavingVietnamFlag(ctx, poleX, poleTopY, flagW, flagH, windSpeed, dpr) {
      const slices = 18;
      const sliceW = flagW / slices;
      const t = this.time * windSpeed;

      for (let i = 0; i < slices; i++) {
        const frac0 = i / slices;
        const frac1 = (i + 1) / slices;
        const x0 = poleX + frac0 * flagW;
        const x1 = poleX + frac1 * flagW;

        const wave0 = Math.sin(frac0 * 5.5 - t) * flagH * 0.18 * frac0;
        const wave1 = Math.sin(frac1 * 5.5 - t) * flagH * 0.18 * frac1;

        // Độ sáng tối theo nếp gấp vải cờ
        const shade = Math.cos(frac0 * 5.5 - t) * 22;
        const r = Math.min(255, Math.max(175, Math.floor(218 + shade)));
        const g = Math.min(60, Math.max(15, Math.floor(37 + shade * 0.4)));
        const b = Math.min(50, Math.max(12, Math.floor(29 + shade * 0.3)));

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.moveTo(x0, poleTopY + wave0);
        ctx.lineTo(x1 + 0.8, poleTopY + wave1);
        ctx.lineTo(x1 + 0.8, poleTopY + flagH + wave1 * 0.92);
        ctx.lineTo(x0, poleTopY + flagH + wave0 * 0.92);
        ctx.closePath();
        ctx.fill();
      }

      // Vẽ Ngôi Sao Vàng 5 Cánh ở chính giữa lá cờ (dịch chuyển đồng bộ theo sóng vải tại tâm cờ)
      const starFrac = 0.48;
      const starCenterX = poleX + flagW * starFrac;
      const starWaveY = Math.sin(starFrac * 5.5 - t) * flagH * 0.18 * starFrac;
      const starCenterY = poleTopY + flagH * 0.5 + starWaveY;
      const outerR = flagH * 0.30;
      const innerR = outerR * 0.382;

      ctx.save();
      ctx.translate(starCenterX, starCenterY);
      // Nghiêng nhẹ ngôi sao theo độ dốc sóng vải
      const slope = Math.cos(starFrac * 5.5 - t) * 0.18;
      ctx.rotate(slope);
      ctx.fillStyle = '#ffdd00';
      ctx.shadowColor = 'rgba(255, 221, 0, 0.6)';
      ctx.shadowBlur = 4 * dpr;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const sx = Math.cos(angle) * rad;
        const sy = Math.sin(angle) * rad;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Vẽ Cột cờ Lũng Cú / Cờ Tổ Quốc trên đỉnh núi phía xa
    _drawDistantMountainFlagpole(ctx, w, h, dpr) {
      const mx = this.currentMouse.x * 0.04;
      const my = this.currentMouse.y * 0.02;

      // Vị trí đỉnh núi đá bên phải nhìn xuống sông Nho Quế
      const peakX = (0.83 - mx) * w;
      const peakY = (0.43 - my + Math.sin(this.currentScroll * Math.PI) * 0.03) * h;

      ctx.save();
      // Vẽ mỏm núi đá tai mèo đỡ chân cột cờ Lũng Cú
      const rockGrad = ctx.createLinearGradient(peakX, peakY - 20 * dpr, peakX, h);
      rockGrad.addColorStop(0, '#16352e');
      rockGrad.addColorStop(0.5, '#0b211d');
      rockGrad.addColorStop(1, '#051110');
      ctx.fillStyle = rockGrad;
      ctx.beginPath();
      ctx.moveTo(peakX - 180 * dpr, h);
      ctx.lineTo(peakX - 95 * dpr, peakY + 55 * dpr);
      ctx.lineTo(peakX - 38 * dpr, peakY + 14 * dpr);
      ctx.lineTo(peakX, peakY);
      ctx.lineTo(peakX + 42 * dpr, peakY + 16 * dpr);
      ctx.lineTo(peakX + 115 * dpr, peakY + 75 * dpr);
      ctx.lineTo(peakX + 220 * dpr, h);
      ctx.closePath();
      ctx.fill();

      // Chân đài đá Cột cờ Lũng Cú
      ctx.fillStyle = '#2d3e3a';
      ctx.fillRect(peakX - 14 * dpr, peakY - 12 * dpr, 28 * dpr, 14 * dpr);
      ctx.fillStyle = '#435953';
      ctx.fillRect(peakX - 9 * dpr, peakY - 24 * dpr, 18 * dpr, 12 * dpr);

      // Thân cột cờ kim loại vươn cao lên bầu trời
      const poleHeight = 92 * dpr;
      const poleTopY = peakY - 24 * dpr - poleHeight;
      ctx.strokeStyle = '#d8e4e0';
      ctx.lineWidth = 3.2 * dpr;
      ctx.beginPath();
      ctx.moveTo(peakX, peakY - 24 * dpr);
      ctx.lineTo(peakX, poleTopY);
      ctx.stroke();

      // Lá cờ Tổ quốc Việt Nam lớn tung bay phấp phới trên đỉnh cột cờ
      this._drawWavingVietnamFlag(ctx, peakX, poleTopY + 2 * dpr, 68 * dpr, 44 * dpr, 7.5, dpr);
      ctx.restore();
    }

    // Vẽ Cung Đường Đèo Hà Giang 3D Uốn Lượn Liên Tục & Đoàn Xe Máy Phượt Đang Chạy
    _draw3DMountainPassAndRiders(ctx, w, h, dpr) {
      const steps = 65;
      const maxZ = 14.0;
      const minZ = 0.65;
      const horizonY = (0.48 - this.currentMouse.y * 0.025) * h;
      const camShiftX = this.currentMouse.x * 0.06;

      const roadPoints = [];
      for (let i = steps; i >= 0; i--) {
        const frac = i / steps; // 1.0 (xa ở chân trời) -> 0.0 (ngay sát màn hình)
        const z = minZ + Math.pow(frac, 1.65) * (maxZ - minZ);
        const worldZ = this.travelZ + z;

        const persp = 1.0 / z;
        const curveX = this._getRoadCurveX(worldZ) - this._getRoadCurveX(this.travelZ) * 0.35;
        const elevY = this._getRoadElevationY(worldZ);

        const sx = (0.44 + (curveX - camShiftX) * persp * 1.45) * w;
        const sy = horizonY + (0.42 + elevY) * persp * h * 0.92;
        const roadHalfW = Math.max(2 * dpr, 240 * dpr * persp);

        roadPoints.push({ z, worldZ, persp, sx, sy, roadHalfW, frac });
      }

      // 1. Vẽ nền vách đá ta-luy âm & mặt đường nhựa đèo Hà Giang từ xa đến gần
      for (let i = 0; i < roadPoints.length - 1; i++) {
        const pFar = roadPoints[i];
        const pNear = roadPoints[i + 1];

        // Vách đá bên dưới mép đường đèo (Ta-luy âm dựng đứng)
        ctx.fillStyle = i % 2 === 0 ? '#0c231e' : '#091c18';
        ctx.beginPath();
        ctx.moveTo(pFar.sx - pFar.roadHalfW * 1.15, pFar.sy);
        ctx.lineTo(pFar.sx + pFar.roadHalfW * 1.12, pFar.sy);
        ctx.lineTo(pNear.sx + pNear.roadHalfW * 1.12, pNear.sy + 45 * dpr * pNear.persp);
        ctx.lineTo(pNear.sx - pNear.roadHalfW * 1.25, pNear.sy + 55 * dpr * pNear.persp);
        ctx.closePath();
        ctx.fill();

        // Mặt đường nhựa Asphalt (có độ sáng bóng nhẹ của ánh nắng/đèn xe)
        const segmentStripe = Math.floor(pNear.worldZ * 2.5) % 2 === 0;
        ctx.fillStyle = segmentStripe ? '#1e2930' : '#233038';
        ctx.beginPath();
        ctx.moveTo(pFar.sx - pFar.roadHalfW, pFar.sy);
        ctx.lineTo(pFar.sx + pFar.roadHalfW, pFar.sy);
        ctx.lineTo(pNear.sx + pNear.roadHalfW, pNear.sy);
        ctx.lineTo(pNear.sx - pNear.roadHalfW, pNear.sy);
        ctx.closePath();
        ctx.fill();

        // Vạch kẻ trắng giới hạn 2 bên mép đèo
        ctx.strokeStyle = 'rgba(230, 242, 245, 0.55)';
        ctx.lineWidth = Math.max(1, 2.5 * dpr * pNear.persp);
        ctx.beginPath();
        ctx.moveTo(pFar.sx - pFar.roadHalfW * 0.9, pFar.sy);
        ctx.lineTo(pNear.sx - pNear.roadHalfW * 0.9, pNear.sy);
        ctx.moveTo(pFar.sx + pFar.roadHalfW * 0.9, pFar.sy);
        ctx.lineTo(pNear.sx + pNear.roadHalfW * 0.9, pNear.sy);
        ctx.stroke();

        // Vạch tim đường nét đứt màu vàng chạy liên tục tạo cảm giác lướt nhanh
        if (segmentStripe) {
          ctx.strokeStyle = '#ffca28';
          ctx.lineWidth = Math.max(1, 3.2 * dpr * pNear.persp);
          ctx.beginPath();
          ctx.moveTo(pFar.sx, pFar.sy);
          ctx.lineTo(pNear.sx, pNear.sy);
          ctx.stroke();
        }

        // Cọc tiêu hộ lan đèo Tây Bắc (Trắng - Đỏ) bên mép vực phải
        if (Math.floor(pNear.worldZ * 3.0) !== Math.floor(pFar.worldZ * 3.0) && pNear.z < 10.5) {
          const postX = pNear.sx + pNear.roadHalfW * 0.96;
          const postY = pNear.sy;
          const postH = 18 * dpr * pNear.persp;
          const postW = Math.max(1.5, 4.2 * dpr * pNear.persp);

          ctx.fillStyle = '#f5f7fa';
          ctx.fillRect(postX - postW * 0.5, postY - postH, postW, postH);
          ctx.fillStyle = '#e53935';
          ctx.fillRect(postX - postW * 0.5, postY - postH * 0.85, postW, postH * 0.35);
        }
      }

      // 2. VẼ ĐOÀN XE MÁY PHƯỢT ĐANG DI CHUYỂN TRÊN CUNG ĐƯỜNG ĐÈO
      for (let rIdx = 0; rIdx < this.riders.length; rIdx++) {
        const rider = this.riders[rIdx];
        // Quãng đường tương đối của từng xe để xe chạy nhấp nhô tự nhiên trên đèo
        const dynamicZ =
          rider.zOffset + Math.sin(this.time * 0.9 + rIdx * 2.1) * 0.55;
        const worldZ = this.travelZ + dynamicZ;
        const persp = 1.0 / dynamicZ;

        const curveNow = this._getRoadCurveX(worldZ) - this._getRoadCurveX(this.travelZ) * 0.35;
        const curveAhead = this._getRoadCurveX(worldZ + 0.5) - this._getRoadCurveX(this.travelZ) * 0.35;
        const elevY = this._getRoadElevationY(worldZ);

        const roadCenterX = (0.44 + (curveNow - camShiftX) * persp * 1.45) * w;
        const roadHalfW = 240 * dpr * persp;
        const bikeX = roadCenterX + rider.lane * roadHalfW;
        const bikeY = horizonY + (0.42 + elevY) * persp * h * 0.92;

        // Độ nghiêng xe khi ôm cua đèo Hà Giang
        const leanAngle = clamp((curveAhead - curveNow) * 2.8, -0.28, 0.28);
        const sz = 44 * dpr * persp * rider.scale;

        ctx.save();
        ctx.translate(bikeX, bikeY);

        // Chùm tia đèn pha LED chiếu sáng mặt đường phía trước xe máy
        const beamGrad = ctx.createRadialGradient(0, -sz * 0.4, sz * 0.1, sz * leanAngle * 2.5, -sz * 2.6, sz * 2.8);
        beamGrad.addColorStop(0, 'rgba(255, 245, 190, 0.55)');
        beamGrad.addColorStop(0.5, 'rgba(255, 230, 140, 0.18)');
        beamGrad.addColorStop(1, 'rgba(255, 230, 140, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.25, -sz * 0.3);
        ctx.lineTo(-sz * 1.6, -sz * 2.8);
        ctx.lineTo(sz * 1.6, -sz * 2.8);
        ctx.lineTo(sz * 0.25, -sz * 0.3);
        ctx.closePath();
        ctx.fill();

        // Bóng đổ của xe máy dưới mặt đường nhựa
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.ellipse(0, sz * 0.06, sz * 0.48, sz * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nghiêng thân xe & phượt thủ theo góc ôm cua
        ctx.rotate(leanAngle);

        // Bánh xe sau & phuộc xe
        ctx.fillStyle = '#111619';
        ctx.beginPath();
        ctx.roundRect(-sz * 0.14, -sz * 0.48, sz * 0.28, sz * 0.50, sz * 0.08);
        ctx.fill();

        // Vành kim loại phản quang chuyển động
        ctx.strokeStyle = 'rgba(200, 220, 230, 0.5)';
        ctx.lineWidth = Math.max(1, sz * 0.04);
        ctx.beginPath();
        ctx.moveTo(0, -sz * 0.08);
        ctx.lineTo(0, -sz * 0.42);
        ctx.stroke();

        // Thùng đồ nhôm Adventure 2 bên hông xe (Panniers)
        ctx.fillStyle = '#8fa3ad';
        ctx.fillRect(-sz * 0.42, -sz * 0.58, sz * 0.22, sz * 0.28);
        ctx.fillRect(sz * 0.20, -sz * 0.58, sz * 0.22, sz * 0.28);

        // Thân xe & Đèn hậu LED đỏ rực
        ctx.fillStyle = '#263238';
        ctx.beginPath();
        ctx.roundRect(-sz * 0.22, -sz * 0.75, sz * 0.44, sz * 0.35, sz * 0.08);
        ctx.fill();

        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 10 * dpr;
        ctx.fillStyle = '#ff1744';
        ctx.beginPath();
        ctx.arc(0, -sz * 0.56, sz * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Lưng áo phượt thủ & Mũ bảo hiểm Fullface
        ctx.fillStyle = '#1c262b';
        ctx.beginPath();
        ctx.roundRect(-sz * 0.26, -sz * 1.18, sz * 0.52, sz * 0.48, sz * 0.14);
        ctx.fill();

        // Sọc áo phản quang của phượt thủ
        ctx.fillStyle = rider.riderColor;
        ctx.fillRect(-sz * 0.20, -sz * 1.02, sz * 0.40, sz * 0.10);

        // Tay lái rộng (Handlebars) & Gương chiếu hậu
        ctx.strokeStyle = '#cfd8dc';
        ctx.lineWidth = Math.max(1.5, sz * 0.06);
        ctx.beginPath();
        ctx.moveTo(-sz * 0.48, -sz * 0.98);
        ctx.lineTo(sz * 0.48, -sz * 0.98);
        ctx.stroke();

        // Mũ bảo hiểm Fullface
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.arc(0, -sz * 1.32, sz * 0.20, 0, Math.PI * 2);
        ctx.fill();

        // CỜ ĐỎ SAO VÀNG VIỆT NAM GẮN SAU XE MÁY BAY PHẤP PHỚI TRONG GIÓ ĐÈO
        if (rider.hasFlag) {
          const flagPoleX = sz * 0.18;
          const flagPoleBotY = -sz * 0.58;
          const flagPoleTopY = -sz * 1.62;

          ctx.strokeStyle = '#e0e0e0';
          ctx.lineWidth = Math.max(1.2, sz * 0.045);
          ctx.beginPath();
          ctx.moveTo(flagPoleX, flagPoleBotY);
          ctx.lineTo(flagPoleX, flagPoleTopY);
          ctx.stroke();

          this._drawWavingVietnamFlag(
            ctx,
            flagPoleX,
            flagPoleTopY,
            sz * 0.95,
            sz * 0.62,
            11.5,
            dpr
          );
        }

        ctx.restore();
      }
    }

    // Vẽ Logo Chữ 3D "SKYHAGIANGLOOT" tối ưu hóa hòa hợp với màu nền và bay lượn theo vị trí cuộn trang
    _drawFloatingBrandLogo(ctx, w, h, dpr) {
      if (!this.options.showLogo || !this.options.logoText) return;

      const text = this.options.logoText;
      const s = this.currentScroll;
      const t = this.time;

      // Quỹ đạo bay lượn mượt mà của Logo khi người dùng cuộn trang từ trên xuống dưới:
      // Lượn theo hình sin mềm mại trên bầu trời đèo Hà Giang và nghiêng 3D theo vận tốc cuộn
      const glideX = w * (0.50 + Math.sin(s * Math.PI * 2.0) * 0.09 + this.currentMouse.x * 0.025);
      const glideY = h * (0.20 + Math.sin(s * Math.PI * 3.0 + t * 0.8) * 0.035 + this.currentMouse.y * 0.02);

      // Tự động đổi bảng màu chữ để hòa hợp hoàn hảo với bầu trời từng độ cao cuộn trang
      let gradTop, gradMid, gradBot, glowColor;
      if (s < 0.33) {
        // Hòa hợp với Bình Minh Săn Mây (Vàng Kim - Trắng Sương - Cam Đào)
        gradTop = '#ffffff';
        gradMid = '#ffe599';
        gradBot = '#ff9e5e';
        glowColor = 'rgba(255, 190, 95, 0.55)';
      } else if (s < 0.68) {
        // Hòa hợp với Sông Nho Quế & Núi Đá Tai Mèo (Trắng Tuyết - Xanh Ngọc Bích - Vàng Nắng)
        gradTop = '#ffffff';
        gradMid = '#a8ffeb';
        gradBot = '#26d0ce';
        glowColor = 'rgba(56, 249, 215, 0.55)';
      } else {
        // Hòa hợp với Hoàng Hôn & Đêm Sao Lũng Cú (Vàng Sao - Hồng Hoàng Hôn - Xanh Cực Quang)
        gradTop = '#fff6d6';
        gradMid = '#ffbe76';
        gradBot = '#ff6b6b';
        glowColor = 'rgba(255, 140, 90, 0.6)';
      }

      const baseFontSize = Math.min(w / (text.length * 0.85), 54 * dpr);
      const fontSize = Math.max(22 * dpr, baseFontSize);

      ctx.save();
      ctx.translate(glideX, glideY);

      // Nghiêng nhẹ theo quán tính khi người dùng cuộn trang lên/xuống
      const tiltAngle = clamp(this.scrollVelocity * 0.06, -0.14, 0.14) + Math.cos(t * 1.1 + s * 4.0) * 0.025;
      ctx.rotate(tiltAngle);

      // Vẽ vệt mây / luồng sáng khí động học phía sau chữ SKYHAGIANGLOOT
      const auraGrad = ctx.createRadialGradient(0, 0, fontSize * 0.2, 0, 0, fontSize * 5.2);
      auraGrad.addColorStop(0, glowColor);
      auraGrad.addColorStop(0.5, 'rgba(15, 55, 65, 0.18)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, fontSize * 5.2, fontSize * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `900 ${fontSize}px "Segoe UI", system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Từng chữ cái trong SKYHAGIANGLOOT lượn sóng 3D độc lập như đang bay trong gió núi
      const spacing = fontSize * 0.76;
      const totalWidth = (text.length - 1) * spacing;

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const charOffset = i - (text.length - 1) / 2;
        const cx = charOffset * spacing;
        const waveY =
          Math.sin(t * 2.4 + i * 0.42 + s * 10.0) * (6.5 * dpr) +
          Math.cos(t * 1.5 - i * 0.3) * (2.5 * dpr);
        const charScale = 1.0 + Math.sin(t * 2.0 + i * 0.5 + s * 8.0) * 0.04;

        ctx.save();
        ctx.translate(cx, waveY);
        ctx.scale(charScale, charScale);

        // Lớp bóng chiều sâu 3D hòa vào sương núi
        ctx.fillStyle = 'rgba(4, 20, 26, 0.55)';
        ctx.fillText(ch, 0, 4 * dpr);

        // Lớp màu chữ Gradient hòa quyện với màu bầu trời & núi rừng
        const charGrad = ctx.createLinearGradient(0, -fontSize * 0.55, 0, fontSize * 0.55);
        charGrad.addColorStop(0, gradTop);
        charGrad.addColorStop(0.52, gradMid);
        charGrad.addColorStop(1, gradBot);

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 16 * dpr;
        ctx.fillStyle = charGrad;
        ctx.fillText(ch, 0, 0);

        // Viền sáng kim loại mỏng giúp chữ luôn sắc nét tuyệt đối trên mọi nền mây
        ctx.lineWidth = 1.2 * dpr;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.strokeText(ch, 0, 0);

        ctx.restore();
      }

      // Dòng phụ đề nhỏ tinh tế bên dưới Logo chữ
      const subSize = Math.max(10 * dpr, fontSize * 0.24);
      ctx.font = `700 ${subSize}px "Segoe UI", system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.letterSpacing = `${4 * dpr}px`;
      const subtitleY = fontSize * 0.82 + Math.sin(t * 2.0 + s * 6.0) * 3 * dpr;
      ctx.fillText('★ HA GIANG LOOP ADVENTURE · VIETNAM ★', 0, subtitleY);

      ctx.restore();
    }

    _renderWorld(w, h, dpr) {
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // 1. Đàn chim sải cánh bay qua thung lũng sông Nho Quế
      const t = this.time;
      for (const b of this.birds) {
        b.x = (b.x + b.speed * 0.0025) % 1.15;
        const bx = (b.x - 0.07 - this.currentMouse.x * 0.02) * w;
        const by = (b.y + Math.sin(t * 1.4 + b.phase) * 0.015) * h;
        const wing = Math.sin(t * 5.5 + b.phase) * b.size * dpr * 0.55;
        const sz = b.size * dpr;

        ctx.save();
        ctx.translate(bx, by);
        ctx.strokeStyle = 'rgba(255, 250, 240, 0.78)';
        ctx.lineWidth = 1.8 * dpr;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-sz, wing);
        ctx.quadraticCurveTo(-sz * 0.4, -sz * 0.35, 0, 0);
        ctx.quadraticCurveTo(sz * 0.4, -sz * 0.35, sz, wing);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Cột cờ Lũng Cú / Cờ Tổ Quốc trên đỉnh núi đá phía xa
      this._drawDistantMountainFlagpole(ctx, w, h, dpr);

      // 3. Cung đường đèo Hà Giang 3D uốn lượn & Đoàn xe máy phượt đang chạy
      this._draw3DMountainPassAndRiders(ctx, w, h, dpr);

      // 4. Hạt nắng & sương núi bay lướt qua ống kính theo tốc độ chạy xe
      for (const wp of this.windParticles) {
        wp.x = (wp.x - 0.0012 * wp.z + 1.0) % 1.0;
        wp.y = (wp.y - this.scrollVelocity * 0.002 * wp.z + 1.0) % 1.0;
        const px = wp.x * w;
        const py = wp.y * h;
        const r = wp.size * wp.z * dpr;
        const alpha = (0.15 + 0.25 * Math.sin(t * 2.5 + wp.phase)) * wp.z;

        ctx.fillStyle = `rgba(255, 248, 225, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Logo chữ 3D "SKYHAGIANGLOOT" hòa hợp màu nền & bay lượn theo cuộn trang
      this._drawFloatingBrandLogo(ctx, w, h, dpr);
    }

    _animate(now) {
      if (this.isDestroyed) return;
      if (document.hidden) { this.lastFrame = now; requestAnimationFrame(this._animate); return; }
      if (now - this.lastRender < 1000 / 30) { requestAnimationFrame(this._animate); return; }
      this.lastRender = now;
      const dt = Math.min(0.05, (now - this.lastFrame) * 0.001);
      this.lastFrame = now;
      this.time = now * 0.001;

      const prevScroll = this.currentScroll;
      this.currentScroll += (this.targetScroll - this.currentScroll) * 0.08;
      this.scrollVelocity = (this.currentScroll - prevScroll) * 60.0;

      // Quãng đường di chuyển trên đèo tăng liên tục theo cả thời gian thực VÀ thao tác lướt trang
      this.travelZ += dt * this.options.autoDriveSpeed + Math.abs(this.currentScroll - prevScroll) * 28.0 * this.options.scrollSensitivity;

      this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.06;
      this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.06;

      if (this.gl && this.program) {
        const gl = this.gl;
        gl.useProgram(this.program);

        gl.uniform2f(this.uniforms.resolution, this.glCanvas.width, this.glCanvas.height);
        gl.uniform1f(this.uniforms.time, this.time);
        gl.uniform1f(this.uniforms.scroll, this.currentScroll);
        gl.uniform1f(this.uniforms.travelZ, this.travelZ);
        gl.uniform2f(this.uniforms.mouse, this.currentMouse.x, this.currentMouse.y);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      this._renderWorld(this.worldCanvas.width, this.worldCanvas.height, this.dpr);
      requestAnimationFrame(this._animate);
    }

    destroy() {
      this.isDestroyed = true;
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('mousemove', this._onMouseMove);
      if (this.wrapper && this.wrapper.parentNode) {
        this.wrapper.parentNode.removeChild(this.wrapper);
      }
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  global.NatureBackground = NatureBackground;
})(typeof window !== 'undefined' ? window : this);
