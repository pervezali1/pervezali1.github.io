/* =================================================================
   Pervez Ali · interactive sampler demo (Research section)
   -----------------------------------------------------------------
   Two clouds of points sample the same two-dimensional Gaussian
   pi ∝ exp(-U), U(x) = ½ xᵀ S x, with overdamped Langevin dynamics
   discretised by the Euler–Maruyama scheme:

       X_{k+1} = X_k - h (I + J) ∇U(X_k) + √(2h) ξ_k

   Left panel:  J = 0                       (standard, reversible)
   Right panel: J = δ [[0, 1], [-1, 0]]     (nonreversible; pi is unchanged)

   Both panels start from the same points and use the same noise ξ_k,
   so the drift is the only difference. Because the dynamics are linear,
   the law of X_k is Gaussian; its mean and covariance follow an exact
   recursion, which gives the exact Kullback–Leibler divergence to pi
   plotted in the chart.

   The page reads fine without this file. The settings below change
   the example; the text in index.html describes the default values.
   ================================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-demo]');
  var live = root ? root.querySelector('[data-demo-live]') : null;
  if (!live || !window.requestAnimationFrame || !window.Float64Array || !Math.log10) { return; }

  var els = {
    standard: root.querySelector('[data-demo-standard]'),
    nonrev: root.querySelector('[data-demo-nonrev]'),
    chart: root.querySelector('[data-demo-chart]'),
    toggle: root.querySelector('[data-demo-toggle]'),
    restart: root.querySelector('[data-demo-restart]'),
    delta: root.querySelector('[data-demo-delta]'),
    deltaOut: root.querySelector('[data-demo-delta-out]'),
    time: root.querySelector('[data-demo-time]'),
    readout: root.querySelector('[data-demo-readout]')
  };
  for (var key in els) { if (!els[key]) { return; } }
  if (!els.standard.getContext) { return; }

  /* ---------- Settings ---------- */
  var TILT = Math.PI / 6;          // angle of the target's long axis (30 degrees)
  var SD_LONG = 2;                 // standard deviation along the long axis
  var SD_SHORT = 0.5;              // standard deviation along the short axis
  var STEP = 0.005;                // Euler–Maruyama step size h
  var T_END = 16;                  // length of one run, in model time
  var SPEED = 1;                   // model time shown per second of animation
  var POINTS = 500;                // points per panel
  var START = [-5.5, 0.8];         // starting point, in (long axis, short axis) coordinates
  var START_SD = 0.15;             // spread of the starting cloud
  var HALF_W = 6.3;                // each panel shows [-HALF_W, HALF_W] x [-HALF_H, HALF_H]
  var HALF_H = 4.2;
  var KL_TOP = 10;                 // range of the chart (log scale)
  var KL_BOTTOM = 0.001;
  var KL_GOAL = 0.01;              // "close to the target" threshold used in the readout
  var SEED = 2027;                 // fixed seed, so every run looks the same

  /* ---------- Colours and font, taken from styles.css ---------- */
  var css = window.getComputedStyle(document.documentElement);
  var token = function (name, fallback) {
    var value = css.getPropertyValue(name).trim();
    return value || fallback;
  };
  var COLOR = {
    standard: token('--navy-soft', '#3B4A62'),
    nonrev: token('--teal', '#0F6B68'),
    ink: token('--navy', '#15243D'),
    muted: token('--muted', '#586375'),
    rule: token('--rule', '#DCD4C7')
  };
  var FONT = token('--font-sans', 'system-ui, sans-serif');

  /* ---------- The model ---------- */
  var cosT = Math.cos(TILT), sinT = Math.sin(TILT);
  var l1 = 1 / (SD_LONG * SD_LONG), l2 = 1 / (SD_SHORT * SD_SHORT);
  // Precision matrix S = R diag(l1, l2) Rᵀ = [[Sa, Sb], [Sb, Sd]]
  var Sa = cosT * cosT * l1 + sinT * sinT * l2;
  var Sb = cosT * sinT * (l1 - l2);
  var Sd = sinT * sinT * l1 + cosT * cosT * l2;
  var LOG_DET_S = Math.log(l1 * l2);
  var STEPS = Math.round(T_END / STEP);
  var NOISE = Math.sqrt(2 * STEP);
  var X0 = cosT * START[0] - sinT * START[1];
  var Y0 = sinT * START[0] + cosT * START[1];

  // One step is linear: X <- M X + √(2h) ξ, with M = I - h (I + J) S.
  var stepMatrix = function (delta) {
    return [
      1 - STEP * (Sa + delta * Sb), -STEP * (Sb + delta * Sd),
      -STEP * (Sb - delta * Sa), 1 - STEP * (Sd - delta * Sb)
    ];
  };

  // Exact path of the mean and KL divergence to the target, step by step.
  var exactRun = function (delta) {
    var M = stepMatrix(delta);
    var kl = new Float64Array(STEPS + 1);
    var mean = new Float64Array(2 * (STEPS + 1));
    var mx = X0, my = Y0;
    var c00 = START_SD * START_SD, c01 = 0, c11 = c00;
    var goal = -1;
    for (var k = 0; k <= STEPS; k++) {
      mean[2 * k] = mx;
      mean[2 * k + 1] = my;
      var trace = Sa * c00 + 2 * Sb * c01 + Sd * c11;
      var quad = Sa * mx * mx + 2 * Sb * mx * my + Sd * my * my;
      kl[k] = 0.5 * (trace + quad - 2 - LOG_DET_S - Math.log(c00 * c11 - c01 * c01));
      if (goal < 0 && kl[k] <= KL_GOAL) { goal = k * STEP; }
      // mean <- M mean; covariance <- M C Mᵀ + 2h I
      var nx = M[0] * mx + M[1] * my;
      my = M[2] * mx + M[3] * my;
      mx = nx;
      var a00 = M[0] * c00 + M[1] * c01, a01 = M[0] * c01 + M[1] * c11;
      var a10 = M[2] * c00 + M[3] * c01, a11 = M[2] * c01 + M[3] * c11;
      var n00 = a00 * M[0] + a01 * M[1] + 2 * STEP;
      var n01 = a00 * M[2] + a01 * M[3];
      c11 = a10 * M[2] + a11 * M[3] + 2 * STEP;
      c00 = n00;
      c01 = n01;
    }
    return { M: M, kl: kl, mean: mean, goal: goal };
  };

  /* ---------- Random numbers (seeded, so runs are repeatable) ---------- */
  var seed = SEED;
  var uniform = function () {               // mulberry32
    seed = (seed + 0x6D2B79F5) >>> 0;
    var t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  var g1 = 0, g2 = 0;
  var gaussianPair = function () {          // Box–Muller: sets g1, g2
    var r = Math.sqrt(-2 * Math.log(1 - uniform()));
    var a = 2 * Math.PI * uniform();
    g1 = r * Math.cos(a);
    g2 = r * Math.sin(a);
  };

  /* ---------- State ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var delta = parseFloat(els.delta.value);
  if (!(delta >= 0)) { delta = 3; }
  var standardRun = exactRun(0);
  var nonrevRun = exactRun(delta);
  var left = new Float64Array(2 * POINTS);
  var right = new Float64Array(2 * POINTS);
  var step = 0;                             // current step k
  var playing = false;
  var userPaused = false;
  var inView = false;
  var frameId = 0;
  var lastTime = 0;
  var owed = 0;                             // steps owed to the clock

  var reset = function () {
    seed = SEED;
    for (var i = 0; i < 2 * POINTS; i += 2) {
      gaussianPair();
      left[i] = right[i] = X0 + START_SD * g1;
      left[i + 1] = right[i + 1] = Y0 + START_SD * g2;
    }
    step = 0;
    owed = 0;
  };

  var advance = function () {
    var A = standardRun.M, B = nonrevRun.M;
    for (var i = 0; i < 2 * POINTS; i += 2) {
      gaussianPair();
      var nx = NOISE * g1, ny = NOISE * g2;
      var x = left[i], y = left[i + 1];
      left[i] = A[0] * x + A[1] * y + nx;
      left[i + 1] = A[2] * x + A[3] * y + ny;
      x = right[i];
      y = right[i + 1];
      right[i] = B[0] * x + B[1] * y + nx;
      right[i + 1] = B[2] * x + B[3] * y + ny;
    }
    step++;
  };

  /* ---------- Drawing ---------- */
  var fit = function (canvas) {
    var box = canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(box.width * ratio));
    var h = Math.max(1, Math.round(box.height * ratio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return { w: w, h: h, r: ratio };
  };

  var drawPanel = function (canvas, points, run, color) {
    var ctx = canvas.getContext('2d');
    var size = fit(canvas);
    var scale = Math.min(size.w / (2 * HALF_W), size.h / (2 * HALF_H));
    var cx = size.w / 2, cy = size.h / 2;
    var i;
    ctx.clearRect(0, 0, size.w, size.h);

    // Target contours at 1, 2 and 3 standard deviations
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = COLOR.muted;
    ctx.lineWidth = size.r;
    for (var level = 1; level <= 3; level++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, level * SD_LONG * scale, level * SD_SHORT * scale, -TILT, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Where the points started
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(cx + X0 * scale, cy - Y0 * scale, 4.5 * size.r, 0, 2 * Math.PI);
    ctx.stroke();

    // The points
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    var radius = 1.6 * size.r;
    for (i = 0; i < 2 * POINTS; i += 2) {
      ctx.beginPath();
      ctx.arc(cx + points[i] * scale, cy - points[i + 1] * scale, radius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Path of the average position (exact)
    var mean = run.mean;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = COLOR.ink;
    ctx.lineWidth = 1.5 * size.r;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + mean[0] * scale, cy - mean[1] * scale);
    for (i = 5; i < step; i += 5) {
      ctx.lineTo(cx + mean[2 * i] * scale, cy - mean[2 * i + 1] * scale);
    }
    ctx.lineTo(cx + mean[2 * step] * scale, cy - mean[2 * step + 1] * scale);
    ctx.stroke();
    ctx.fillStyle = COLOR.ink;
    ctx.beginPath();
    ctx.arc(cx + mean[2 * step] * scale, cy - mean[2 * step + 1] * scale, 3 * size.r, 0, 2 * Math.PI);
    ctx.fill();
  };

  var LABELS = { '1': '10', '0': '1', '-1': '0.1', '-2': '0.01', '-3': '0.001' };

  var drawChart = function () {
    var canvas = els.chart;
    var ctx = canvas.getContext('2d');
    var size = fit(canvas);
    var r = size.r;
    var padL = 44 * r, padR = 12 * r, padT = 10 * r, padB = 26 * r;
    var pw = size.w - padL - padR, ph = size.h - padT - padB;
    var top = Math.log10(KL_TOP), bottom = Math.log10(KL_BOTTOM);
    var X = function (t) { return padL + (t / T_END) * pw; };
    var Y = function (v) { return padT + (top - Math.log10(Math.max(v, 1e-12))) / (top - bottom) * ph; };
    var e, t, y;

    ctx.clearRect(0, 0, size.w, size.h);
    ctx.font = (11.5 * r) + 'px ' + FONT;
    ctx.lineWidth = r;

    // Horizontal grid and labels; the "close to the target" level is dashed
    var goalExp = Math.round(Math.log10(KL_GOAL));
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (e = Math.round(top); e >= Math.round(bottom); e--) {
      y = Math.round(Y(Math.pow(10, e))) + 0.5;
      var isGoal = e === goalExp;
      ctx.strokeStyle = isGoal ? COLOR.muted : COLOR.rule;
      ctx.globalAlpha = isGoal ? 0.6 : 1;
      ctx.setLineDash(isGoal ? [4 * r, 4 * r] : []);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(size.w - padR, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = COLOR.muted;
      ctx.fillText(LABELS[String(e)] || ('1e' + e), padL - 7 * r, y);
    }
    ctx.setLineDash([]);

    // Time axis
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (t = 0; t <= T_END; t += 4) {
      ctx.fillText(String(t), X(t), size.h - padB + 8 * r);
    }

    // Curves, revealed up to the current time
    var curve = function (kl, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * r;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(kl[0]));
      for (var j = 8; j < step; j += 8) { ctx.lineTo(X(j * STEP), Y(kl[j])); }
      ctx.lineTo(X(step * STEP), Y(kl[step]));
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(X(step * STEP), Y(kl[step]), 3.2 * r, 0, 2 * Math.PI);
      ctx.fill();
    };
    ctx.save();
    ctx.beginPath();
    ctx.rect(padL - 4 * r, padT - 4 * r, pw + 8 * r, ph + 8 * r);
    ctx.clip();
    if (step > 0) {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = COLOR.muted;
      ctx.lineWidth = r;
      var xNow = Math.round(X(step * STEP)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(xNow, padT);
      ctx.lineTo(xNow, padT + ph);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    curve(standardRun.kl, COLOR.standard);
    curve(nonrevRun.kl, COLOR.nonrev);
    ctx.restore();

    // Legend, top right
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var legend = [['Standard', COLOR.standard], ['Nonreversible', COLOR.nonrev]];
    var lx = size.w - padR - ctx.measureText('Nonreversible').width - 26 * r;
    for (var n = 0; n < legend.length; n++) {
      var ly = padT + (10 + n * 17) * r;
      ctx.strokeStyle = legend[n][1];
      ctx.lineWidth = 2 * r;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 16 * r, ly);
      ctx.stroke();
      ctx.fillStyle = COLOR.ink;
      ctx.fillText(legend[n][0], lx + 22 * r, ly);
    }
  };

  var draw = function () {
    drawPanel(els.standard, left, standardRun, COLOR.standard);
    drawPanel(els.nonrev, right, nonrevRun, COLOR.nonrev);
    drawChart();
    els.time.textContent = (step * STEP).toFixed(1);
  };

  /* ---------- Text that describes the result ---------- */
  var updateReadout = function () {
    var a = standardRun.goal, b = nonrevRun.goal;
    var text;
    if (delta === 0) {
      text = 'With δ = 0 there is no extra drift, so the two samplers are identical.';
    } else if (a > 0 && b > 0) {
      var ratio = a / b;
      text = 'Time to get within 0.01 of the target (dashed line): ' + a.toFixed(1) + ' for standard Langevin, ' +
        b.toFixed(1) + ' for nonreversible Langevin' +
        (ratio < 1.05 ? ', about the same.' : ' (' + ratio.toFixed(1) + '× sooner).');
    } else {
      text = '';
    }
    els.readout.textContent = text;
    els.deltaOut.textContent = delta.toFixed(1);
  };

  /* ---------- Playback ---------- */
  var setButton = function () {
    var label = playing ? 'Pause' : (step >= STEPS ? 'Replay' : 'Play');
    els.toggle.textContent = label;
    els.toggle.setAttribute('aria-label', label + ' the animation');
  };

  var frame = function (now) {
    frameId = 0;
    if (!playing) { return; }
    if (lastTime) {
      owed += Math.min(0.1, (now - lastTime) / 1000) * SPEED / STEP;
    }
    lastTime = now;
    var n = Math.floor(owed);
    owed -= n;
    while (n-- > 0 && step < STEPS) { advance(); }
    draw();
    if (step >= STEPS) {
      playing = false;
      setButton();
      return;
    }
    frameId = window.requestAnimationFrame(frame);
  };

  var play = function () {
    if (playing) { return; }
    if (step >= STEPS) { reset(); }
    playing = true;
    lastTime = 0;
    setButton();
    frameId = window.requestAnimationFrame(frame);
  };

  var pause = function () {
    playing = false;
    if (frameId) { window.cancelAnimationFrame(frameId); frameId = 0; }
    setButton();
  };

  els.toggle.addEventListener('click', function () {
    if (playing) {
      userPaused = true;
      pause();
    } else {
      userPaused = false;
      play();
    }
  });

  els.restart.addEventListener('click', function () {
    pause();
    reset();
    draw();
    userPaused = false;
    play();
  });

  els.delta.addEventListener('input', function () {
    var value = parseFloat(els.delta.value);
    delta = value >= 0 ? value : 0;
    nonrevRun = exactRun(delta);
    updateReadout();
    pause();
    reset();
    draw();
    if (!reduceMotion) {
      userPaused = false;
      play();
    } else {
      setButton();
    }
  });

  /* ---------- Start ---------- */
  live.hidden = false;
  root.classList.add('demo--ready');
  reset();
  updateReadout();
  setButton();
  draw();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (!playing) { draw(); } });
  }

  // Redraw at the new size when the layout changes
  if (window.ResizeObserver) {
    new window.ResizeObserver(function () { if (!playing) { draw(); } }).observe(live);
  } else {
    window.addEventListener('resize', function () { if (!playing) { draw(); } });
  }

  // Play while the demo is on screen; never start by itself if reduced motion is preferred
  if (window.IntersectionObserver) {
    new window.IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !playing && !userPaused && !reduceMotion && step < STEPS) {
        play();
      } else if (!inView && playing) {
        pause();
      }
    }, { threshold: 0.35 }).observe(live);
  } else if (!reduceMotion) {
    play();
  }
})();
