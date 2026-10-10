/**
 * NatureBackground v7.0 — SKYHAGIANGLOOT Multi-Destination Vertical Panorama Engine
 * Hành trình cuộn dọc xuyên suốt 5 tuyệt tác thiên nhiên & du lịch Việt Nam (1280x2665):
 *   1. (0% - 20%)  Đỉnh Đèo Mã Pí Lèng, Biển Mây Bình Minh & Cột Cờ Lũng Cú (Hà Giang)
 *   2. (20% - 40%) Thung Lũng Ruộng Bậc Thang Mù Cang Chải Mùa Vàng & Suối Nắng Sớm (Tây Bắc)
 *   3. (40% - 60%) Đại Ngàn Thác Bản Giốc Hùng Vĩ & Hồ Sông Quây Sơn Xanh Ngọc (Cao Bằng)
 *   4. (60% - 80%) Cung Đường Đèo Ven Biển Vĩnh Hy - Hải Vân & Vịnh Đại Dương (Miền Trung)
 *   5. (80% - 100%) Vịnh Đảo Hạ Long - Cát Bà Hoàng Hôn, Du Thuyền & Lửa Trại Bãi Biển
 *
 * Cải tiến v7.0:
 *   - 5 bối cảnh du lịch Việt Nam đa dạng, hoàn toàn không lặp lại cảnh hay góc máy.
 *   - Xử lý chuyển động Lá Cờ Tổ Quốc bằng thuật toán tách sắc độ vải đỏ/sao vàng (Chromatic Fabric Isolation):
 *     chỉ tạo gợn sóng ánh sáng & nếp gấp lụa 3D tự nhiên bên trong thân cờ, tuyệt đối không làm méo nền trời/núi đá.
 *   - Loại bỏ hoàn toàn chi tiết vẽ 2D giả tạo; giữ nguyên độ chân thực nhiếp ảnh 8K kết hợp chuyển động thác đổ,
 *     sóng biển, biển mây, nắng chiếu, lửa trại bập bùng và Logo "SKYHAGIANGLOOT" bay lượn theo vị trí cuộn trang.
 */
