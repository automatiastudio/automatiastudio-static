/* Automatia Studio — comportamiento del sitio
   1. Header transparente que se opaca al hacer scroll
   2. Aparición de secciones al entrar en pantalla
   3. Fondo animado del hero (three.js)
   4. Lightbox de video
   5. Calendario de Cal.com
   Configuración editable: */
var CONFIG = {
  videoId: 'faTA1PrSasA',
  calLink: 'sebastianmejia/asesoria',
  calNamespace: 'asesoria'
};

document.addEventListener('DOMContentLoaded', function () {
  stickyHeader();
  reveal();
  lightbox();
  cal();
  nebula();
});

/* 1 ---------------------------------------------------------------- */
function stickyHeader() {
  var sentinel = document.getElementById('om-top-sentinel');
  var header = document.getElementById('om-header');
  if (!sentinel || !header) return;
  new IntersectionObserver(function (entries) {
    header.setAttribute('data-scrolled', entries[0].isIntersecting ? '0' : '1');
  }, { threshold: 0 }).observe(sentinel);
}

/* 2 ---------------------------------------------------------------- */
function reveal() {
  var nodes = document.querySelectorAll('[data-r]');
  if (!nodes.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  Array.prototype.forEach.call(nodes, function (el) {
    var d = parseInt(el.getAttribute('data-d') || '0', 10);
    var r = el.getBoundingClientRect();
    el.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1) ' + d + 'ms, transform .8s cubic-bezier(.16,1,.3,1) ' + d + 'ms';
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    io.observe(el);
  });
}

/* 4 ---------------------------------------------------------------- */
function lightbox() {
  var box = document.getElementById('om-lightbox');
  var slot = document.getElementById('om-video-slot');
  if (!box || !slot) return;

  function open() {
    slot.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + CONFIG.videoId + '?autoplay=1&rel=0&modestbranding=1';
    f.title = 'Automatia Studio';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    f.style.cssText = 'width:100%;height:100%;border:0;display:block;';
    slot.appendChild(f);
    box.setAttribute('data-open', '1');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.setAttribute('data-open', '0');
    slot.innerHTML = '';
    document.body.style.overflow = '';
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-video-open]'), function (b) {
    b.addEventListener('click', open);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-video-close]'), function (b) {
    b.addEventListener('click', close);
  });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
}

/* 5 ---------------------------------------------------------------- */
function cal() {
  var host = document.getElementById('my-cal-inline-asesoria');
  if (!host) return;
  (function (C, A, L) {
    var p = function (a, ar) { a.q.push(ar); };
    var d = C.document;
    C.Cal = C.Cal || function () {
      var cal = C.Cal, ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
      if (ar[0] === L) {
        var api = function () { p(api, arguments); };
        var namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
        else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  var ns = CONFIG.calNamespace;
  window.Cal('init', ns, { origin: 'https://app.cal.com' });
  window.Cal.config = window.Cal.config || {};
  window.Cal.config.forwardQueryParams = true;
  window.Cal.ns[ns]('inline', {
    elementOrSelector: '#my-cal-inline-asesoria',
    config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'dark' },
    calLink: CONFIG.calLink
  });
  // si no hay internet, el embed nunca pinta: mostramos alternativas
  setTimeout(function () {
    if (host.children.length === 0 || host.offsetHeight < 120) calOffline(host);
  }, 5000);

  window.Cal.ns[ns]('ui', {
    theme: 'dark',
    cssVarsPerTheme: { dark: { 'cal-brand': '#FF3294' } },
    hideEventTypeDetails: false,
    layout: 'month_view'
  });
}

/* 3 ---------------------------------------------------------------- */
function nebula() {
  var host = document.getElementById('om-nebula');
  if (!host || !window.THREE) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var THREE = window.THREE;

  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var clock = new THREE.Clock();

  var uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(1, 1) },
    iMouse: { value: new THREE.Vector2(0.5, 0.5) }
  };

  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: uniforms,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }',
    fragmentShader: [
      'precision mediump float;',
      'uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse; varying vec2 vUv;',
      '#define t iTime',
      'mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }',
      'float map(vec3 p){',
      '  p.xz *= m(t*0.28); p.xy *= m(t*0.2);',
      '  vec3 q = p*2.0 + t;',
      '  return length(p + vec3(sin(t*0.6))) * log(length(p)+1.0) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;',
      '}',
      'void main(){',
      '  vec2 fc = vUv * iResolution;',
      '  vec2 uv = fc / min(iResolution.x, iResolution.y) - vec2(0.5, 0.5);',
      '  uv += (iMouse - 0.5) * 0.14;',
      '  vec3 col = vec3(0.0);',
      '  float d = 2.5;',
      '  for (int i = 0; i <= 5; i++) {',
      '    vec3 p = vec3(0.0, 0.0, 5.0) + normalize(vec3(uv, -1.0)) * d;',
      '    float rz = map(p);',
      '    float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);',
      '    vec3 base = vec3(0.06, 0.03, 0.10) + vec3(5.2, 1.1, 3.0) * f;',
      '    col = col * base + smoothstep(2.5, 0.0, rz) * 0.62 * base;',
      '    d += min(rz, 1.0);',
      '  }',
      '  float dist = distance(fc, iResolution * 0.5);',
      '  float radius = min(iResolution.x, iResolution.y) * 0.5;',
      '  float dim = smoothstep(radius * 0.25, radius * 0.9, dist);',
      '  col = mix(col * 0.34, col, dim);',
      '  float a = clamp(length(col) * 1.15, 0.0, 1.0);',
      '  gl_FragColor = vec4(col, a);',
      '}'
    ].join('\n')
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    var w = host.clientWidth || 1, h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    uniforms.iResolution.value.set(w, h);
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    uniforms.iMouse.value.set(
      (e.clientX - r.left) / Math.max(r.width, 1),
      1 - (e.clientY - r.top) / Math.max(r.height, 1)
    );
  }, { passive: true });
  resize();

  var visible = true;
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0 }).observe(host);

  renderer.setAnimationLoop(function () {
    if (!visible || document.hidden) return;
    uniforms.iTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  });

  requestAnimationFrame(function () { host.style.opacity = '1'; });
}

/* 7 — el calendario necesita internet -------------------------------- */
function calOffline(host) {
  host.innerHTML =
    '<div style="min-height:520px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:48px 28px;text-align:center">' +
      '<i class="ph ph-calendar-x" style="font-size:38px;color:#FF3294"></i>' +
      '<p style="margin:0;font-family:Jost,sans-serif;font-size:22px;font-weight:500;color:#F7F2F8">El calendario no cargó</p>' +
      '<p style="margin:0;max-width:44ch;font-size:16px;line-height:1.6;color:rgba(227,211,228,.66)">' +
        'Necesita conexión a internet. Escríbenos por WhatsApp o correo y agendamos igual.</p>' +
      '<a href="' + WA_LINK + '" target="_blank" rel="noopener" style="margin-top:8px;display:inline-flex;align-items:center;height:50px;padding:0 26px;border-radius:999px;background:#FF3294;color:#0A0810;font-family:Jost,sans-serif;font-size:16px;font-weight:500">Escribir por WhatsApp</a>' +
    '</div>';
}
var WA_LINK = 'https://wa.me/19302006200';