(function (global) {
  'use strict';

  const MASTER_PANORAMA_B64 = '/assets/ha-giang-panorama.jpg';

  const VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // UNPACK_FLIP_Y_WEBGL = false -> pUV.y = 0.0 là Đỉnh Hà Giang (đầu trang), pUV.y = 1.0 là Bãi Biển Hạ Long (cuối trang)
  const FRAGMENT_SHADER = `
    precision highp float;
    varying vec2 v_uv;

    uniform sampler2D u_panorama;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_scroll;     // 0.0 (Đầu trang) -> 1.0 (Cuối trang)
    uniform float u_scrollVel;
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
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.02 + vec2(11.3, 27.9);
        a *= 0.5;
      }
      return v;
    }

    // Hiệu ứng Cờ Đỏ Sao Vàng tự nhiên bằng Chromatic Fabric Isolation:
    // Tuyệt đối KHÔNG bóp méo bầu trời/cây cối xung quanh lá cờ; chỉ tạo nếp gấp ánh sáng lụa 3D
    // và dao động vi mô bên trong điểm ảnh vải đỏ/sao vàng thực tế!
    void animateFlagFabric(vec2 pUV, inout vec3 col, vec2 boxMin, vec2 boxMax, float poleX, float speed) {
      float inBox = step(boxMin.x, pUV.x) * step(pUV.x, boxMax.x) *
                    step(boxMin.y, pUV.y) * step(pUV.y, boxMax.y);
      if (inBox > 0.5) {
        // Nhận diện chính xác điểm ảnh vải cờ đỏ hoặc ngôi sao vàng (R cao và R vượt trội so với B)
        float isFabric = smoothstep(0.16, 0.36, col.r - col.b) * smoothstep(0.38, 0.56, col.r);
        if (isFabric > 0.01) {
          float spanX = max(0.004, boxMax.x - poleX);
          float distFromPole = clamp((pUV.x - poleX) / spanX, 0.0, 1.0);

          // Sóng gió lướt nhẹ từ cán cờ ra đuôi cờ
          float phase = distFromPole * 9.5 - u_time * speed + (pUV.y - boxMin.y) * 55.0;
          float clothWave = sin(phase) * 0.65 + cos(phase * 1.7 - u_time * (speed * 0.6)) * 0.35;

          // Dịch chuyển vi mô chỉ khi cả điểm gốc và điểm đích đều nằm trong mặt vải cờ
          vec2 flutterUV = pUV + vec2(0.0, clothWave * 0.00028 * distFromPole);
          vec3 targetCol = texture2D(u_panorama, flutterUV).rgb;
          float isTargetFabric = smoothstep(0.20, 0.38, targetCol.r - targetCol.b) * smoothstep(0.40, 0.58, targetCol.r);

          col = mix(col, targetCol, isFabric * isTargetFabric * 0.80);

          // Ánh sáng & bóng đổ nếp gấp lụa 3D tự nhiên dưới nắng
          float silkShade = clothWave * distFromPole * isFabric;
          col *= 1.0 + 0.14 * silkShade;
        }
      }
    }

    void main() {
      // Đổi v_uv sang hệ tọa độ màn hình tính từ đỉnh xuống (0.0 ở mép trên, 1.0 ở mép dưới)
      vec2 screenTD = vec2(v_uv.x, 1.0 - v_uv.y);

      // Cửa sổ hiển thị chiếm 25% chiều cao bức tranh toàn cảnh -> cuộn mượt qua 5 tầng địa danh
      float viewWindowH = 0.25;
      float viewWindowW = 0.94;

      float scrollTop = clamp(u_scroll, 0.0, 1.0) * (1.0 - viewWindowH);
      float mouseShiftX = (1.0 - viewWindowW) * 0.5 + u_mouse.x * 0.022;
      float mouseShiftY = -u_mouse.y * 0.006;

      vec2 pUV = vec2(
        clamp(mouseShiftX + screenTD.x * viewWindowW, 0.002, 0.998),
        clamp(scrollTop + screenTD.y * viewWindowH + mouseShiftY, 0.002, 0.998)
      );

      vec3 extraLight = vec3(0.0);

      // 1. GỢN NƯỚC MẶT RUỘNG BẬC THANG MÙ CANG CHẢI (pUV.y: 0.30..0.41)
      float terraceWaterZone = smoothstep(0.25, 0.33, pUV.x) * smoothstep(0.60, 0.50, pUV.x) *
                               smoothstep(0.30, 0.33, pUV.y) * smoothstep(0.41, 0.38, pUV.y);
      if (terraceWaterZone > 0.01) {
        float tw = sin(pUV.y * 340.0 - u_time * 3.0) * cos(pUV.x * 120.0 + u_time * 2.2);
        pUV.x += tw * 0.0012 * terraceWaterZone;
      }

      // 2. SÓNG NƯỚC HỒ THÁC BẢN GIỐC & SÔNG QUÂY SƠN (pUV.y: 0.53..0.60)
      float bgRiverZone = smoothstep(0.35, 0.42, pUV.x) * smoothstep(0.92, 0.82, pUV.x) *
                          smoothstep(0.53, 0.55, pUV.y) * smoothstep(0.61, 0.58, pUV.y);
      if (bgRiverZone > 0.01) {
        float rw = sin(pUV.x * 110.0 + u_time * 2.8) * cos(pUV.y * 290.0 - u_time * 2.4);
        pUV.x += rw * 0.0018 * bgRiverZone;
      }

      // 3. SÓNG BIỂN ĐẠI DƯƠNG ĐÈO VĨNH HY / HẢI VÂN (pUV.x: 0.43..0.99, pUV.y: 0.57..0.77)
      float oceanZone = smoothstep(0.43, 0.52, pUV.x) *
                        smoothstep(0.57, 0.60, pUV.y) * smoothstep(0.77, 0.73, pUV.y);
      // Bảo vệ chiếc tàu gỗ (0.818, 0.658) không bị méo mà chỉ nhấp nhô nhẹ theo sóng
      float fishingBoat = smoothstep(0.055, 0.02, length((pUV - vec2(0.818, 0.658)) * vec2(1.0, 2.5)));
      if (fishingBoat > 0.01) {
        pUV.y += sin(u_time * 2.2) * 0.0005 * fishingBoat;
      }
      float activeOcean = oceanZone * (1.0 - fishingBoat);
      if (activeOcean > 0.01) {
        float ow1 = sin(pUV.x * 85.0 + u_time * 2.6) * cos(pUV.y * 240.0 - u_time * 2.0);
        float ow2 = noise(vec2(pUV.x * 50.0 + u_time * 1.2, pUV.y * 150.0 - u_time * 1.6)) - 0.5;
        float oRipple = (ow1 * 0.45 + ow2 * 0.55) * activeOcean;
        pUV.x += oRipple * 0.0022;
        pUV.y += oRipple * 0.0008;
        extraLight += vec3(0.45, 0.90, 0.95) * smoothstep(0.18, 0.40, oRipple) * 0.16 * activeOcean;
      }

      // 4. MẶT NƯỚC VỊNH HẠ LONG HOÀNG HÔN (pUV.x: 0.06..0.98, pUV.y: 0.79..0.93)
      float halongWater = smoothstep(0.06, 0.14, pUV.x) * smoothstep(0.99, 0.92, pUV.x) *
                          smoothstep(0.79, 0.82, pUV.y) * smoothstep(0.93, 0.90, pUV.y);
      // Bảo vệ các du thuyền gỗ trên vịnh không bị biến dạng
      float cruise1 = smoothstep(0.06, 0.025, length((pUV - vec2(0.545, 0.865)) * vec2(1.0, 2.4)));
      float cruise2 = smoothstep(0.06, 0.025, length((pUV - vec2(0.698, 0.870)) * vec2(1.0, 2.4)));
      float cruise3 = smoothstep(0.05, 0.020, length((pUV - vec2(0.608, 0.838)) * vec2(1.0, 2.4)));
      float cruise4 = smoothstep(0.05, 0.020, length((pUV - vec2(0.830, 0.850)) * vec2(1.0, 2.4)));
      float allBoats = clamp(cruise1 + cruise2 + cruise3 + cruise4, 0.0, 1.0);

      float activeHalong = halongWater * (1.0 - allBoats);
      if (activeHalong > 0.01) {
        float hw = sin(pUV.x * 95.0 - u_time * 2.2) * cos(pUV.y * 260.0 + u_time * 1.8);
        pUV.x += hw * 0.0015 * activeHalong;
        // Ánh nắng hoàng hôn vàng cam lấp lánh trên mặt vịnh phía bên phải
        float sunsetGlint = smoothstep(0.55, 0.92, pUV.x) * smoothstep(0.20, 0.45, hw);
        extraLight += vec3(1.0, 0.78, 0.38) * sunsetGlint * 0.18 * activeHalong;
      }

      // Lấy màu gốc chất lượng cao từ bức tranh toàn cảnh
      vec3 col = texture2D(u_panorama, pUV).rgb;
      float lum = (col.r + col.g + col.b) * 0.3333;

      // 5. CHUYỂN ĐỘNG TỰ NHIÊN CHO 4 LÁ CỜ VIỆT NAM (chỉ tác động lên vải cờ, không làm méo nền)
      // Cờ 1: Cột cờ Lũng Cú trên đỉnh núi Hà Giang
      animateFlagFabric(pUV, col, vec2(0.904, 0.055), vec2(0.950, 0.082), 0.909, 4.2);
      // Cờ 2: Cờ nhỏ sau xe mô-tô trên đèo Mù Cang Chải
      animateFlagFabric(pUV, col, vec2(0.652, 0.360), vec2(0.685, 0.382), 0.656, 5.0);
      // Cờ 3: Cờ Tổ Quốc bên Thác Bản Giốc
      animateFlagFabric(pUV, col, vec2(0.300, 0.500), vec2(0.338, 0.532), 0.305, 4.0);
      // Cờ 4: Cờ trên tàu gỗ Vịnh Vĩnh Hy
      animateFlagFabric(pUV, col, vec2(0.838, 0.637), vec2(0.870, 0.656), 0.843, 4.6);

      // 6. DÒNG THÁC BẢN GIỐC TUÔN CHẢY TRẮNG XÓA LIÊN TỤC (pUV.x: 0.12..0.93, pUV.y: 0.44..0.57)
      float wfRegion = smoothstep(0.11, 0.16, pUV.x) * smoothstep(0.94, 0.88, pUV.x) *
                       smoothstep(0.44, 0.46, pUV.y) * smoothstep(0.575, 0.550, pUV.y);
      // Loại trừ vùng lá cờ Tổ Quốc bên thác để không ảnh hưởng màu đỏ của cờ
      float notFlag = 1.0 - smoothstep(0.15, 0.30, col.r - col.b);
      float isWhiteWater = smoothstep(0.52, 0.78, lum) * notFlag;
      float wfMask = wfRegion * isWhiteWater;

      if (wfMask > 0.01) {
        float flow1 = fbm(vec2(pUV.x * 52.0, pUV.y * 30.0 - u_time * 3.8));
        float flow2 = fbm(vec2(pUV.x * 90.0 + 3.7, pUV.y * 48.0 - u_time * 5.6));
        float cascade = flow1 * 0.55 + flow2 * 0.45;
        vec2 flowUV = pUV + vec2(0.0, (cascade - 0.5) * 0.0085 * wfMask);
        vec3 flowedCol = texture2D(u_panorama, flowUV).rgb;
        col = mix(col, flowedCol, 0.72 * wfMask);
        col += vec3(0.92, 0.98, 1.0) * (cascade - 0.42) * 0.32 * wfMask;
      }

      // Sương nước bốc lên mờ ảo dưới chân Thác Bản Giốc
      float wfMistZone = smoothstep(0.16, 0.28, pUV.x) * smoothstep(0.90, 0.75, pUV.x) *
                         smoothstep(0.51, 0.54, pUV.y) * smoothstep(0.59, 0.56, pUV.y);
      if (wfMistZone > 0.01) {
        float mistNoise = fbm(vec2(pUV.x * 6.0 - u_time * 0.22, pUV.y * 18.0 + u_time * 0.35));
        col = mix(col, vec3(0.90, 0.97, 0.96), wfMistZone * mistNoise * 0.28);
      }

      // 7. BIỂN MÂY BÌNH MINH HÀ GIANG TRÔI BỒNG BỀNH (pUV.y: 0.08..0.24)
      float cloudSeaZone = smoothstep(0.08, 0.12, pUV.y) * smoothstep(0.25, 0.19, pUV.y);
      if (cloudSeaZone > 0.01) {
        float isCloud = smoothstep(0.54, 0.82, lum);
        float drift = fbm(vec2(pUV.x * 4.5 - u_time * 0.05, pUV.y * 14.0 - u_time * 0.015));
        col = mix(col, vec3(0.99, 0.96, 0.92), cloudSeaZone * isCloud * drift * 0.32);
      }

      // 8. BỌT SÓNG TRẮNG VỖ BỜ ĐÁ VEN BIỂN VĨNH HY (pUV.x: 0.41..0.68, pUV.y: 0.62..0.76)
      float surfZone = smoothstep(0.40, 0.44, pUV.x) * smoothstep(0.68, 0.58, pUV.x) *
                       smoothstep(0.62, 0.64, pUV.y) * smoothstep(0.76, 0.73, pUV.y);
      if (surfZone > 0.01) {
        float isFoam = smoothstep(0.62, 0.85, lum);
        float surfPulse = sin(pUV.y * 180.0 + pUV.x * 90.0 - u_time * 3.2) * 0.5 + 0.5;
        col += vec3(0.92, 0.98, 1.0) * surfZone * isFoam * surfPulse * 0.24;
      }

      // 9. TIA NẮNG BÌNH MINH HÀ GIANG & NẮNG SỚM MÙ CANG CHẢI
      if (pUV.y < 0.38) {
        vec2 sunOrigin = vec2(0.06, 0.16);
        vec2 d = (pUV - sunOrigin) * vec2(1.0, 2.4);
        float ang = atan(d.y, d.x);
        float rays = (sin(ang * 14.0 + u_time * 0.32) * 0.5 + 0.5) *
                     (sin(ang * 9.0 - u_time * 0.22) * 0.5 + 0.5);
        float rayMask = exp(-length(d) * 1.5) * smoothstep(0.38, 0.14, pUV.y) * smoothstep(0.02, 0.14, pUV.y);
        col += vec3(1.0, 0.88, 0.55) * rays * rayMask * 0.20;
      }

      // 10. LỬA TRẠI BẬP BÙNG & ĐÈN LỒNG BÃI BIỂN HẠ LONG VỀ ĐÊM (pUV.y > 0.88)
      if (pUV.y > 0.88) {
        // Ngọn lửa trại tại bãi cát (0.488, 0.968)
        float fireDist = length((pUV - vec2(0.488, 0.968)) * vec2(1.0, 2.6));
        float flicker = 0.78 + 0.22 * (sin(u_time * 11.0) * 0.6 + cos(u_time * 17.3) * 0.4);
        float fireGlow = exp(-fireDist * 18.0) * flicker;
        extraLight += vec3(1.0, 0.58, 0.16) * fireGlow * 0.42;

        // Ánh đèn lồng dọc cầu cảng gỗ (0.66..0.74, 0.91..0.97)
        float pierDist = length((pUV - vec2(0.695, 0.935)) * vec2(1.0, 2.2));
        float lanternGlow = exp(-pierDist * 16.0) * (0.85 + 0.15 * sin(u_time * 4.5));
        extraLight += vec3(1.0, 0.72, 0.28) * lanternGlow * 0.25;
      }

      col += extraLight;
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
          mouseParallax: true,
          maxPixelRatio: 2.0,
          zIndex: -1
        },
        options
      );

      this.time = 0;
      this.targetScroll = 0;
      this.currentScroll = 0;
      this.scrollVelocity = 0;
      this.targetMouse = { x: 0, y: 0 };
      this.currentMouse = { x: 0, y: 0 };
      this.isDestroyed = false;

      this._initDOM();
      this._initWebGL();
      this._initLiveWorldOverlay();
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
        backgroundColor: '#0a1d24'
      });

      this.glCanvas = document.createElement('canvas');
      Object.assign(this.glCanvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block'
      });

      this.overlayCanvas = document.createElement('canvas');
      Object.assign(this.overlayCanvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block'
      });

      this.wrapper.appendChild(this.glCanvas);
      this.wrapper.appendChild(this.overlayCanvas);

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
      if (!gl) return;

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
        panorama: gl.getUniformLocation(prog, 'u_panorama'),
        resolution: gl.getUniformLocation(prog, 'u_resolution'),
        time: gl.getUniformLocation(prog, 'u_time'),
        scroll: gl.getUniformLocation(prog, 'u_scroll'),
        scrollVel: gl.getUniformLocation(prog, 'u_scrollVel'),
        mouse: gl.getUniformLocation(prog, 'u_mouse')
      };

      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([15, 38, 42, 255])
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (this.isDestroyed) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };
      img.src = MASTER_PANORAMA_B64;

      gl.uniform1i(this.uniforms.panorama, 0);
      this._resize();
    }

    _initLiveWorldOverlay() {
      this.ctx = this.overlayCanvas.getContext('2d');

      // 1. Đàn chim bay lượn tự nhiên qua 5 vùng danh thắng
      this.birds = [];
      for (let i = 0; i < 14; i++) {
        this.birds.push({
          px: Math.random(),
          py: 0.04 + (i / 14) * 0.84,
          speed: 0.015 + Math.random() * 0.018,
          size: 5.5 + Math.random() * 6.0,
          phase: Math.random() * Math.PI * 2
        });
      }

      // 2. Các dải mây sương mỏng bay ngang qua các vùng chuyển cảnh giúp hòa quyện chiều sâu 3D
      const transitionHeights = [0.16, 0.21, 0.24, 0.38, 0.41, 0.44, 0.55, 0.58, 0.61, 0.74, 0.77, 0.80];
      this.mistClouds = [];
      for (let i = 0; i < transitionHeights.length; i++) {
        this.mistClouds.push({
          px: Math.random(),
          py: transitionHeights[i],
          w: 0.28 + Math.random() * 0.24,
          h: 0.038 + Math.random() * 0.032,
          speed: (i % 2 === 0 ? 1 : -1) * (0.007 + Math.random() * 0.010),
          alpha: 0.11 + Math.random() * 0.12
        });
      }

      // 3. Các hạt đom đóm / tàn lửa ấm áp bay lên tại bãi biển cắm trại Vịnh Hạ Long (py: 0.86..0.99)
      this.embers = [];
      for (let i = 0; i < 18; i++) {
        this.embers.push({
          px: 0.36 + Math.random() * 0.42,
          py: 0.88 + Math.random() * 0.11,
          speedY: 0.004 + Math.random() * 0.006,
          radius: 1.5 + Math.random() * 2.2,
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
      this.overlayCanvas.width = w;
      this.overlayCanvas.height = h;
      this.dpr = dpr;

      if (this.gl) {
        this.gl.viewport(0, 0, w, h);
      }
    }

    _panoramaToScreen(px, py, w, h) {
      const viewWindowH = 0.25;
      const viewWindowW = 0.94;
      const scrollTop = this.currentScroll * (1.0 - viewWindowH);
      const mouseShiftX = (1.0 - viewWindowW) * 0.5 + this.currentMouse.x * 0.022;
      const mouseShiftY = -this.currentMouse.y * 0.006;

      const sx = ((px - mouseShiftX) / viewWindowW) * w;
      const sy = ((py - scrollTop - mouseShiftY) / viewWindowH) * h;
      return { x: sx, y: sy };
    }

    // Vẽ Logo Chữ 3D "SKYHAGIANGLOOT" tự động chuyển sắc độ hòa hợp với cả 5 vùng du lịch Việt Nam
    _drawFloatingBrandLogo(ctx, w, h, dpr) {
      if (!this.options.showLogo || !this.options.logoText) return;

      const text = this.options.logoText;
      const s = this.currentScroll;
      const t = this.time;

      // Bay lượn mượt mà theo quỹ đạo chữ S khi người dùng cuộn trang qua các danh thắng
      const glideX = w * (0.49 + Math.sin(s * Math.PI * 2.0) * 0.09 + this.currentMouse.x * 0.022);
      const glideY = h * (0.16 + Math.sin(s * Math.PI * 3.0 + t * 0.8) * 0.032 + this.currentMouse.y * 0.018);

      let gradTop, gradMid, gradBot, glowColor, regionSubtitle;
      if (s < 0.20) {
        // Tầng 1: Đèo Mã Pí Lèng & Cột Cờ Lũng Cú Hà Giang (Bình minh Vàng Kim - Cam Đào)
        gradTop = '#ffffff';
        gradMid = '#ffeb99';
        gradBot = '#ff944d';
        glowColor = 'rgba(255, 180, 75, 0.55)';
        regionSubtitle = '★ MÃ PÍ LÈNG PASS · LŨNG CÚ FLAGPOLE · HÀ GIANG ★';
      } else if (s < 0.42) {
        // Tầng 2: Ruộng Bậc Thang Mù Cang Chải Mùa Vàng (Trắng Nắng - Vàng Lúa Chín - Xanh Thảo Nguyên)
        gradTop = '#fffff4';
        gradMid = '#ffe670';
        gradBot = '#9cd645';
        glowColor = 'rgba(220, 195, 50, 0.55)';
        regionSubtitle = '★ MÙ CANG CHẢI GOLDEN TERRACES · NORTHWEST VIETNAM ★';
      } else if (s < 0.62) {
        // Tầng 3: Thác Bản Giốc & Sông Quây Sơn (Trắng Bọt Thác - Xanh Ngọc Lục Bảo)
        gradTop = '#ffffff';
        gradMid = '#afffe4';
        gradBot = '#20bf6b';
        glowColor = 'rgba(32, 191, 107, 0.55)';
        regionSubtitle = '★ BẢN GIỐC WATERFALL · EMERALD CANYON · CAO BẰNG ★';
      } else if (s < 0.82) {
        // Tầng 4: Cung Đường Đèo Biển Vĩnh Hy - Hải Vân (Trắng Sóng Biển - Xanh Lam Đại Dương)
        gradTop = '#ffffff';
        gradMid = '#99f2ff';
        gradBot = '#0fb9b1';
        glowColor = 'rgba(15, 185, 177, 0.58)';
        regionSubtitle = '★ VĨNH HY - HẢI VÂN COASTAL PASS · OCEAN HIGHWAY ★';
      } else {
        // Tầng 5: Vịnh Hạ Long Hoàng Hôn & Lửa Trại Bãi Biển (Trắng Ngà - Vàng Hoàng Hôn - Cam Lửa Trại)
        gradTop = '#fffaf0';
        gradMid = '#ffd86b';
        gradBot = '#fa8231';
        glowColor = 'rgba(250, 130, 49, 0.60)';
        regionSubtitle = '★ HẠ LONG BAY HERITAGE CRUISE · SUNSET BEACH CAMP ★';
      }

      const baseFontSize = Math.min(w / (text.length * 0.88), 50 * dpr);
      const fontSize = Math.max(19 * dpr, baseFontSize);

      ctx.save();
      ctx.translate(glideX, glideY);

      const tiltAngle =
        Math.max(-0.12, Math.min(0.12, this.scrollVelocity * 0.048)) +
        Math.cos(t * 1.0 + s * 4.5) * 0.02;
      ctx.rotate(tiltAngle);

      // Quầng sáng khí quyển mềm mại giúp chữ nổi bật mà vẫn hòa quyện vào mây trời
      const auraGrad = ctx.createRadialGradient(0, 0, fontSize * 0.2, 0, 0, fontSize * 4.8);
      auraGrad.addColorStop(0, glowColor);
      auraGrad.addColorStop(0.55, 'rgba(6, 24, 30, 0.22)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, fontSize * 4.8, fontSize * 1.05, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `900 ${fontSize}px "Segoe UI", system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const spacing = fontSize * 0.76;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const charOffset = i - (text.length - 1) / 2;
        const cx = charOffset * spacing;
        const waveY =
          Math.sin(t * 2.2 + i * 0.4 + s * 10.0) * (5.0 * dpr) +
          Math.cos(t * 1.5 - i * 0.3) * (2.0 * dpr);
        const charScale = 1.0 + Math.sin(t * 1.8 + i * 0.45 + s * 7.0) * 0.032;

        ctx.save();
        ctx.translate(cx, waveY);
        ctx.scale(charScale, charScale);

        ctx.fillStyle = 'rgba(4, 16, 20, 0.64)';
        ctx.fillText(ch, 0, 3.8 * dpr);

        const charGrad = ctx.createLinearGradient(0, -fontSize * 0.55, 0, fontSize * 0.55);
        charGrad.addColorStop(0, gradTop);
        charGrad.addColorStop(0.52, gradMid);
        charGrad.addColorStop(1, gradBot);

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 14 * dpr;
        ctx.fillStyle = charGrad;
        ctx.fillText(ch, 0, 0);

        ctx.lineWidth = 1.15 * dpr;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.46)';
        ctx.strokeText(ch, 0, 0);

        ctx.restore();
      }

      const subSize = Math.max(9.5 * dpr, fontSize * 0.215);
      ctx.font = `700 ${subSize}px "Segoe UI", system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
      const subtitleY = fontSize * 0.78 + Math.sin(t * 1.8 + s * 5.0) * 2.5 * dpr;
      ctx.fillText(regionSubtitle, 0, subtitleY);

      ctx.restore();
    }

    _renderOverlay(w, h, dpr) {
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const t = this.time;

      // 1. Các dải mây sương mỏng trôi ngang qua các vùng chuyển cảnh
      for (const mc of this.mistClouds) {
        mc.px = (mc.px + mc.speed * 0.0018 + 1.4) % 1.4;
        const scr = this._panoramaToScreen(mc.px - 0.2, mc.py, w, h);
        const rw = mc.w * w;
        const rh = mc.h * h;

        if (scr.y > -rh * 2 && scr.y < h + rh * 2) {
          const g = ctx.createRadialGradient(scr.x, scr.y, 0, scr.x, scr.y, rw);
          g.addColorStop(0, `rgba(255, 255, 255, ${mc.alpha})`);
          g.addColorStop(0.5, `rgba(242, 250, 252, ${mc.alpha * 0.45})`);
          g.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = g;
          ctx.save();
          ctx.translate(scr.x, scr.y);
          ctx.scale(1.0, rh / rw);
          ctx.beginPath();
          ctx.arc(0, 0, rw, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Đàn chim bay lượn tự nhiên
      for (const b of this.birds) {
        b.px = (b.px + b.speed * 0.0018) % 1.1;
        const scr = this._panoramaToScreen(
          b.px - 0.05,
          b.py + Math.sin(t * 1.3 + b.phase) * 0.0035,
          w,
          h
        );

        if (scr.y > -40 && scr.y < h + 40) {
          const wing = Math.sin(t * 5.4 + b.phase) * b.size * dpr * 0.52;
          const sz = b.size * dpr;
          ctx.save();
          ctx.translate(scr.x, scr.y);
          ctx.strokeStyle = 'rgba(255, 252, 242, 0.80)';
          ctx.lineWidth = 1.6 * dpr;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-sz, wing);
          ctx.quadraticCurveTo(-sz * 0.4, -sz * 0.35, 0, 0);
          ctx.quadraticCurveTo(sz * 0.4, -sz * 0.35, sz, wing);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Đom đóm & ánh lửa trại bay lên ở tầng 5 (Bãi biển Hạ Long về đêm)
      for (const em of this.embers) {
        em.py -= em.speedY * 0.0025;
        if (em.py < 0.86) {
          em.py = 0.985;
          em.px = 0.38 + Math.random() * 0.38;
        }
        const scr = this._panoramaToScreen(
          em.px + Math.sin(t * 2.0 + em.phase) * 0.006,
          em.py,
          w,
          h
        );
        if (scr.y > 0 && scr.y < h) {
          const alpha = (0.5 + 0.5 * Math.sin(t * 5.0 + em.phase)) * 0.85;
          const r = em.radius * dpr;
          const g = ctx.createRadialGradient(scr.x, scr.y, 0, scr.x, scr.y, r * 3.5);
          g.addColorStop(0, `rgba(255, 230, 140, ${alpha})`);
          g.addColorStop(0.5, `rgba(255, 150, 40, ${alpha * 0.5})`);
          g.addColorStop(1, 'rgba(255, 120, 20, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(scr.x, scr.y, r * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Logo chữ "SKYHAGIANGLOOT" bay lượn & tự động đổi màu theo từng danh thắng
      this._drawFloatingBrandLogo(ctx, w, h, dpr);
    }

    _animate(now) {
      if (this.isDestroyed) return;
      this.time = now * 0.001;

      const prevScroll = this.currentScroll;
      this.currentScroll += (this.targetScroll - this.currentScroll) * 0.085;
      this.scrollVelocity = (this.currentScroll - prevScroll) * 60.0;

      this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.06;
      this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.06;

      if (this.gl && this.program) {
        const gl = this.gl;
        gl.useProgram(this.program);

        gl.uniform2f(this.uniforms.resolution, this.glCanvas.width, this.glCanvas.height);
        gl.uniform1f(this.uniforms.time, this.time);
        gl.uniform1f(
          this.uniforms.scroll,
          Math.min(1, Math.max(0, this.currentScroll * this.options.scrollSensitivity))
        );
        gl.uniform1f(this.uniforms.scrollVel, this.scrollVelocity);
        gl.uniform2f(this.uniforms.mouse, this.currentMouse.x, this.currentMouse.y);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      this._renderOverlay(this.overlayCanvas.width, this.overlayCanvas.height, this.dpr);
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

  global.NatureBackground = NatureBackground;
})(typeof window !== 'undefined' ? window : this);
