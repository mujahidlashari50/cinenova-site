/* === script === */
document.documentElement.style.background='#141414';
document.documentElement.style.color='#e5e5e5';
try{document.body.classList.add('cv-booting');}catch(e){}

/* Anti-scrape / anti-AI surface (best-effort — public HTML fully lock nahi hota) */
(function cvAntiScrapeInit(){
  try {
    document.documentElement.setAttribute('data-nosnippet', 'true');
  } catch(e){}
  // Disable drag on posters (casual scrape)
  try {
    document.addEventListener('dragstart', function(e) {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    }, true);
  } catch(e2){}
  // Block common headless bot UAs from heavy UI (soft)
  try {
    var ua = navigator.userAgent || '';
    if (/GPTBot|ClaudeBot|CCBot|Google-Extended|Bytespider|PetalBot|DataForSeo|Scrapy/i.test(ua)) {
      document.documentElement.classList.add('cv-bot-ua');
    }
  } catch(e3){}
})();

/* List-URL helpers (back-navigation target for modal/movie pages) */
var cvLastListUrl = '';
function cvCaptureListUrl() {
  try {
    var p = location.pathname || '/';
    if (p.indexOf('/movie/') === 0) return;
    cvLastListUrl = p + (location.search || '');
    sessionStorage.setItem('cv_list_url', cvLastListUrl);
  } catch (e) {}
}
function cvGetListUrl() {
  try { return cvLastListUrl || sessionStorage.getItem('cv_list_url') || '/'; } catch (e) { return '/'; }
}


/* === script === */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  // CWV: delay GA until idle so LCP / INP improve on mobile
  function _cvBootGtag(){
    try {
      gtag('js', new Date());
      gtag('config', 'G-N67Y5B8T2Z', { send_page_view: true, transport_type: 'beacon' });
    } catch (e) {}
  }
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(_cvBootGtag, { timeout: 4000 });
  } else {
    setTimeout(_cvBootGtag, 2500);
  }

function cvTrackEvent(name, params) {
  try {
    params = params || {};
    if (typeof gtag === 'function') gtag('event', name, params);
    if (typeof db !== 'undefined' && db) {
      var day = new Date().toISOString().slice(0, 10);
      db.ref('analytics/events/' + day + '/' + name).transaction(function(c){ return (c||0)+1; });
    }
  } catch (e) {}
}
function cvTrackVirtualPage(path, title) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_path: path || location.pathname,
        page_title: title || document.title
      });
    }
  } catch (e) {}
}
function cvCopyShareLink(url, movieId) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        if (typeof showStatus === 'function') showStatus('Link copied', '#46d369');
        else alert('Link copied');
      });
    } else {
      var i = document.createElement('input');
      i.value = url; document.body.appendChild(i); i.select();
      document.execCommand('copy'); i.remove();
      if (typeof showStatus === 'function') showStatus('Link copied', '#46d369');
    }
    cvTrackEvent('share', { method: 'copy', movie_id: movieId || '' });
  } catch (e) {}
}

/* === script === */
(function() {
  try {
    var ua = navigator.userAgent || '';
    var isIab = /FBAN|FBAV|FB_IAB|Instagram|Line\//i.test(ua);
    if (!isIab) return;
    if (sessionStorage.getItem('cv_iab_dismissed') === '1') return;
    document.addEventListener('DOMContentLoaded', function() {
      var b = document.getElementById('cv-iab-banner');
      if (b) b.style.display = 'flex';
    });
  } catch (e) {}
})();
function cvDismissIabBanner() {
  var b = document.getElementById('cv-iab-banner');
  if (b) b.style.display = 'none';
  try { sessionStorage.setItem('cv_iab_dismissed', '1'); } catch (e) {}
}
function cvOpenInBrowser() {
  var url = location.href;
  var ua = navigator.userAgent || '';
  var copied = false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { navigator.clipboard.writeText(url); copied = true; } catch (e) {}
  }
  if (/android/i.test(ua)) {
    // Android — Chrome mein force-open karne ka reliable tareeka
    var scheme = url.replace(/^https?:\/\//, '');
    location.href = 'intent://' + scheme + '#Intent;scheme=https;package=com.android.chrome;end';
    // Fallback agar Chrome install nahi hai
    setTimeout(function() {
      alert(copied ? 'Link copy ho gaya hai — apne browser app mein paste karke kholein.' : 'Apne browser app mein ye link paste karein:\n' + url);
    }, 1200);
  } else {
    // iOS mein reliable force-open possible nahi — link copy karke instructions dikhao
    alert('Upar right corner mein " ⋮ " ya "..." pe tap karke "Open in Safari/Browser" chunein.' + (copied ? '\n\nLink bhi copy ho gaya hai agar zarurat pade.' : '\n\nLink: ' + url));
  }
}

/* === script === */
(function(){
  function openSubcatDrawer(){
    var d=document.getElementById('cv-subcat-drawer');
    var o=document.getElementById('cv-subcat-overlay');
    if(d){d.classList.add('open');d.setAttribute('aria-hidden','false');}
    if(o) o.classList.add('open');
    try{cvScrollLock();}catch(e){}
  }
  function closeSubcatDrawer(){
    var d=document.getElementById('cv-subcat-drawer');
    var o=document.getElementById('cv-subcat-overlay');
    if(d){d.classList.remove('open');d.setAttribute('aria-hidden','true');}
    if(o) o.classList.remove('open');
    try{cvScrollUnlock();}catch(e){}
  }
  function bind(){
    var tog=document.getElementById('cv-subcat-toggle');
    var clo=document.getElementById('cv-subcat-close');
    var ov=document.getElementById('cv-subcat-overlay');
    if(tog) tog.addEventListener('click', openSubcatDrawer);
    if(clo) clo.addEventListener('click', closeSubcatDrawer);
    if(ov) ov.addEventListener('click', closeSubcatDrawer);
    document.querySelectorAll('.cv-subcat-item').forEach(function(btn){
      btn.addEventListener('click', function(){
        var cat=btn.getAttribute('data-cat');
        document.querySelectorAll('.cv-subcat-item').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        document.querySelectorAll('#cv-subcats .cv-pill').forEach(function(p){
          p.classList.toggle('active', (p.getAttribute('data-cat')||'')===cat);
        });
        closeSubcatDrawer();
        if(typeof cvApplyFilter==='function'){
          cvApplyFilter(cat, false, btn);
        } else {
          var pill=document.querySelector('.cv-pill[data-cat="'+cat+'"]');
          if(pill) pill.click();
        }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();

/* === script === */
(function(){try{
    var p=new URLSearchParams(location.search);
    if(p.get('cat')||p.get('genre')){
      ['cv-featured-wrap','cv-motd-outer','cv-ts-wrap','cv-trending-wrap','cv-ns-hero','cv-trailers-wrap','tmdb-slider-wrap'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.style.display='none';
      });
      try{document.body.classList.add('cv-cat-view');document.body.classList.remove('cv-on-home');}catch(e2){}
      return;
    }
    if(localStorage.getItem('cv_fb_off')==='1'){document.getElementById('cv-featured-wrap').style.display='none';}
  }catch(e){}})();

/* === script === */
(function(){try{var p=new URLSearchParams(location.search);if(p.get('cat')||p.get('genre')){document.getElementById('cv-ns-hero').style.display='none';}}catch(e){}})();

/* === script === */
//<![CDATA[

// ══════════════════════════════════
// FIREBASE CONFIG (loaded dynamically - non-blocking)
// ══════════════════════════════════
var CV_SCHEMA_VERSION = '2026.09.14-panel-sync';
var firebaseConfig = {
  apiKey: "AIzaSyACX5MktMm99R2ThEbfrtwrh5ZAzT5tCM0",
  authDomain: "cinenova-8987c.firebaseapp.com",
  databaseURL: "https://cinenova-8987c-default-rtdb.firebaseio.com",
  projectId: "cinenova-8987c",
  storageBucket: "cinenova-8987c.firebasestorage.app",
  messagingSenderId: "387796185004",
  appId: "1:387796185004:web:080b4544e1fb53a1cd9409",
  measurementId: "G-N67Y5B8T2Z"
};

// db will be set after Firebase loads dynamically
var db = null;
var _cvFirebaseLoaded = false;

// ══════════════════════════════════
// 🐞 ERROR LOGGING SYSTEM
// Har JS error ya unhandled promise rejection Firebase 'errorLogs' me
// khud-ba-khud log ho jata hai — admin panel se dekha ja sakta hai.
// ══════════════════════════════════
window._cvErrorQueue = [];
window._cvErrorCount = 0;
var CV_MAX_ERRORS_PER_SESSION = 15;
var _cvSeenErrorMsgs = {};

function cvLogError(info) {
  try {
    var msgKey = (info.message || '') + '|' + (info.line || '');
    if (_cvSeenErrorMsgs[msgKey]) return; // same error dobara log na ho isi session me
    _cvSeenErrorMsgs[msgKey] = true;

    if (window._cvErrorCount >= CV_MAX_ERRORS_PER_SESSION) return;
    window._cvErrorCount++;

    var payload = {
      message: String(info.message || '').substring(0, 500),
      source: String(info.source || '').substring(0, 300),
      line: info.line || 0,
      col: info.col || 0,
      stack: String(info.stack || '').substring(0, 1500),
      url: String(location.href || '').substring(0, 300),
      ua: String(navigator.userAgent || '').substring(0, 300),
      ts: Date.now()
    };

    if (db) {
      db.ref('errorLogs').push(payload);
    } else {
      window._cvErrorQueue.push(payload);
    }
  } catch (e) {}
}

window.addEventListener('error', function(e) {
  // Cross-origin/ad scripts se aane wali generic "Script error." (koi useful
  // detail nahi hoti) ko skip karo — sirf noise hoti hai, kabhi trace nahi ho sakti.
  if (e.message === 'Script error.' || e.message === 'Script error') return;

  // Facebook/Instagram in-app browser (iabjs://) apna internal performance
  // logger crash karta hai jab tab background/foreground hota hai — yeh
  // uss app ka apna bug hai, humari site se koi lena dena nahi, user ko
  // kuch dikhta bhi nahi. Sirf Error Logs mein noise banata tha, ab skip.
  if (e.filename && e.filename.indexOf('iabjs://') === 0) return;
  if (e.message && e.message.indexOf('postMessage: Java object is gone') > -1) return;

  // Slow/flaky network (2G/3G/interrupted connection) par kabhi kabhi
  // poora page load hone se pehle hi ruk jata hai — beech mein kata hua
  // <script> tag milta hai jo genuinely invalid JS hota hai. Ye humari
  // coding ki galti nahi, client ke network ka side-effect hai. Koi
  // stack trace nahi hoti asli bug ke ulat — isliye safely skip.
  var isTruncationNoise = !(e.error && e.error.stack) && (
    e.message === 'Uncaught SyntaxError: Unexpected end of input' ||
    e.message === 'Uncaught SyntaxError: Invalid or unexpected token' ||
    e.message === 'SyntaxError: Unexpected end of input' ||
    e.message === 'SyntaxError: Invalid or unexpected token'
  );
  if (isTruncationNoise) return;

  var isOwnSite = e.filename && e.filename.indexOf(location.hostname) > -1;
  cvLogError({
    message: (isOwnSite || !e.filename ? '' : '[3rd-party script] ') + e.message,
    source: e.filename || '(no source — inline handler ya external script)',
    line: e.lineno,
    col: e.colno,
    stack: e.error && e.error.stack
  });
});

window.addEventListener('unhandledrejection', function(e) {
  var reason = e.reason;
  cvLogError({
    message: 'UnhandledRejection: ' + (reason && reason.message ? reason.message : String(reason)),
    stack: reason && reason.stack
  });
});

function cvFlushErrorQueue() {
  if (!db || !window._cvErrorQueue.length) return;
  window._cvErrorQueue.forEach(function(payload) {
    db.ref('errorLogs').push(payload);
  });
  window._cvErrorQueue = [];
}

// ══════════════════════════════════
// 🛟 STUCK-ON-LOADING FIX
// Agar Firebase SDK hi load na ho (blocked/slow network, corporate/mobile
// firewall jo gstatic.com aur jsdelivr.net dono block kar de) to pehle
// _cvOnFirebaseReady() KABHI call hi nahi hoti thi — matlab poori site
// skeleton (grey boxes) pe hamesha ke liye atki reh jati thi, koi error
// ya Reload option kabhi nahi dikhta tha. Ab agar 12 second ke andar
// Firebase load na ho, ya CDN attempts pehle hi fail ho jayein, to turant
// user ko clear "Reload" message dikha dete hain — skeleton par atakna
// band.
// ══════════════════════════════════
window._cvLoadFailureShown = false;
function cvShowLoadFailure() {
  if (window._cvLoadFailureShown) return;
  if (window._cvFirebaseLoaded) return; // load ho chuka, kuch mat karo
  window._cvLoadFailureShown = true;
  var msg = '<div class="cv-empty"><p>⚡</p><p>Site load nahi ho saka<br/><small style="color:#7d7d7d">Apna internet connection check karein — <a href="javascript:location.reload()" style="color:#e50914">Reload karein</a></small></p></div>';
  try {
    var grid = document.getElementById('cv-grid');
    if (grid && !grid.children.length) grid.innerHTML = msg;
  } catch(e) {}
  try {
    var uhSkel = document.querySelector('.cv-uh-skel');
    if (uhSkel && uhSkel.parentElement) uhSkel.parentElement.innerHTML = '<div style="padding:16px;color:#777;font-size:0.8rem;text-align:center;width:100%">Load nahi hua — <a href="javascript:location.reload()" style="color:#e50914">Reload</a></div>';
  } catch(e) {}
  try { var nsHero = document.getElementById('cv-ns-hero'); if (nsHero) nsHero.style.display = 'none'; } catch(e) {}
  try { var featuredWrap = document.getElementById('cv-featured-wrap'); if (featuredWrap) featuredWrap.style.display = 'none'; } catch(e) {}
}
setTimeout(function() {
  if (!window._cvFirebaseLoaded) cvShowLoadFailure();
}, 12000);

// Load Firebase scripts dynamically (non-render-blocking)
(function() {
  function _cvLoadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = cb;
    s.onerror = cb; // continue even if error
    document.head.appendChild(s);
  }
  // International region fallback: try gstatic first, then jsDelivr CDN
  var _fbCDN1 = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
  var _fbCDN2 = 'https://cdn.jsdelivr.net/npm/firebase@10.14.1/firebase-app-compat.min.js';
  function _cvLoadFirebaseWithFallback(url, fallback, cb) {
    var done = false;
    var s = document.createElement('script');
    s.src = url;
    s.async = false;
    var timer = setTimeout(function() {
      if (done) return;
      done = true;
      document.head.removeChild(s);
      var s2 = document.createElement('script');
      s2.src = fallback;
      s2.async = false;
      s2.onload = cb; s2.onerror = cb;
      document.head.appendChild(s2);
    }, 5000);
    s.onload = function() { if (done) return; done = true; clearTimeout(timer); cb(); };
    s.onerror = function() { if (done) return; done = true; clearTimeout(timer);
      var s2 = document.createElement('script');
      s2.src = fallback; s2.async = false;
      s2.onload = cb; s2.onerror = cb;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }
  _cvLoadFirebaseWithFallback(_fbCDN1, _fbCDN2, function() {
    try {
      if (typeof firebase !== 'undefined' && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
    } catch(e) {}
    if (typeof firebase === 'undefined') { cvShowLoadFailure(); return; } // dono CDN fail — turant bata do
    // Database SDK only — earning/auth system removed
    _cvLoadFirebaseWithFallback('https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js','https://cdn.jsdelivr.net/npm/firebase@10.14.1/firebase-database-compat.min.js', function() {
      try {
        if (typeof firebase !== 'undefined' && typeof firebase.database === 'function') {
          db = firebase.database();
          _cvFirebaseLoaded = true;
          cvFlushErrorQueue();
          if (typeof _cvOnFirebaseReady === 'function') _cvOnFirebaseReady();
        } else {
          cvShowLoadFailure();
        }
      } catch(e) { cvShowLoadFailure(); }
    });
  });
})();

// ── STATUS (only show if not empty) ──
function showStatus(msg, color) {
  var el = document.getElementById('cv-status-bar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cv-status-bar';
    el.style.cssText = 'position:fixed;bottom:calc(var(--bottom-nav-h,0px) + 18px);left:50%;transform:translateX(-50%);z-index:979;padding:10px 18px;border-radius:999px;font-size:0.78rem;font-weight:650;transition:opacity 0.25s ease,transform 0.25s ease;pointer-events:none;background:rgba(18,18,18,0.94);box-shadow:0 8px 28px rgba(0,0,0,0.5);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);max-width:90vw;text-align:center;opacity:0;';
    document.body.appendChild(el);
  }
  if (!msg) { el.style.opacity = '0'; return; }
  var c = color || '#e5e5e5';
  el.style.border = '1px solid ' + c;
  el.style.color = c;
  el.style.opacity = '1';
  el.textContent = msg;
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.style.opacity = '0'; }, 2800);
}

// ══════════════════════════════════
// STATE
// ══════════════════════════════════
var allData = [];

// Category pretty-URL: body class ASAP (featured/coming-soon hide before paint)
(function(){
  try {
    var p = (location.pathname || '/').toLowerCase();
    if (p.indexOf('/category/') === 0 || p.indexOf('/genre/') === 0) {
      document.documentElement.classList.add('cv-cat-view');
      if (document.body) {
        document.body.classList.add('cv-cat-view');
        document.body.classList.remove('cv-on-home');
      } else {
        document.addEventListener('DOMContentLoaded', function(){
          document.body.classList.add('cv-cat-view');
          document.body.classList.remove('cv-on-home');
        });
      }
    }
  } catch (e) {}
})();


// ══ Mobile scroll lock helpers (modal/player only) ══
function cvScrollLock() {
  try {
    if (document.documentElement.classList.contains('cv-scroll-lock')) return;
    var sb = window.innerWidth - document.documentElement.clientWidth;
    if (sb < 0) sb = 0;
    document.documentElement.classList.add('cv-scroll-lock');
    document.documentElement.style.setProperty('--cv-sbw', sb + 'px');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = sb ? (sb + 'px') : '';
    // prevent iOS/Android body bounce shift
    document.body.style.touchAction = 'none';
  } catch (e) {}
}
function cvScrollUnlock() {
  try {
    var modal = document.getElementById('cv-modal');
    var player = document.getElementById('cv-player');
    var dl = document.getElementById('cv-dl-popup');
    var search = document.getElementById('cv-search-overlay');
    var still =
      (modal && modal.classList.contains('open')) ||
      (player && player.classList.contains('open')) ||
      (dl && dl.classList.contains('open')) ||
      (search && search.classList.contains('open') && getComputedStyle(search).display !== 'none');
    if (still) return;
    document.documentElement.classList.remove('cv-scroll-lock');
    document.documentElement.style.removeProperty('--cv-sbw');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.touchAction = '';
  } catch (e) {}
}
// Safety: page load + har 3s soft check (stuck lock hatao)
(function(){
  function safeUnlock(){ try { cvScrollUnlock(); } catch(e){} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeUnlock);
  else safeUnlock();
  setTimeout(safeUnlock, 800);
  setTimeout(safeUnlock, 2500);
  try {
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) safeUnlock();
    });
  } catch(e){}
})();

var selCat = 'all';
var selGenre = ''; // genre filter: '' means no genre filter
var selLang = '';  // language badge filter: '' = off, 'english' ya 'hindi' — sirf badge-grid se set hota hai, koi alag UI nahi
var selYear = '';  // year filter: '' = all years, '2026' etc.
var searchQ = '';
// EMPTY-STATE FLASH FIX: Firebase se pehla response aane se pehle agar
// koi category/genre select ho jaye (jaise direct ?cat=xyz URL open karne
// par), to allData abhi khaali hoti hai — pehle isse "No movies found /
// Add data in Firebase" wala galat error dikh jata tha 2-3 second ke liye,
// phir data aate hi sahi movies show hoti thin. Ab jab tak pehla Firebase
// response nahi aata (ya category ki saari pages load nahi ho jatin),
// error ki jagah skeleton (loading) dikhega.
var cvFirstResponseReceived = false;

// ══════════════════════════════════
// Year / Quality filter bar (professional)
// ══════════════════════════════════
var _cvAdvQuality = '';
function cvMovieYear(m) {
  if (!m) return '';
  var y = String(m.year || m.releaseYear || m.release_date || '').replace(/\D/g, '').substring(0, 4);
  if (/^(19|20)\d{2}$/.test(y)) return y;
  var t = String(m.title || m.name || '');
  var tm = t.match(/\b((?:19|20)\d{2})\b/);
  return tm ? tm[1] : '';
}
function cvRefreshAdvanceFilterOptions() {
  var ySel = document.getElementById('cv-filter-year');
  var qSel = document.getElementById('cv-filter-quality');
  if (!ySel || !qSel) return;
  var data = (typeof allData !== 'undefined' && allData) ? allData : [];
  var years = {};
  data.forEach(function(m) {
    if (!m) return;
    var y = cvMovieYear(m);
    if (y) years[y] = (years[y] || 0) + 1;
  });
  var prevY = ySel.value || '';
  var prevQ = qSel.value || '';
  ySel.innerHTML = '<option value="">Year — All</option>';
  Object.keys(years).sort().reverse().forEach(function(y) {
    var o = document.createElement('option');
    o.value = y;
    o.textContent = y + ' (' + years[y] + ')';
    ySel.appendChild(o);
  });
  // Site pe mostly 1080p — sirf 1080p option
  qSel.innerHTML = '<option value="">Quality — All</option>'
    + '<option value="1080p">1080p</option>';
  if (prevY && years[prevY]) ySel.value = prevY;
  else { ySel.value = ''; if (typeof selYear !== 'undefined') selYear = ''; }
  if (prevQ === '1080p') qSel.value = '1080p';
  else { qSel.value = ''; _cvAdvQuality = ''; }
}
function cvStyleAdvFilters(bar) {
  if (!bar) return;
  var w = (typeof window !== 'undefined') ? window.innerWidth : 900;
  var mobile = w < 600;
  var desk = w >= 900;
  // padding = movie grid jaisa (cards ke left edge se align)
  var padL = mobile ? '10px' : (desk ? '20px' : '14px');
  var padR = padL;
  try {
    var grid = document.getElementById('cv-grid');
    if (grid) {
      var cs = window.getComputedStyle(grid);
      if (cs.paddingLeft) padL = cs.paddingLeft;
      if (cs.paddingRight) padR = cs.paddingRight;
    }
  } catch (eP) {}
  bar.style.cssText = [
    'display:flex',
    'flex-direction:row',
    'flex-wrap:nowrap',
    'align-items:center',
    'justify-content:' + (desk ? 'center' : 'flex-start'),
    'gap:' + (mobile ? '6px' : '12px'),
    'width:100%',
    'max-width:100%',
    'box-sizing:border-box',
    'padding:10px ' + padR + ' 8px ' + padL,
    'margin:0',
    'background:transparent',
    'overflow-x:auto',
    '-webkit-overflow-scrolling:touch'
  ].join(';');
  var selCss = [
    'flex:0 0 auto',
    'width:' + (mobile ? 'auto' : (desk ? '150px' : '130px')),
    'min-width:' + (mobile ? '88px' : '120px'),
    'max-width:' + (mobile ? '130px' : '160px'),
    'background:#161616',
    'color:#eee',
    'border:1px solid #2a2a2a',
    'border-radius:999px',
    'padding:' + (mobile ? '8px 24px 8px 10px' : '10px 32px 10px 14px'),
    'font-size:' + (mobile ? '0.72rem' : '0.85rem'),
    'font-weight:600',
    'cursor:pointer',
    'appearance:none',
    '-webkit-appearance:none'
  ].join(';');
  var btnCss = [
    'flex:0 0 auto',
    'background:#161616',
    'color:#999',
    'border:1px solid #2a2a2a',
    'border-radius:999px',
    'padding:' + (mobile ? '8px 12px' : '10px 16px'),
    'font-size:' + (mobile ? '0.72rem' : '0.82rem'),
    'font-weight:700',
    'cursor:pointer',
    'white-space:nowrap'
  ].join(';');
  bar.querySelectorAll('select.cv-adv-select').forEach(function(el) {
    el.style.cssText = selCss;
  });
  bar.querySelectorAll('button.cv-adv-reset').forEach(function(el) {
    el.style.cssText = btnCss;
  });
}
function cvInitAdvanceFilters() {
  var host = document.getElementById('cv-grid');
  if (!host || !host.parentNode) return;
  var bar = document.getElementById('cv-adv-filters');
  if (bar) {
    try {
      bar.querySelectorAll('.cv-adv-label').forEach(function(n){ n.remove(); });
      var inner = bar.querySelector('.cv-adv-filters-inner');
      if (inner) {
        while (inner.firstChild) bar.insertBefore(inner.firstChild, inner);
        inner.remove();
      }
    } catch (eClr) {}
  }
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'cv-adv-filters';
    bar.className = 'cv-adv-filters';
    bar.innerHTML =
      '<select id="cv-filter-year" class="cv-adv-select" aria-label="Year"><option value="">Year — All</option></select>' +
      '<select id="cv-filter-quality" class="cv-adv-select" aria-label="Quality"><option value="">Quality — All</option></select>' +
      '<button type="button" class="cv-adv-reset" id="cv-filter-reset">Reset</button>';
    host.parentNode.insertBefore(bar, host);
    var ySel = document.getElementById('cv-filter-year');
    var qSel = document.getElementById('cv-filter-quality');
    ySel.onchange = function() {
      if (typeof selYear !== 'undefined') selYear = ySel.value || '';
      cvApplyAdvanceFilters();
    };
    qSel.onchange = function() {
      _cvAdvQuality = this.value || '';
      cvApplyAdvanceFilters();
    };
    document.getElementById('cv-filter-reset').onclick = function() {
      if (typeof selYear !== 'undefined') selYear = '';
      _cvAdvQuality = '';
      ySel.value = '';
      qSel.value = '';
      cvApplyAdvanceFilters();
    };
  }
  // Ensure bar is directly above grid (not stuck elsewhere)
  try {
    if (bar.parentNode !== host.parentNode || bar.nextElementSibling !== host) {
      host.parentNode.insertBefore(bar, host);
    }
  } catch (eMove) {}
  cvStyleAdvFilters(bar);
  cvRefreshAdvanceFilterOptions();
  try { cvUpdateAdvFiltersVisibility(); } catch (eV) {}
}
function cvUpdateAdvFiltersVisibility() {
  try {
    var bar = document.getElementById('cv-adv-filters');
    if (!bar) return;
    var onHome = (!selCat || selCat === 'all') && !selGenre;
    try {
      var path = (location.pathname || '/').toLowerCase();
      if (path.indexOf('/category/') === 0 || path.indexOf('/genre/') === 0) onHome = false;
    } catch (e) {}
    if (onHome) {
      bar.style.display = 'none';
      bar.setAttribute('hidden', 'hidden');
    } else {
      bar.style.display = 'flex';
      bar.removeAttribute('hidden');
    }
  } catch (e2) {}
}

function cvApplyAdvanceFilters() {
  try {
    if (typeof cvTrackEvent === 'function') {
      cvTrackEvent('filter_use', { year: (typeof selYear!=='undefined'?selYear:'') || 'all', quality: _cvAdvQuality || 'all' });
    }
    if (typeof renderGrid === 'function') renderGrid(true);
    else if (typeof applyFilters === 'function') applyFilters();
    // visual fallback on current cards
    var grid = document.getElementById('cv-grid');
    if (!grid) return;
    grid.querySelectorAll('.cv-card').forEach(function(card) {
      var key = card.getAttribute('data-key');
      if (!key) return;
      var m = (allData || []).find(function(x){ return x._key === key; });
      if (!m) return;
      var show = true;
      if (typeof selYear !== 'undefined' && selYear) {
        var y = (typeof cvMovieYear === 'function') ? cvMovieYear(m) : String(m.year || '').replace(/\D/g,'').substring(0,4);
        if (y !== selYear) show = false;
      }
      if (show && _cvAdvQuality) {
        var blob = (String(m.quality||'') + ' ' + String(m.title||'') + ' ' +
          (m.download1080p ? '1080p ' : '') + (m.download720p ? '720p ' : '') +
          (m.download480p ? '480p ' : '') + (m.download4k ? '4k ' : '')).toLowerCase();
        if (_cvAdvQuality === '4k') { if (!/4k|2160/.test(blob)) show = false; }
        else if (blob.indexOf(_cvAdvQuality) < 0) show = false;
      }
      card.style.display = show ? '' : 'none';
    });
  } catch (e) {}
}
try {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(cvInitAdvanceFilters, 800);
    setTimeout(cvInitAdvanceFilters, 2500);
    setTimeout(cvRefreshAdvanceFilterOptions, 6000);
  });
} catch (e) {}



// ══════════════════════════════════
// ADULT 18+ AGE-GATE
// ══════════════════════════════════
// ── CATEGORY NORMALIZE ──
// Admin panel kabhi display name save karta hai ("Philippines Movies"),
// kabhi slug ("philippines"). Theme pills hamesha slug use karti hain.
// Is function se dono forms ek standard slug ban jati hain taake filter
// + group match sahi chale aur 291 posts sirf 2 na dikhein.
function cvNormalizeCategory(raw) {
  if (!raw) return '';
  var c = String(raw).toLowerCase().trim()
    .replace(/[–—−]/g, '-')
    .replace(/[_\/|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  var slug = c.replace(/\s+/g, '_');
  var compact = c.replace(/\s+/g, '');

  // Adult family (panel labels + slugs + common variants)
  if (compact.indexOf('philippines') === 0 || compact.indexOf('philipine') === 0 ||
      c === 'philippines' || c === 'philippines movies' || c === 'philippine movies' ||
      slug === 'philippines_movies' || slug === 'philippines') {
    return 'philippines';
  }
  if (compact.indexOf('hotshort') === 0 || c.indexOf('hot short') === 0 ||
      slug === 'hot_short_hindi' || slug === 'hot_short_movies_hindi_dubbed' ||
      slug === 'hot_short_movies' || c === 'hot short movies hindi dubbed') {
    return 'hot_short_hindi';
  }
  if (c === 'short films' || c === 'adult short film' || c === 'adult short films' ||
      slug === 'short_films' || compact === 'shortfilms') {
    return 'short_films';
  }
  if (c === 'adult hindi' || slug === 'adult_hindi' || compact === 'adulthindi') return 'adult_hindi';
  if (c === 'adult english' || slug === 'adult_english' || compact === 'adultenglish') return 'adult_english';
  if (c === 'hot series' || slug === 'hot_series' || compact === 'hotseries') return 'hot_series';
  if (c === 'vivamax' || slug === 'vivamax') return 'vivamax';
  if (c === 'adult' || c === 'adult movies' || c === '18+' || compact === 'adultmovies' || slug === 'adult_movies') {
    return 'adult';
  }

  // Non-adult common aliases (panel display name → theme slug)
  if (c === 'hollywood dubbed' || slug === 'hollywood_dubbed') return 'hindi_dubbed';
  if (c === 'english movies' || slug === 'english_movies' || compact === 'englishmovies') return 'english_movies';
  if (c === 'hindi dubbed' || slug === 'hindi_dubbed' || compact === 'hindidubbed') return 'hindi_dubbed';
  if (c === 'dual audio' || slug === 'dual_audio' || compact === 'dualaudio') return 'dual_audio';
  if (c === 'south hindi' || c === 'south hindi dubbed' || slug === 'south_hindi') return 'south_hindi';
  if (c === 'tamil/telugu' || c === 'tamil telugu' || slug === 'tamil_telugu') return 'tamil_telugu';
  if (c === 'bollywood hindi' || slug === 'bollywood_hindi') return 'bollywood_hindi';
  if (c === 'anime hindi' || c === 'anime hindi dubbed' || slug === 'anime_hindi') return 'anime_hindi';
  if (c === 'web series' || c === 'web-series' || slug === 'webseries' || slug === 'web_series') return 'webseries';
  if (c === 'web series hindi' || c === 'web-series hindi dubbed' || slug === 'webseries_hindi') return 'webseries_hindi';
  // K-Drama family → always kdrama_hindi (panel + theme same slug)
  if (c === 'k drama' || c === 'k-drama' || slug === 'kdrama' || slug === 'k_drama' ||
      c === 'k drama hindi' || c === 'k-drama hindi dubbed' || slug === 'kdrama_hindi' ||
      c === 'k-drama hindi' || compact === 'kdramahindi' || compact === 'kdrama' ||
      c.indexOf('k-drama') >= 0 || c.indexOf('k drama') >= 0 || slug.indexOf('kdrama') >= 0) {
    return 'kdrama_hindi';
  }

  // Already a clean slug (underscores) → return as-is
  return slug;
}


function cvAllowAdultContent() {
  // Section OFF → kabhi adult mat dikhao (verified ho to bhi)
  if (window._cvAdultSectionEnabled === false) return false;
  try { return localStorage.getItem('cv_adult_verified') === '1'; } catch (e) { return false; }
}
function cvIsAdultSectionEnabled() {
  return window._cvAdultSectionEnabled !== false;
}
function cvApplyAdultSectionVisibility() {
  var on = cvIsAdultSectionEnabled();
  try {
    document.documentElement.classList.toggle('cv-adult-off', !on);
    document.body.classList.toggle('cv-adult-off', !on);
  } catch (e) {}
  // Hide every adult nav / pill / mobile drawer / dropdown
  try {
    var sel = [
      '.cv-pill[data-cat="adult"]',
      '.cv-pill[data-cat="group:adult"]',
      '.cv-pill[data-cat="philippines"]',
      '.cv-pill[data-cat="hot_short_hindi"]',
      '.cv-pill[data-cat="adult_hindi"]',
      '.cv-pill[data-cat="adult_english"]',
      '.cv-pill[data-cat="hot_series"]',
      '.cv-pill[data-cat="vivamax"]',
      '.cv-pill[data-cat="short_films"]',
      '.cv-subcat-adult',
      '.cv-subcat-item.cv-subcat-adult',
      '.cv-subcat-item[data-cat="group:adult"]',
      '.cv-subcat-item[data-cat="philippines"]',
      '.cv-subcat-item[data-cat="hot_short_hindi"]',
      '.cv-cat-sub-item[data-cat="group:adult"]',
      '.cv-cat-parent-adult',
      '.cv-cat-parent[data-group="adult"]',
      '[data-group="adult"]',
      '#cv-nav-adult',
      '.cv-adult-nav',
      'a[href*="category/adult"]',
      'a[href*="category/philippines"]',
      'a[href*="category/hot-short"]',
      'a[href*="category/vivamax"]'
    ].join(',');
    document.querySelectorAll(sel).forEach(function(el) {
      el.style.display = on ? '' : 'none';
      if (!on) el.setAttribute('hidden', 'hidden');
      else el.removeAttribute('hidden');
    });
    // Mobile drawer group header "🔞 ADULT"
    document.querySelectorAll('.cv-subcat-group').forEach(function(g) {
      var tx = (g.textContent || '').toLowerCase();
      if (tx.indexOf('adult') >= 0 || tx.indexOf('18+') >= 0) {
        g.style.display = on ? '' : 'none';
        if (!on) g.setAttribute('hidden', 'hidden');
        else g.removeAttribute('hidden');
      }
    });
  } catch (e2) {}
  // Footer adult links
  try {
    document.querySelectorAll('a[href*="/category/adult"], a[href*="philippines"], a[href*="hot-short"], a[href*="vivamax"]').forEach(function(a) {
      if (!on) { a.style.display = 'none'; a.setAttribute('hidden','hidden'); }
      else { a.style.display = ''; a.removeAttribute('hidden'); }
    });
  } catch (e3) {}
  // If currently viewing adult cat while OFF → force home
  if (!on) {
    var adultCats = {adult:1,'group:adult':1,philippines:1,hot_short_hindi:1,short_films:1,adult_hindi:1,adult_english:1,hot_series:1,vivamax:1};
    if (adultCats[selCat]) {
      try {
        if (typeof cvApplyFilter === 'function') cvApplyFilter('all');
        else if (typeof applyFilter === 'function') applyFilter('all');
        else { selCat = 'all'; if (typeof renderGrid === 'function') renderGrid(true); }
      } catch (e4) {}
    }
    try { hideAdultGate(); } catch (e5) {}
  }
  // Re-render grid without adult
  try {
    if (typeof renderGrid === 'function') renderGrid(true, true);
    if (typeof buildFeatured === 'function') buildFeatured();
    if (typeof cvBuildMotd === 'function' && window._cvMotdEnabled) cvBuildMotd();
  } catch (e6) {}
}

function cvIsAdultItem(m) {
  if (!m) return false;
  var cat = typeof cvNormalizeCategory === 'function' ? cvNormalizeCategory(m.category) : String(m.category || '').toLowerCase();
  if (['adult','short_films','philippines','hot_short_hindi','adult_hindi','adult_english','hot_series','vivamax'].indexOf(cat) >= 0) return true;
  try {
    if (m.isAdult === true || m.adult === true || m.nsfw === true) return true;
    var tt = String(m.title || '').toLowerCase();
    if (/(18\+|xxx|nsfw|erotic|sex\s*(and|&)?\s*games|seriously\s*single|vivamax|hot\s*short)/i.test(tt)) return true;
  } catch (e) {}
  return false;
}
function cvIsAdultVerified() {
  try { return localStorage.getItem('cv_adult_verified') === '1'; } catch (e) { return false; }
}
function cvSetAdultVerified(uid, email) {
  try {
    localStorage.setItem('cv_adult_verified', '1');
    localStorage.setItem('cv_adult_verified_meta', JSON.stringify({ uid: uid || '', email: email || '', ts: Date.now() }));
  } catch (e) {}
  // Audit trail — Firebase mein bhi log karo (best-effort, silently fail ho sakta hai)
  try {
    if (db && uid) {
      db.ref('adultVerifications/' + uid).set({ email: email || '', ts: Date.now(), ua: navigator.userAgent || '' }).catch(function(){});
    }
  } catch (e) {}
  cvUpdateAdultBadge();
}
// ✅ Header mein "18+ Verified" badge dikhata/chhupata hai — user ko pata
// chalta hai ke wo verified hai, aur wahin se logout bhi kar sakta hai.
function cvUpdateAdultBadge() {
  var badge = document.getElementById('cv-adult-verified-badge');
  if (!badge) return;
  // Always hide — keeps mobile nav clean (adult gate still works)
  badge.style.display = 'none';
}
function cvAdultLogoutPrompt() {
  if (!confirm('18+ verification hata di jaye? Dobara Adult section kholne ke liye verify karna padega.')) return;
  try {
    localStorage.removeItem('cv_adult_verified');
    localStorage.removeItem('cv_adult_verified_meta');
  } catch (e) {}
  cvUpdateAdultBadge();
  // Agar user abhi Adult category dekh raha hai, wapis Home bhej do
  var _adultLogoutCats = {adult:1,'group:adult':1,philippines:1,hot_short_hindi:1,short_films:1,adult_hindi:1,adult_english:1,hot_series:1,vivamax:1};
  if (_adultLogoutCats[selCat]) {
    var homePill = document.querySelector('.cv-pill[data-cat="all"]');
    if (homePill) homePill.click();
    else if (typeof cvApplyFilter === 'function') cvApplyFilter('all', false, null);
  }
}

var _cvAdultGateOnSuccess = null; // gate pass hone ke baad kya karna hai (e.g. openModal wapis try karo)
var _cvFirebaseAuthLoaded = false;

function showAdultGate(onSuccess) {
  _cvAdultGateOnSuccess = (typeof onSuccess === 'function') ? onSuccess : null;
  var gate = document.getElementById('cv-adult-gate');
  if (!gate) return;
  var errEl = document.getElementById('cv-adult-gate-error');
  if (errEl) errEl.textContent = '';
  var cb = document.getElementById('cv-adult-gate-checkbox');
  if (cb) cb.checked = false;
  var checkrow = document.getElementById('cv-adult-gate-checkrow');
  if (checkrow) checkrow.classList.remove('checked');
  gate.classList.add('open');
  try{cvScrollLock();}catch(e){document.body.style.overflow='hidden';}
}

function hideAdultGate() {
  var gate = document.getElementById('cv-adult-gate');
  if (gate) gate.classList.remove('open');
  try{cvScrollUnlock();}catch(e){document.body.style.overflow='';}
  _cvAdultGateOnSuccess = null;

  // Agar user gate cancel kar de aur wo Adult section se aaya tha, wapis
  // "Home" pe le aao — warna active state Adult par atka reh jaata hai.
  if (!cvIsAdultVerified()) {
    var _stuckAdult = false;
    var _ap = document.querySelector('.cv-pill[data-cat="adult"], .cv-pill[data-cat="group:adult"], .cv-subcat-item.active.cv-subcat-adult, .cv-cat-sub-item.active[data-cat="group:adult"]');
    if (_ap && _ap.classList.contains('active')) _stuckAdult = true;
    if (!_stuckAdult && (selCat === 'adult' || selCat === 'group:adult' || selCat === 'philippines' || selCat === 'hot_short_hindi')) _stuckAdult = true;
    if (_stuckAdult) {
      var homePill = document.querySelector('.cv-pill[data-cat="all"]');
      if (homePill) homePill.click();
      else if (typeof cvApplyFilter === 'function') cvApplyFilter('all', false, null);
    }
  }
}

document.getElementById('cv-adult-gate-checkbox').addEventListener('change', function() {
  var checkrow = document.getElementById('cv-adult-gate-checkrow');
  var btn = document.getElementById('cv-adult-gate-google-btn');
  if (this.checked) {
    if (checkrow) checkrow.classList.add('checked');
    if (btn) btn.classList.add('enabled');
  } else {
    if (checkrow) checkrow.classList.remove('checked');
    if (btn) btn.classList.remove('enabled');
  }
});
document.getElementById('cv-adult-gate').addEventListener('click', function(e) {
  if (e.target === this) hideAdultGate();
});
document.getElementById('cv-mylist-modal').addEventListener('click', function(e) {
  if (e.target === this) closeMyListModal();
});
document.getElementById('cv-report-modal').addEventListener('click', function(e) {
  if (e.target === this) closeReportModal();
});

function _cvLoadFirebaseAuth(cb) {
  if (_cvFirebaseAuthLoaded && typeof firebase !== 'undefined' && firebase.auth) { cb(); return; }
  var s = document.createElement('script');
  s.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js';
  s.async = true;
  var fallbackTimer = setTimeout(function() {
    var s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/firebase@10.14.1/firebase-auth-compat.min.js';
    s2.async = true;
    s2.onload = function() { _cvFirebaseAuthLoaded = true; cb(); };
    s2.onerror = function() { cb(new Error('Auth SDK load failed')); };
    document.head.appendChild(s2);
  }, 6000);
  s.onload = function() { clearTimeout(fallbackTimer); _cvFirebaseAuthLoaded = true; cb(); };
  s.onerror = function() { clearTimeout(fallbackTimer); };
  document.head.appendChild(s);
}

function cvAdultGoogleVerify() {
  var cb = document.getElementById('cv-adult-gate-checkbox');
  var errEl = document.getElementById('cv-adult-gate-error');
  var btn = document.getElementById('cv-adult-gate-google-btn');
  if (!cb || !cb.checked) {
    if (errEl) errEl.textContent = 'Please confirm you are 18+ first (tick the checkbox).';
    return;
  }
  if (errEl) errEl.textContent = '';
  if (btn) btn.classList.add('loading');

  _cvLoadFirebaseAuth(function(loadErr) {
    if (loadErr || typeof firebase === 'undefined' || !firebase.auth) {
      if (btn) btn.classList.remove('loading');
      if (errEl) errEl.textContent = 'Verification service failed to load. Please try again.';
      return;
    }
    try {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    } catch (e) {}

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      if (btn) btn.classList.remove('loading');
      var user = result && result.user;
      cvSetAdultVerified(user ? user.uid : '', user ? user.email : '');
      hideAdultGate();

      // All Adult (group:adult) activate — saari adult family load + show
      document.querySelectorAll('.cv-pill').forEach(function(p) { p.classList.remove('active'); });
      document.querySelectorAll('.cv-subcat-item, .cv-cat-sub-item').forEach(function(p) { p.classList.remove('active'); });
      var adultPill = document.querySelector('.cv-pill[data-cat="group:adult"], .cv-pill[data-cat="adult"], .cv-subcat-item[data-cat="group:adult"], .cv-cat-sub-item[data-cat="group:adult"]');
      if (adultPill) adultPill.classList.add('active');
      // parent Adult button ko has-value do
      var adultParent = document.querySelector('.cv-cat-parent[data-group="adult"]');
      if (adultParent) adultParent.classList.add('has-value');
      selCat = 'group:adult'; selGenre = '';
      renderGrid();
      updateSlidersVisibility('group:adult');
      cvLoadCategoryData('group:adult', false);
      try { history.replaceState(null, '', (typeof cvBuildFilterUrl === 'function') ? cvBuildFilterUrl('group:adult', false) : '/category/adult-all'); } catch (e) {}

      if (typeof _cvAdultGateOnSuccess === 'function') {
        var fn = _cvAdultGateOnSuccess;
        _cvAdultGateOnSuccess = null;
        setTimeout(fn, 50);
      }
    }).catch(function(err) {
      if (btn) btn.classList.remove('loading');
      if (errEl) errEl.textContent = (err && err.code === 'auth/popup-closed-by-user')
        ? 'Sign-in was cancelled — please try again.'
        : 'Verification failed. Please try again.';
    });
  });
}


// ══════════════════════════════════
// LOAD SETTINGS, ADS, DATA
// ══════════════════════════════════

// Firebase-dependent init — runs after Firebase loads dynamically
// ⚡ FAST MODAL OPEN — Facebook/WhatsApp/Google se seedha kisi movie link
// (/movie/slug ya ?m=key) pe click hone par pehle poori homepage list
// (40-80 movies) load hone ka wait NAHI karna — sirf us EK movie ko
// Firebase se seoSlug-index (ya direct key) se turant fetch karke modal
// khol dete hain. Homepage grid apni normal speed se background mein
// load hoti rehti hai, alag se. cvRestoreFromUrl() (jo homepage load ke
// baad chalta hai) is flag ko dekh kar dobara wahi kaam repeat nahi karta.
window._cvFastMovieHandled = false;
function cvFastOpenMovieFromUrl() {
  if (!db) return;
  try {
    var pathMatch = location.pathname.match(/^\/movie\/([^\/]+)\/?$/);
    var movieKey = pathMatch ? decodeURIComponent(pathMatch[1]) : new URLSearchParams(location.search).get('m');
    if (!movieKey) return;
    var decoded = decodeURIComponent(movieKey);

    cvEnsureHomeCushion();
    cvInitialUrlLoadDone = true;

    function _cvFastResolve(mv, key) {
      if (!mv || window._cvFastMovieHandled) return;
      window._cvFastMovieHandled = true;
      mv._key = key;
      var already = allData.some(function(x) { return x._key === key; });
      if (!already) allData.unshift(mv);
      openModal(key);
    }

    db.ref('movies').orderByChild('seoSlug').equalTo(decoded).limitToFirst(1)
      .once('value', function(snap) {
        if (window._cvFastMovieHandled || !snap.exists()) return;
        var mv = null, key = null;
        snap.forEach(function(c) { mv = c.val(); key = c.key; });
        _cvFastResolve(mv, key);
      });
    // Direct key se bhi parallel try (agar URL mein slug ki jagah seedha key ho)
    db.ref('movies/' + decoded).once('value', function(snap2) {
      if (window._cvFastMovieHandled || !snap2.exists()) return;
      _cvFastResolve(snap2.val(), decoded);
    });
  } catch (e) {}
}

function _cvOnFirebaseReady() {
  if (!db) return;

  // ⚡ Sabse pehle — shared movie link ho to turant modal open karne ki
  // koshish shuru karo, baaki sab (settings, homepage list waghera) parallel
  // mein apni normal raftar se chalta rahega.
  cvFastOpenMovieFromUrl();

  // ── CONNECTIVITY TEST ──
  // Firebase connection background mein hoti rehti hai, lekin ab user ko
  // koi bhi "Connecting..." badge/message kabhi nahi dikhaya jayega —
  // site turant apni normal UI dikhata hai, connection status silently
  // background mein hi track hoti hai.
  db.ref('.info/connected').on('value', function(snap) {
    // Intentionally no UI shown — sirf internal tracking.
  });

  // Website Settings — Featured Banner + Custom Banner Images
  // ✅ LIVE LISTENER — pehle .once() tha jo sirf page-load par ek baar
  // settings padhta tha. Ab .on() se panel me toggle badalte hi (ON/OFF)
  // site turant update ho jayega, refresh ki zaroorat nahi.
  db.ref('settings').on('value', function(snap) {
    if (!snap.exists()) return;
    var s = snap.val();
    var sl = s.sliders || {};

    // Custom Banner Images — pehle check karo
    var hasCustomImages = (s.bannerImages && Array.isArray(s.bannerImages) && s.bannerImages.length > 0);
    if (hasCustomImages) {
      window._customBannerImages = s.bannerImages;
    } else {
      window._customBannerImages = null;
    }

    // Featured Banner toggle — robust check (true/"true"/1 sab enabled maane)
    var fbVal = sl.featuredBanner;
    var fbEnabled = false; // PERMANENT OFF — featured banner removed
    var featuredWrap = document.getElementById('cv-featured-wrap');
    if (featuredWrap) {
      featuredWrap._adminEnabled = false;
      featuredWrap.style.display = 'none';
    }
    try { localStorage.setItem('cv_fb_off', fbEnabled ? '0' : '1'); } catch (e) {}

    // Movie of the Day toggle — default ON agar admin ne kabhi set nahi kiya (undefined)
    window._cvMotdEnabled = (sl.movieOfTheDay !== false && sl.movieOfTheDay !== 'false' && sl.movieOfTheDay !== 0);
    if (!window._cvMotdEnabled) {
      if (typeof cvMotdHide === 'function') cvMotdHide();
      var motdOuterEl = document.getElementById('cv-motd-outer');
      if (motdOuterEl) motdOuterEl.style.display = 'none';
    } else if (typeof cvBuildMotd === 'function') {
      cvBuildMotd();
      // data late load ho to 1–2 retry
      setTimeout(function(){ try { cvBuildMotd(); } catch(e){} }, 1500);
      setTimeout(function(){ try { cvBuildMotd(); } catch(e){} }, 4000);
    }

    // Adult Section master switch — panel OFF = website se ZERO adult leak
    window._cvAdultSectionEnabled = (sl.adultSection !== false && sl.adultSection !== 'false' && sl.adultSection !== 0);
    try { cvApplyAdultSectionVisibility(); } catch (eAd) {}


    // Now Showing (hero poster stack) toggle — default ON agar admin ne set nahi kiya
    window._cvNsHeroEnabled = false; // PERMANENT OFF — Now Showing removed
    if (!window._cvNsHeroEnabled) {
      var nsHeroEl = document.getElementById('cv-ns-hero');
      if (nsHeroEl) nsHeroEl.style.display = 'none';
      if (_cvNsTimer) { clearInterval(_cvNsTimer); _cvNsTimer = null; }
    } else {
      var nsHeroElOn = document.getElementById('cv-ns-hero');
      try {
        var pNs = new URLSearchParams(location.search);
        if (nsHeroElOn && !(pNs.get('cat') || pNs.get('genre'))) nsHeroElOn.style.display = '';
      } catch(e) { if (nsHeroElOn) nsHeroElOn.style.display = ''; }
      if (typeof buildNsHero === 'function' && allData && allData.length && selCat === 'all' && selGenre === '') {
        buildNsHero();
      }
    }

    // Rebuild featured banner (ON hone par turant content ke saath show hoga,
    // OFF hone par upar wali line already hide kar chuki hai)
    buildFeatured();
  });

  // ── LOAD MOVIES DATA (main fix) ──
  loadMoviesFirstPage();
  // ✅ Agar pehle se 18+ verified session hai to header badge turant dikhao
  cvUpdateAdultBadge();
  // ── URL RESTORE: shared link pe movie/category open karo ──
  window._cvUrlRestorePending = true;
  setupInfiniteScroll();
  watchNewMovies();

  // ── PUSH UPDATES — Real-time listener ──
  cvWatchPushUpdates();
}

// ═══════════════════════════════════════════════════════════════
// 📢 PUSH UPDATES — Real-time Firebase Listener (Theme Side)
// ═══════════════════════════════════════════════════════════════

function cvWatchPushUpdates() {
  if (!db) return;
  // Push updates (announcement, new content, maintenance)
  db.ref('pushUpdates').on('value', function(snap) {
    var d = snap.val() || {};

    // 0. MAINTENANCE MODE — full site lock (panel ON/OFF real-time)
    cvHandleMaintenance(d.maintenance || {});

    // 1. ANNOUNCEMENT BAR
    cvHandleAnnouncement(d.announcement || {});

    // 3. NEW CONTENT POPUP
    cvHandleNewContent(d.newContent || {});
  });
  // Backup path (panel dual-write) — same lock
  try {
    db.ref('settings/siteMaintenance').on('value', function(snap) {
      var m = snap.val();
      if (m && (m.active === true || m.active === 'true' || m.active === 1)) {
        cvHandleMaintenance(m);
      }
    });
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════
// 🔧 MAINTENANCE MODE — stylish full-page lock (refresh se bypass nahi)
// Panel OFF → foran hide (user ko problem nahi)
// ═══════════════════════════════════════════════════════════════
var _cvMaintActive = false;
var _cvMaintLast = null;

function cvHandleMaintenance(m) {
  m = m || {};
  var on = (m.active === true || m.active === 'true' || m.active === 1);
  if (on) {
    _cvMaintLast = m;
    cvShowMaintenance(m);
  } else {
    cvHideMaintenance();
  }
}

function cvShowMaintenance(m) {
  m = m || _cvMaintLast || {};
  _cvMaintActive = true;
  document.documentElement.classList.add('cv-maint-lock');
  if (document.body) document.body.classList.add('cv-maint-lock');

  var root = document.getElementById('cv-maint-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'cv-maint-root';
    root.setAttribute('role', 'alertdialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Site under maintenance');
    (document.body || document.documentElement).appendChild(root);
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  var title = esc(m.title || "We'll be back soon");
  var msg = esc(m.message || 'We are performing maintenance. Please check back shortly.');
  var back = m.backTime
    ? '<div class="cv-m-time">⏰ Expected back: <strong>' + esc(m.backTime) + '</strong></div>'
    : '';

  root.innerHTML =
    '<div class="cv-m-glow"></div>' +
    '<div class="cv-m-card">' +
      '<div class="cv-m-logo">CINENOVA</div>' +
      '<div class="cv-m-badge"><i></i> Maintenance Mode</div>' +
      '<div class="cv-m-icon">🛠️</div>' +
      '<h1>' + title + '</h1>' +
      '<p class="cv-m-msg">' + msg + '</p>' +
      back +
      '<div class="cv-m-bar"><span></span></div>' +
      '<div class="cv-m-foot">Site temporarily unavailable · Restored automatically when maintenance ends</div>' +
    '</div>';
  root.style.display = 'flex';

  // Hide rest of page so nothing peeks through
  try {
    Array.prototype.forEach.call(document.body.children, function(el) {
      if (!el || el.id === 'cv-maint-root') return;
      if (!el.hasAttribute('data-cv-maint-hidden')) {
        el.setAttribute('data-cv-maint-hidden', el.style.display || '');
      }
      el.style.display = 'none';
    });
  } catch (e) {}
}

function cvHideMaintenance() {
  if (!_cvMaintActive && !document.getElementById('cv-maint-root')) return;
  _cvMaintActive = false;
  document.documentElement.classList.remove('cv-maint-lock');
  if (document.body) document.body.classList.remove('cv-maint-lock');
  var root = document.getElementById('cv-maint-root');
  if (root) root.remove();
  try {
    Array.prototype.forEach.call(document.body.children, function(el) {
      if (!el || !el.hasAttribute('data-cv-maint-hidden')) return;
      var prev = el.getAttribute('data-cv-maint-hidden');
      el.style.display = prev || '';
      el.removeAttribute('data-cv-maint-hidden');
    });
  } catch (e) {}
  _cvMaintLast = null;
}

// Refresh / back-button pe bhi lock hold
window.addEventListener('popstate', function() {
  if (_cvMaintActive) cvShowMaintenance(_cvMaintLast);
});


// ── Announcement Bar Handler ──
var _cvAnnBarDismissed = false;
function cvHandleAnnouncement(an) {
  var bar = document.getElementById('cv-ann-bar');
  if (!bar) return;

  if (an.showAnnouncement && an.title && !_cvAnnBarDismissed) {
    // Remove all type classes
    bar.classList.remove('type-info','type-success','type-warning','type-error','type-new');
    bar.classList.add('type-' + (an.type || 'info'));
    bar.classList.add('active');
    // Shift nav below ann-bar
    var nav = document.getElementById('cv-nav');
    if (nav) { setTimeout(function(){ nav.style.top = bar.offsetHeight + 'px'; }, 50); }

    var iconEl  = document.getElementById('cv-ann-icon');
    var titleEl = document.getElementById('cv-ann-title');
    var msgEl   = document.getElementById('cv-ann-msg');
    var linkEl  = document.getElementById('cv-ann-link');

    var typeIcons = {info:'\u2139\ufe0f', success:'\u2705', warning:'\u26a0\ufe0f', error:'\ud83d\udea8', new:'\ud83c\udd95'};
    if (iconEl) iconEl.textContent = typeIcons[an.type || 'info'] || '\ud83d\udce2';

    if (titleEl) titleEl.textContent = an.title || '';
    if (msgEl)   msgEl.textContent   = an.message ? ' — ' + an.message : '';
    if (linkEl) {
      if (an.url) {
        linkEl.href = an.url;
        linkEl.style.display = 'inline';
      } else {
        linkEl.style.display = 'none';
      }
    }
  } else {
    bar.classList.remove('active');
    var nav2 = document.getElementById('cv-nav');
    if (nav2) nav2.style.top = '0';
  }
}

function cvCloseAnnBar() {
  _cvAnnBarDismissed = true;
  var bar = document.getElementById('cv-ann-bar');
  if (bar) bar.classList.remove('active');
  var nav3 = document.getElementById('cv-nav');
  if (nav3) nav3.style.top = '0';
}

// ── New Content Popup Handler ──
var _cvNcPopupKey = '';
function cvHandleNewContent(nc) {
  // Disabled — was causing bounce (full-screen popup after 3s)
  return;

  var overlay = document.getElementById('cv-newcontent-overlay');
  if (!overlay) return;

  var key = nc.title + '|' + (nc.updatedAt || '');
  if (nc.showNewContent && nc.title && key !== _cvNcPopupKey) {
    _cvNcPopupKey = key;
    overlay.classList.remove('active');

    var posterEl = document.getElementById('cv-nc-poster');
    var catEl    = document.getElementById('cv-nc-cat');
    var titleEl  = document.getElementById('cv-nc-title');
    var descEl   = document.getElementById('cv-nc-desc');
    var btnEl    = document.getElementById('cv-nc-btn');

    var backdropEl = document.getElementById('cv-nc-backdrop');
    if (posterEl) {
      posterEl.src = nc.poster || '';
      posterEl.style.opacity = nc.poster ? '1' : '0';
    }
    if (backdropEl) {
      backdropEl.style.backgroundImage = nc.poster ? 'url(' + nc.poster + ')' : 'none';
    }
    if (catEl)   catEl.textContent  = nc.category    || 'New Release';
    if (titleEl) titleEl.textContent = nc.title       || '';
    if (descEl)  descEl.textContent  = nc.description || 'Now available! Watch it now.';

    if (btnEl) {
      btnEl.onclick = function(e) {
        e.preventDefault();
        cvCloseNcPopup();
        // Play worker / VLC — movie key ho to worker, warna pixeldrain/vlcUrl
        if (nc.movieKey && typeof cnGoToWatchWorker === 'function') {
          cnGoToWatchWorker(nc.movieKey, '');
        } else if (nc.vlcUrl && typeof cnOpenInVlc === 'function') {
          var pd = (typeof cnPixeldrainApiUrl === 'function') ? cnPixeldrainApiUrl(nc.vlcUrl) : null;
          cnOpenInVlc(pd || nc.vlcUrl);
        } else if (nc.link && nc.link !== '#') {
          window.location.href = nc.link;
        }
      };
    }

    // Full-screen overlay 3 seconds baad
    setTimeout(function() { overlay.classList.add('active'); }, 3000);

  } else if (!nc.showNewContent) {
    overlay.classList.remove('active');
  }
}

function cvCloseNcPopup() {
  var overlay = document.getElementById('cv-newcontent-overlay');
  if (overlay) overlay.classList.remove('active');
}

function cvNcOverlayClick(e) {
  if (e.target === document.getElementById('cv-newcontent-overlay')) {
    cvCloseNcPopup();
  }
}

// Show request form after grid loads (independent of Firebase)
setTimeout(function() {
  var rw = document.getElementById('cv-request-wrap');
  if (rw) rw.style.display = 'block';
}, 2000);

// ══════════════════════════════════
// OPTIMIZED DATA LOADING — IndexedDB Cache + Firebase Pagination
// ══════════════════════════════════
var PAGE_SIZE = 100;        // pehli paint ke liye
var PAGE_SIZE_BULK = 4000;  // ~2880 movies — ek hi request mein baqi sab
var CACHE_NAME = 'cv_movies_v1';
var CACHE_TTL = 30 * 60 * 1000; // 30 min — deleted/merged posts jaldi site se hatain
var lastFirebaseKey = null; // Firebase pagination cursor
var allLoaded = false;      // All loaded?
var isLoadingMore = false;  // Loading in progress?

// ══════════════════════════════════
// CATEGORY/GENRE INDEXED QUERY — direct Firebase query by category/genre
// (orderByChild+equalTo) taake poora dataset download kiye bina, seedha
// us category ki movies mil jayein. NOTE: Firebase console mein Realtime
// Database > Rules mein ye index add karna zaroori hai warna slow warning
// aayegi bade dataset par:
//   "movies": { ".indexOn": ["category", "genre"] }
// ══════════════════════════════════
var cvCategoryCache = {}; // { "category:hollywood": [...], "genre:action": [...] }

function cvFetchByIndex(field, value, cb) {
  var cacheKey = field + ':' + value;
  if (cvCategoryCache[cacheKey]) { cb(cvCategoryCache[cacheKey]); return; }
  if (!db) { setTimeout(function() { cvFetchByIndex(field, value, cb); }, 400); return; }
  db.ref('movies').orderByChild(field).equalTo(value).once('value', function(snap) {
    var items = [];
    if (snap.exists()) {
      snap.forEach(function(child) {
        var item = child.val();
        item._key = child.key;
        items.push(item);
      });
      items.sort(function(a, b) { return (b.addedAt || 0) - (a.addedAt || 0); });
    }
    cvCategoryCache[cacheKey] = items;
    cb(items);
  }, function() {
    // Index missing ya query fail ho gayi — purane (poora dataset load
    // karne wale) tareeqe pe khamoshi se fallback kar do, taake site kabhi
    // na tootay chahe Firebase Rules mein index add kiya ho ya nahi.
    cb(null);
  });
}

// Category ya genre select hote hi direct indexed query se sirf uske
// movies mangwao — is se allData mein turant merge ho jaate hain aur
// user ko poora dataset load hone ka wait nahi karna padta.
// Panel display-name variants jo Firebase mein save ho sakte hain
// (slug ke alawa). Indexed query in par bhi chalao taake jaldi mile.

// ═══ Pretty category URLs: /category/south-hindi  (not ?cat=south_hindi)
var CV_CAT_URL_SLUG = {
  english_movies: 'english-movies',
  hindi_dubbed: 'hindi-dubbed',
  dual_audio: 'dual-audio',
  south_hindi: 'south-hindi',
  bollywood_hindi: 'bollywood',
  anime_hindi: 'anime-hindi',
  animation_hindi_dubbed: 'animation',
  webseries_hindi: 'web-series',
  kdrama_hindi: 'k-drama',
  philippines: 'philippines',
  hot_short_hindi: 'hot-short',
  adult: 'adult',
  short_films: 'short-films',
  'group:hollywood': 'hollywood',
  'group:tollywood': 'tollywood',
  'group:bollywood': 'bollywood-all',
  'group:animation': 'animation-all',
  'group:webseries': 'web-series-all',
  'group:kdrama': 'k-drama-all',
  'group:adult': 'adult-all',
  hollywood: 'hollywood',
  bollywood: 'bollywood',
  tollywood: 'tollywood',
  animation: 'animation',
  webseries: 'web-series',
  kdrama: 'k-drama',
  punjabi: 'punjabi',
  bengali: 'bengali',
  tamil_telugu: 'tamil-telugu'
};
var CV_URL_SLUG_TO_CAT = {};
(function() {
  Object.keys(CV_CAT_URL_SLUG).forEach(function(k) {
    CV_URL_SLUG_TO_CAT[CV_CAT_URL_SLUG[k]] = k;
    CV_URL_SLUG_TO_CAT[String(k).replace(/_/g, '-')] = k;
  });
})();

function cvCategoryLabel(c) {
  var k = String(c || '').toLowerCase().replace(/[\s\-]+/g, '_');
  var map = {
    english_movies: 'Hollywood', hollywood: 'Hollywood',
    hindi_dubbed: 'Hindi Dub', dual_audio: 'Dual Audio',
    south_hindi: 'South Hindi', tollywood: 'South Hindi',
    bollywood_hindi: 'Bollywood', bollywood: 'Bollywood',
    anime_hindi: 'Anime', animation_hindi_dubbed: 'Animation', animation: 'Animation',
    webseries_hindi: 'Web Series', webseries: 'Web Series',
    kdrama_hindi: 'K-Drama', kdrama: 'K-Drama',
    philippines: 'Philippines', hot_short_hindi: 'Hot Short', adult: 'Adult'
  };
  return map[k] || String(c || '').replace(/_/g, ' ');
}
/** Short badge text for poster corner */
function cvCategoryShort(c) {
  var k = String(c || '').toLowerCase().replace(/[\s\-]+/g, '_');
  var map = {
    english_movies: 'ENG', hollywood: 'ENG',
    hindi_dubbed: 'DUB', dual_audio: 'DUAL',
    south_hindi: 'SOUTH', tollywood: 'SOUTH',
    bollywood_hindi: 'BOLLY', bollywood: 'BOLLY',
    anime_hindi: 'ANIME', animation_hindi_dubbed: 'ANIM', animation: 'ANIM',
    webseries_hindi: 'SERIES', webseries: 'SERIES',
    kdrama_hindi: 'KDRAMA', kdrama: 'KDRAMA',
    philippines: 'ADULT', hot_short_hindi: 'HOT', adult: 'ADULT'
  };
  return map[k] || '';
}
function cvCatToUrlSlug(cat) {
  if (!cat || cat === 'all' || cat === 'watchlist') return '';
  if (CV_CAT_URL_SLUG[cat]) return CV_CAT_URL_SLUG[cat];
  return String(cat).toLowerCase().replace(/^group:/, '').replace(/_/g, '-').replace(/:/g, '-');
}
function cvUrlSlugToCat(slug) {
  if (!slug) return 'all';
  slug = decodeURIComponent(String(slug)).toLowerCase().replace(/^\/+|\/+$/g, '');
  if (CV_URL_SLUG_TO_CAT[slug]) return CV_URL_SLUG_TO_CAT[slug];
  var gmap = { hollywood: 'group:hollywood', tollywood: 'group:tollywood', bollywood: 'group:bollywood',
    animation: 'group:animation', 'web-series': 'group:webseries', 'k-drama': 'group:kdrama', adult: 'group:adult',
    'bollywood-all': 'group:bollywood', 'animation-all': 'group:animation', 'web-series-all': 'group:webseries',
    'k-drama-all': 'group:kdrama', 'adult-all': 'group:adult' };
  if (gmap[slug]) return gmap[slug];
  return slug.replace(/-/g, '_');
}
function cvBuildFilterUrl(cat, isGenre) {
  if (isGenre && cat) {
    return '/genre/' + encodeURIComponent(String(cat).toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-'));
  }
  if (!cat || cat === 'all') return '/';
  if (cat === 'watchlist') return '/?cat=watchlist';
  return '/category/' + encodeURIComponent(cvCatToUrlSlug(cat));
}

var CV_CAT_ALIASES = {
  /* SYNC with Admin Panel category slugs — v2026.09.14 */
  english_movies: ['English Movies', 'English-Movies', 'english movies', 'english', 'hollywood'],
  hindi_dubbed: ['Hindi Dubbed', 'hollywood_dubbed', 'Hollywood Dubbed', 'hindi-dubbed'],
  dual_audio: ['Dual Audio', 'dual-audio', 'dual audio'],
  south_hindi: ['South Hindi Dubbed', 'South Hindi', 'south indian', 'tollywood'],
  bollywood_hindi: ['Bollywood Hindi', 'Bollywood'],
  anime_hindi: ['Anime series Hindi Dubbed', 'Anime Hindi Dubbed', 'Anime'],
  animation_hindi_dubbed: ['Animation Hindi Dubbed', 'Animation'],
  webseries_hindi: ['Web-Series Hindi Dubbed', 'Web Series Hindi', 'Web Series'],
  kdrama_hindi: ['K-Drama Hindi Dubbed', 'K Drama Hindi', 'kdrama hindi', 'K-Drama'],
  philippines: ['Philippines Movies', 'Philippines', 'philippines movies', 'PHILIPPINES', 'Philippine Movies', 'VivaMax'],
  hot_short_hindi: ['Hot Short Movies Hindi dubbed', 'Hot Short Movies', 'hot short movies hindi dubbed', 'Hot Short Hindi', 'Hot Web Series'],
  adult: ['Adult', 'Adult Movies', 'adult movies', 'ADULT'],
  short_films: ['Short Films', 'Adult Short Film', 'short films']
};

function cvLoadCategoryData(val, isGenre) {
  if (!val || val === 'all' || val === 'watchlist') return;
  if (!isGenre && String(val).indexOf('group:') === 0) {
    var g = String(val).slice(6);
    var keys = (window.CV_CAT_GROUPS && window.CV_CAT_GROUPS[g]) || [];
    keys.forEach(function(k){ cvLoadCategoryData(k, false); });
    return;
  }
  var field = isGenre ? 'genre' : 'category';

  function mergeItems(items) {
    if (!items || !items.length) return false;
    var existingKeys = {};
    allData.forEach(function(m) { existingKeys[m._key] = true; });
    var added = false;
    items.forEach(function(m) {
      if (!existingKeys[m._key]) { allData.push(m); added = true; }
    });
    if (added) { _cvCatIndex = null; _cvCatIndexLen = -1; }
    return added;
  }

  // Local scan first (normalized) — kdrama_hindi / dual_audio turant
  if (!isGenre && typeof cvNormalizeCategory === 'function') {
    var want = cvNormalizeCategory(val);
    var localHit = [];
    (allData || []).forEach(function(m) {
      if (cvNormalizeCategory(m.category) === want) localHit.push(m);
      // kdrama family
      if (want === 'kdrama_hindi') {
        var mc = cvNormalizeCategory(m.category);
        if (mc === 'kdrama' || mc === 'kdrama_hindi') localHit.push(m);
      }
    });
    if (localHit.length && mergeItems(localHit)) {
      if (typeof cvScheduleRender === 'function') cvScheduleRender(false);
      else if (typeof renderGrid === 'function') renderGrid(false);
    }
  }

  // 1) Primary slug query
  cvFetchByIndex(field, val, function(items) {
    if (items === null) {
      _cvLoadAllForCategory();
      return;
    }
    var added = mergeItems(items);
    cvFirstResponseReceived = true;
    if (added || !cvFilteredList.length) {
      if (typeof cvScheduleRender === 'function') cvScheduleRender(false);
      else renderGrid(false);
    }

    // 2) Alias queries — debounced render (har alias pe full re-render mat)
    if (!isGenre && CV_CAT_ALIASES[val]) {
      CV_CAT_ALIASES[val].forEach(function(alias) {
        cvFetchByIndex(field, alias, function(aliasItems) {
          if (aliasItems && aliasItems.length && mergeItems(aliasItems)) {
            if (typeof cvScheduleRender === 'function') cvScheduleRender(false);
            else renderGrid(false);
          }
        });
      });
    }

    // 3) PERF: category click pe poori library load NA karo (ye hang ka main cause tha).
    // Indexed query + aliases kaafi hain. Full load sirf search / last-page pe.
  });
}

// IndexedDB helpers
var _idbInstance = null;
function idbOpen(cb) {
  if (_idbInstance) { cb(null, _idbInstance); return; }
  try {
    var req = indexedDB.open('CineNovaDB', 1);
    req.onupgradeneeded = function(e) {
      var db2 = e.target.result;
      if (!db2.objectStoreNames.contains('movies')) db2.createObjectStore('movies', {keyPath:'_key'});
      if (!db2.objectStoreNames.contains('meta')) db2.createObjectStore('meta', {keyPath:'k'});
    };
    req.onsuccess = function(e) { _idbInstance = e.target.result; cb(null, _idbInstance); };
    req.onerror = function() { cb('idb_error'); };
  } catch(e) { cb('idb_unavailable'); }
}

function idbGetAll(cb) {
  idbOpen(function(err, idb) {
    if (err) return cb(null);
    try {
      var tx = idb.transaction(['movies','meta'], 'readonly');
      var metaReq = tx.objectStore('meta').get('ts');
      metaReq.onsuccess = function() {
        var ts = metaReq.result ? metaReq.result.v : 0;
        if (Date.now() - ts > CACHE_TTL) return cb(null); // Cache stale
        var movReq = tx.objectStore('movies').getAll();
        movReq.onsuccess = function() { cb(movReq.result || []); };
        movReq.onerror = function() { cb(null); };
      };
      metaReq.onerror = function() { cb(null); };
    } catch(e) { cb(null); }
  });
}

var _idbSaveTimer = null;
var _idbSavePending = null;
var _idbLastFullSave = 0;

// Full save — throttled (har page pe 500+ put mat karo = hang)
function idbSaveAll(movies) {
  if (!movies || !movies.length) return;
  _idbSavePending = movies;
  if (_idbSaveTimer) return;
  _idbSaveTimer = setTimeout(function() {
    _idbSaveTimer = null;
    var list = _idbSavePending;
    _idbSavePending = null;
    if (!list || !list.length) return;
    // Max ~2 min mein ek full save; warna skip (RAM pe data pehle se hai)
    var now = Date.now();
    if (now - _idbLastFullSave < 90000 && list.length > 120) return;
    _idbLastFullSave = now;
    idbOpen(function(err, idb) {
      if (err) return;
      try {
        var tx = idb.transaction(['movies','meta'], 'readwrite');
        var store = tx.objectStore('movies');
        // Sirf pehle 150 cache (home fast start) — poori 17k IDB mein mat thelo
        var maxCache = 800; // return visit pe zyada cache = faster
        var slice = list.length > maxCache ? list.slice(0, maxCache) : list;
        slice.forEach(function(m) { try { store.put(m); } catch(e){} });
        tx.objectStore('meta').put({k:'ts', v: Date.now()});
        tx.objectStore('meta').put({k:'count', v: slice.length});
      } catch(e) {}
    });
  }, 1200);
}

// Sirf nayi items — pagination pe yeh use karo
function idbSaveNewItems(items) {
  if (!items || !items.length) return;
  idbOpen(function(err, idb) {
    if (err) return;
    try {
      var tx = idb.transaction(['movies'], 'readwrite');
      var store = tx.objectStore('movies');
      // Cap: cache chhota rakho
      items.slice(0, 40).forEach(function(m) { try { store.put(m); } catch(e){} });
    } catch(e) {}
  });
}

function idbClear() {
  idbOpen(function(err, idb) {
    if (err) return;
    try {
      var tx = idb.transaction(['movies','meta'], 'readwrite');
      tx.objectStore('movies').clear();
      tx.objectStore('meta').clear();
    } catch(e) {}
  });
}

// Load first page from Firebase with optional cache
function loadMoviesFirstPage() {
  // Try cache first for instant render
  idbGetAll(function(cached) {
    if (cached && cached.length > 0) {
      allData = cached.sort(function(a,b){ return (b.addedAt||0)-(a.addedAt||0); });
      renderGrid();
      buildTrending();
      buildTsSlider();
      buildFeatured();
      showStatus('', '');
      // Attach realtime watchers immediately with cached keys as baseline
      watchNewMovies();
      // Cache se data mila — URL restore abhi karo (Firebase se pehle)
      if (window._cvUrlRestorePending) {
        window._cvUrlRestorePending = false;
        cvRestoreFromUrl();
      }
    }
    // Always fetch fresh from Firebase (background if cache hit)
    fetchFirebasePage(true);
  });
}


// ══ FAST FULL LOAD (~2880 movies, ek request) ══
var _cvBulkStarted = false;
function cvBulkLoadAllMovies() {
  if (_cvBulkStarted || allLoaded || !db) return;
  _cvBulkStarted = true;
  var n = typeof PAGE_SIZE_BULK !== 'undefined' ? PAGE_SIZE_BULK : 4000;
  try {
    if (typeof showLoadingMore === 'function') showLoadingMore(true);
  } catch (e) {}
  db.ref('movies').orderByKey().limitToLast(n).once('value', function(snap) {
    try { if (typeof showLoadingMore === 'function') showLoadingMore(false); } catch (e) {}
    if (!snap || !snap.exists()) {
      allLoaded = true;
      return;
    }
    var items = [];
    snap.forEach(function(child) {
      var item = child.val();
      if (!item) return;
      item._key = child.key;
      items.push(item);
    });
    // Newest first (push keys chronological)
    items.sort(function(a, b) {
      var ta = a.addedAt || 0, tb = b.addedAt || 0;
      if (tb !== ta) return tb - ta;
      return (a._key < b._key) ? 1 : -1;
    });
    allData = items;
    allLoaded = true;
    lastFirebaseKey = items.length ? items[items.length - 1]._key : null;
    _cvCatIndex = null;
    _cvCatIndexLen = -1;
    try { if (typeof idbClear === 'function') idbClear(); } catch (eIdb) {}
    // Grid pehle (user ko content dikhao) — heavy widgets idle pe
    try {
      if (typeof renderGrid === 'function') renderGrid(false, true);
    } catch (e) {}
    function _cvIdle(fn, delay) {
      try {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(function(){ try { fn(); } catch(e){} }, { timeout: delay || 2000 });
        } else {
          setTimeout(function(){ try { fn(); } catch(e){} }, Math.min(delay || 200, 400));
        }
      } catch (eI) { setTimeout(function(){ try { fn(); } catch(e){} }, 300); }
    }
    _cvIdle(function() {
      try { if (typeof buildFeatured === 'function') buildFeatured(); } catch (e) {}
    }, 400);
    _cvIdle(function() {
      try { if (typeof buildTrending === 'function') buildTrending(); } catch (e) {}
      try { if (typeof buildTsSlider === 'function') buildTsSlider(); } catch (e) {}
      try { if (typeof buildNsHero === 'function') buildNsHero(); } catch (e) {}
    }, 900);
    _cvIdle(function() {
      try { if (typeof idbSaveAll === 'function') idbSaveAll(allData); } catch (e) {}
    }, 2500);
    try { if (typeof watchNewMovies === 'function') watchNewMovies(); } catch (e4) {}
    try {
      if (typeof searchQ === 'string' && searchQ.trim() && typeof cvRefreshSearchUI === 'function') {
        _cvIdle(function(){ cvRefreshSearchUI(); }, 600);
      }
    } catch (e7) {}
  }, function(err) {
    _cvBulkStarted = false;
    try { if (typeof showLoadingMore === 'function') showLoadingMore(false); } catch (e) {}
    // fallback: continue pagination
    if (!allLoaded && typeof fetchFirebasePage === 'function') {
      setTimeout(function(){ fetchFirebasePage(false); }, 400);
    }
  });
}


function fetchFirebasePage(isFirst, _retryCount) {
  if (isLoadingMore || (allLoaded && !isFirst)) return;
  // PERF/CRASH FIX: agar Firebase abhi load hi nahi hui (slow/blocked
  // network — bilkul wahi users jinke liye site "nahi chalti" thi), to
  // db.ref() call karne se seedha crash ho jata tha (TypeError: Cannot
  // read properties of null). Ab bas thodi der wait karke khud retry
  // karta hai jab tak Firebase ready na ho jaye — koi crash nahi.
  _retryCount = _retryCount || 0;
  if (!db) {
    if (_retryCount > 25) { // ~faster fail
      isLoadingMore = false;
      if (isFirst && (!allData || !allData.length) && typeof cvShowLoadFailure === 'function') {
        cvShowLoadFailure();
      }
      return;
    }
    setTimeout(function() { fetchFirebasePage(isFirst, _retryCount + 1); }, 200);
    return;
  }
  isLoadingMore = true;

  // Search mode: badi page size — 17k library jaldi scan ho
  var pageSz = (window._cvSearchMode ? 150 : PAGE_SIZE);
  var query = db.ref('movies').orderByKey().limitToLast(pageSz);
  if (!isFirst && lastFirebaseKey) {
    query = db.ref('movies').orderByKey().endAt(lastFirebaseKey).limitToLast(pageSz + 1);
  }

  // Connection timeout — 10 seconds (pehle 6s tha, jo normal connections pe bhi
  // bohat jaldi trigger ho jata tha). Ab pehli baar timeout hone par khud hi ek
  // baar background mein retry karte hain — sirf dusri baar bhi fail ho to hi
  // user ko manual "Reload" wala dead-end dikhate hain.
  var fetchTimeout = null;
  var didRespond = false;
  if (isFirst) {
    fetchTimeout = setTimeout(function() {
      if (didRespond) return;
      isLoadingMore = false;
      var hasCachedContent = allData && allData.length > 0;
      if (_retryCount < 1) {
        // Cache se content pehle se dikh raha ho to grid ko touch hi mat karo —
        // sirf background mein khamoshi se retry karo.
        if (!hasCachedContent) {
          var gridRetry = document.getElementById('cv-grid');
          if (gridRetry) gridRetry.innerHTML = '<div class="cv-empty"><p>🔄</p><p>Taking longer than usual, retrying...<br/><small style="color:#7d7d7d">Please wait a moment</small></p></div>';
        }
        fetchFirebasePage(true, _retryCount + 1);
      } else if (!hasCachedContent) {
        var grid = document.getElementById('cv-grid');
        if (grid) grid.innerHTML = '<div class="cv-empty"><p>⚡</p><p>Connection is slow<br/><small style="color:#7d7d7d">Check your internet connection — <a href="javascript:location.reload()" style="color:#e50914">Reload</a></small></p></div>';
      }
    }, 10000);
  }

  query.once('value', function(snap) {
    didRespond = true;
    if (fetchTimeout) clearTimeout(fetchTimeout);
    isLoadingMore = false;
    showLoadingMore(false);
    if (isFirst) cvFirstResponseReceived = true; // ab pata chal gaya DB mein kya hai
    if (!snap.exists()) {
      allLoaded = true;
      if (isFirst && allData.length === 0) {
        document.getElementById('cv-grid').innerHTML =
          '<div class="cv-empty"><p>🎬</p><p>No movies found<br/><small style="color:#7d7d7d">Add data in Firebase or check your connection</small></p></div>';
      } else {
        renderGrid(false); // category select thi lekin DB mein aur kuch nahi bacha — ab sahi "no results" dikhao
      }
      return;
    }

    var newItems = [];
    snap.forEach(function(child) {
      var item = child.val();
      item._key = child.key;
      newItems.push(item);
    });

    if (!isFirst && newItems.length > 0) {
      // Remove the overlapping key (endAt includes it)
      newItems = newItems.filter(function(m) { return m._key !== lastFirebaseKey; });
    }

    if (newItems.length < pageSz) {
      allLoaded = true;
    }

    if (newItems.length > 0) {
      lastFirebaseKey = newItems[0]._key; // Oldest key for next page
      newItems.reverse(); // Newest first
    }

    if (isFirst) {
      allData = newItems;
      idbClear();
      // Turant baqi saari movies ek request mein (2880 ke liye best)
      setTimeout(function() {
        if (typeof cvBulkLoadAllMovies === 'function') cvBulkLoadAllMovies();
      }, 50);
    } else {
      // Append, dedupe
      var existingKeys = {};
      allData.forEach(function(m) { existingKeys[m._key] = true; });
      newItems.forEach(function(m) {
        if (!existingKeys[m._key]) allData.push(m);
      });
    }

    // IDB: pehli load pe limited cache; pagination pe sirf naye items (hang fix)
    if (isFirst) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(function(){ idbSaveAll(allData); });
      } else {
        setTimeout(function(){ idbSaveAll(allData); }, 100);
      }
    } else if (newItems && newItems.length) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(function(){ idbSaveNewItems(newItems); });
      } else {
        setTimeout(function(){ idbSaveNewItems(newItems); }, 100);
      }
    }
    renderGrid(isFirst);
    showLoadingMore(false);
    // Search chal rahi ho to har page ke baad results refresh (progressive)
    if (window._cvSearchMode || (typeof searchQ === 'string' && searchQ.trim())) {
      try { cvRefreshSearchUI(); } catch (e) {}
    }
    if (!isFirst && cvPendingGoToPage) {
      var _cvTargetPage = cvPendingGoToPage;
      cvPendingGoToPage = null;
      cvGoPage(_cvTargetPage);
    }
    if (isFirst) {
      buildTrending();
      buildTsSlider();
      buildFeatured();
      buildNsHero();
      // Attach realtime watchers now that allData is populated from Firebase
      watchNewMovies();
      // URL restore — shared link pe movie/category open karo
      if (window._cvUrlRestorePending) {
        window._cvUrlRestorePending = false;
        cvRestoreFromUrl();
      }
    }

  }, function(err) {
    didRespond = true;
    if (fetchTimeout) clearTimeout(fetchTimeout);
    isLoadingMore = false;
    showLoadingMore(false);
    if (isFirst) {
      if (_retryCount < 3) {
        setTimeout(function() {
          isLoadingMore = false;
          fetchFirebasePage(true, _retryCount + 1);
        }, 2500);
        if (!allData || allData.length === 0) {
          var gridErr = document.getElementById('cv-grid');
          if (gridErr) gridErr.innerHTML = '<div class="cv-empty"><p>🔄</p><p>Connection issue — retrying...<br/><small style="color:#7d7d7d">' + (err.message||'Firebase error') + '</small></p></div>';
        }
      } else if (!allData || allData.length === 0) {
        var gridFail = document.getElementById('cv-grid');
        if (gridFail) gridFail.innerHTML = '<div class="cv-empty"><p>⚡</p><p>Site load nahi ho saka<br/><small style="color:#7d7d7d">Internet check karein — <a href="javascript:location.reload()" style="color:#e50914">Reload</a></small></p></div>';
      }
    } else {
      showStatus('❌ Load error: ' + (err.message||''), '#e50914');
    }
  });
}

// Realtime listeners — no delay, catch all changes instantly
var newestKey = null;
var _cvRenderDebounce = null;
var _cvWatchersAttached = false;

function _cvDebouncedRefresh(forceHomeTop) {
  clearTimeout(_cvRenderDebounce);
  _cvRenderDebounce = setTimeout(function() {
    // Re-sort by addedAt before saving/rendering
    allData.sort(function(a, b) { return (b.addedAt || 0) - (a.addedAt || 0); });
    try { if (typeof idbSaveAll === 'function') idbSaveAll(allData); } catch (eIdb) {}
    // Nayi movie aayi ho to Home page 1 refresh (top pe NEW)
    var resetPage = false;
    try {
      if (forceHomeTop && (!selCat || selCat === 'all') && !selGenre) {
        cvCurrentPage = 1;
        resetPage = true;
      }
    } catch (eR) {}
    // silent=false jab naya post top pe dikhana ho, warna anti-blink silent
    renderGrid(resetPage, !forceHomeTop);
    try {
      if (typeof buildTrending === 'function') buildTrending();
      if (typeof buildTsSlider === 'function') buildTsSlider();
      if (typeof buildFeatured === 'function') buildFeatured();
      if (typeof buildNsHero === 'function') buildNsHero();
      if (typeof cvBuildMovieBoxHome === 'function') cvBuildMovieBoxHome();
    } catch (eB) {}
  }, 300);
}

function watchNewMovies() {
  if (_cvWatchersAttached) return;
  _cvWatchersAttached = true;

  // ── PERF FIX: pehle yahan `db.ref('movies').on(...)` — bina kisi limit ke
  // — laga hua tha. Iska matlab tha: har visitor ke browser mein, poore
  // 'movies' node (aapki SAARI movies, chahe kitni bhi sau/hazar hon) ka
  // real-time sync automatically shuru ho jata tha, sirf naye add/edit
  // detect karne ke liye — jabke grid pe sirf 20-30 paginated movies dikhti
  // hain. Jitni catalog badhi, utna hi zyada data/CPU/RAM har tab par
  // consume hota gaya — isi se site "ruk ruk ke" chalti thi aur waqt ke
  // saath aur slow hoti jati. Ab sirf recent-most movies (jo Firebase push
  // keys ki wajah se chronological order mein hain) ke limited window par
  // hi listen hota hai — catalog jitni bhi badi ho, sync hamesha halka
  // rehta hai.
  var CV_WATCH_WINDOW = 60;
  var watchQuery = db.ref('movies').orderByKey().limitToLast(CV_WATCH_WINDOW);

  // We track by key so initial data events are skipped
  var initialKeys = {};
  allData.forEach(function(m) { initialKeys[m._key] = true; });

  watchQuery.on('child_added', function(snap) {
    var item = snap.val();
    if (!item) return;
    item._key = snap.key;
    if (initialKeys[item._key]) return; // Skip already-loaded items
    var exists = allData.some(function(m) { return m._key === item._key; });
    if (!exists) {
      if (!item.addedAt) item.addedAt = Date.now();
      allData.unshift(item);
      try {
        _cvCatIndex = null;
        _cvCatIndexLen = -1;
      } catch (eIx) {}
      try {
        if ((!selCat || selCat === 'all') && !selGenre && typeof cvCurrentPage !== 'undefined') {
          cvCurrentPage = 1;
        }
      } catch (ePg) {}
      _cvDebouncedRefresh(true);
    }
  });

  // ── MOVIE EDITED ──
  // PERF FIX: pehle yeh har single child_changed event par (chahe sirf
  // downloadCount ka +1 hi kyun na ho — jo HAR download click par site
  // ke HAR khule tab mein fire hota hai) poori list reorder + poora grid/
  // trending/slider/featured re-render kar deta tha. Isse busy site par
  // scroll/UI baar baar "jump"/jank karti thi bina kisi asal content edit
  // ke. Ab sirf tab hi reorder+re-render hota hai jab koi asal content
  // field (title, thumbnail, category, links wagera) badle — sirf
  // counter-type fields (downloadCount/views/rating) badalne par list
  // ka wahi item silently in-place update ho jata hai, koi visible
  // re-render/reflow trigger nahi hota.
  var CV_COUNTER_ONLY_FIELDS = { downloadCount: true, views: true, rating: true, ratingCount: true };
  watchQuery.on('child_changed', function(snap) {
    var updated = snap.val();
    updated._key = snap.key;

    var idx = -1;
    for (var i = 0; i < allData.length; i++) {
      if (allData[i]._key === updated._key) { idx = i; break; }
    }
    if (idx === -1) {
      allData.unshift(updated);
      _cvDebouncedRefresh();
      return;
    }

    var oldItem = allData[idx];
    var onlyCountersChanged = true;
    var seenKeys = {};
    Object.keys(oldItem).forEach(function(k) { seenKeys[k] = true; });
    Object.keys(updated).forEach(function(k) { seenKeys[k] = true; });
    for (var k in seenKeys) {
      if (k === '_key') continue;
      if (JSON.stringify(oldItem[k]) !== JSON.stringify(updated[k])) {
        if (!CV_COUNTER_ONLY_FIELDS[k]) { onlyCountersChanged = false; break; }
      }
    }

    if (onlyCountersChanged) {
      allData[idx] = updated; // in-place, no reorder, no re-render
      return;
    }

    // Asal content edit — purani jagah se hatao, top pe le aao (addedAt
    // edit ke waqt refresh hota hai isliye)
    allData.splice(idx, 1);
    allData.unshift(updated);
    _cvDebouncedRefresh();
  });

  // ── MOVIE DELETED ──
  watchQuery.on('child_removed', function(snap) {
    var removedKey = snap.key;
    allData = allData.filter(function(m) { return m._key !== removedKey; });
    try {
      idbOpen(function(err, idb) {
        if (err || !idb) return;
        try {
          var tx = idb.transaction(['movies'], 'readwrite');
          tx.objectStore('movies').delete(removedKey);
        } catch (e2) {}
      });
    } catch (e3) {}
    _cvDebouncedRefresh();
  });
}

// Infinite scroll disabled — pagination use ho rahi hai
function showLoadingMore(show) {
  var el = document.getElementById('cv-load-bar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cv-load-bar';
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<span class="cv-load-spin" aria-hidden="true"></span><span class="cv-load-txt">Loading…</span>';
    document.body.appendChild(el);
  }
  if (show) {
    el.classList.add('show');
    // Status toast hide — double popup mat dikhao
    try {
      var sb = document.getElementById('cv-status-bar');
      if (sb) sb.style.opacity = '0';
    } catch (e) {}
  } else {
    el.classList.remove('show');
  }
}

function setupInfiniteScroll() {
  // Disabled — pagination replaces infinite scroll
}

// ══════════════════════════════════
// STATIC PAGE ROUTER
// ══════════════════════════════════
(function() {
  var path = window.location.pathname.toLowerCase();
  var isStaticPage = false;
  var pageContent = '';

  // ── ABOUT US ──
  if (path.indexOf('/p/about-us') !== -1) {
    isStaticPage = true;
    pageContent = '<div class="page-hero" style="text-align:center;padding:50px 20px 40px;position:relative;overflow:hidden"><div style="content:\'\';position:absolute;inset:0;background:radial-gradient(ellipse at center top,rgba(229,9,20,0.12) 0%,transparent 70%);pointer-events:none"></div><span style="font-size:3.5rem;margin-bottom:16px;display:block">🎬</span><h1 style="font-size:2rem;font-weight:900;letter-spacing:-0.5px;margin-bottom:10px">About <span style="color:var(--red)">CineNova</span></h1><p style="font-size:0.95rem;color:var(--grey);line-height:1.7;max-width:520px;margin:0 auto">Your ultimate destination for movies, web series, and entertainment — free, fast, and always updated.</p></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px"><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:12px;padding:18px 12px;text-align:center"><div style="font-size:1.6rem;font-weight:900;color:var(--red);margin-bottom:4px">5K+</div><div style="font-size:0.72rem;color:var(--grey);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Movies</div></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:12px;padding:18px 12px;text-align:center"><div style="font-size:1.6rem;font-weight:900;color:var(--red);margin-bottom:4px">500+</div><div style="font-size:0.72rem;color:var(--grey);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Web Series</div></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:12px;padding:18px 12px;text-align:center"><div style="font-size:1.6rem;font-weight:900;color:var(--red);margin-bottom:4px">Daily</div><div style="font-size:0.72rem;color:var(--grey);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Updates</div></div></div>'
    + '<div style="background:var(--card);border:1px solid #1e1e1e;border-radius:16px;padding:22px;margin-bottom:14px"><h2 style="font-size:1rem;font-weight:800;margin-bottom:10px">▶ How to Watch</h2><p style="font-size:0.88rem;color:#bbb;line-height:1.7">1) Open any movie poster.<br>2) Tap <b style="color:#fff">Watch Now</b>.<br>3) Play full screen on-site — no extra apps.</p></div>'+ '<div style="background:var(--card);border:1px solid #1e1e1e;border-radius:16px;padding:22px;margin-bottom:14px"><h2 style="font-size:1rem;font-weight:800;margin-bottom:10px">⬇ Fast Download (1080p)</h2><p style="font-size:0.88rem;color:#bbb;line-height:1.7">Every title has a direct <b style="color:#fff">1080p Fast Download</b> link — secure, no fake buttons, no redirect spam.</p></div>'+ '<div style="background:var(--card);border:1px solid #1e1e1e;border-radius:16px;padding:22px;margin-bottom:14px"><h2 style="font-size:1rem;font-weight:800;margin-bottom:10px">📬 Request a Movie</h2><p style="font-size:0.88rem;color:#bbb;line-height:1.7">Title missing? Request from home or Contact page — we upload regularly based on user requests.</p></div>'
    + '<div style="background:var(--card);border:1px solid #1e1e1e;border-radius:16px;padding:24px;margin-bottom:16px"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><div style="width:42px;height:42px;border-radius:12px;background:rgba(229,9,20,0.12);border:1px solid rgba(229,9,20,0.25);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🎯</div><h2 style="font-size:1rem;font-weight:800">Who We Are</h2></div><p style="font-size:0.88rem;color:#bbb;line-height:1.8;margin-bottom:10px">CineNova is a free entertainment platform dedicated to bringing you the latest and greatest in movies, web series, and digital content. We are passionate cinephiles who believe great entertainment should be accessible to everyone.</p><p style="font-size:0.88rem;color:#bbb;line-height:1.8;margin-bottom:10px">Our team works around the clock to curate, organize, and update our library with fresh content — from Hollywood blockbusters and Bollywood hits to Korean dramas and animated gems.</p><div style="display:inline-flex;align-items:center;gap:8px;background:rgba(229,9,20,0.1);border:1px solid rgba(229,9,20,0.25);border-radius:20px;padding:8px 16px;font-size:0.82rem;font-weight:700;color:#ff6b6b;margin-top:10px">❤️ Built with passion by the CineNova Team</div></div>'
    + '<div style="background:var(--card);border:1px solid #1e1e1e;border-radius:16px;padding:24px;margin-bottom:16px"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><div style="width:42px;height:42px;border-radius:12px;background:rgba(229,9,20,0.12);border:1px solid rgba(229,9,20,0.25);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">⚡</div><h2 style="font-size:1rem;font-weight:800">What Makes Us Different</h2></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:10px"><span style="font-size:1.2rem;flex-shrink:0">🌟</span><div><h4 style="font-size:0.82rem;font-weight:700;margin-bottom:3px">HD Quality</h4><p style="font-size:0.76rem;color:var(--grey);line-height:1.5;margin:0">480p, 720p & 1080p</p></div></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:10px"><span style="font-size:1.2rem;flex-shrink:0">🔄</span><div><h4 style="font-size:0.82rem;font-weight:700;margin-bottom:3px">Daily Updates</h4><p style="font-size:0.76rem;color:var(--grey);line-height:1.5;margin:0">New content every day</p></div></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:10px"><span style="font-size:1.2rem;flex-shrink:0">📱</span><div><h4 style="font-size:0.82rem;font-weight:700;margin-bottom:3px">Mobile Friendly</h4><p style="font-size:0.76rem;color:var(--grey);line-height:1.5;margin:0">All devices supported</p></div></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:10px"><span style="font-size:1.2rem;flex-shrink:0">🆓</span><div><h4 style="font-size:0.82rem;font-weight:700;margin-bottom:3px">100% Free</h4><p style="font-size:0.76rem;color:var(--grey);line-height:1.5;margin:0">No subscriptions, always free</p></div></div></div></div>'
    + '<div style="background:var(--card);border:1px solid #1e1e1e;border-radius:16px;padding:24px;margin-bottom:16px"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><div style="width:42px;height:42px;border-radius:12px;background:rgba(229,9,20,0.12);border:1px solid rgba(229,9,20,0.25);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🚀</div><h2 style="font-size:1rem;font-weight:800">Our Mission</h2></div><p style="font-size:0.88rem;color:#bbb;line-height:1.8;margin-bottom:10px">Our mission is simple — to be the most comprehensive, user-friendly, and up-to-date entertainment hub on the internet. We believe that language, geography, or budget should never be a barrier to enjoying great cinema.</p><p style="font-size:0.88rem;color:#bbb;line-height:1.8">We are constantly improving our platform, adding new features, and listening to our community\'s feedback to deliver the best possible experience.</p></div>'
    + '<div style="background:linear-gradient(135deg,#1a0a0a,#111);border:1px solid rgba(229,9,20,0.2);border-radius:16px;padding:28px;text-align:center;margin-bottom:16px"><span style="font-size:2rem;display:block;margin-bottom:12px">📬</span><h2 style="font-size:1.1rem;font-weight:900;margin-bottom:8px">Have Questions or Suggestions?</h2><p style="font-size:0.86rem;color:#888;line-height:1.7;margin-bottom:20px">We love hearing from our community. Reach out to us anytime!</p><a href="/p/contact-us.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--red);color:#fff;padding:11px 24px;border-radius:10px;font-size:0.9rem;font-weight:700">📩 Contact Us</a></div>';
  }

  // ── CONTACT US ──
  else if (path.indexOf('/p/contact-us') !== -1) {
    isStaticPage = true;
    pageContent = '<div style="text-align:center;padding:50px 20px 40px"><span style="font-size:3.5rem;display:block;margin-bottom:16px">📩</span><h1 style="font-size:2rem;font-weight:900;margin-bottom:10px">Contact <span style="color:var(--red)">Us</span></h1><p style="font-size:0.9rem;color:var(--grey);line-height:1.7;max-width:500px;margin:0 auto">Have a question, suggestion, or movie request? We\'d love to hear from you.</p></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px"><div style="background:var(--card);border:1px solid #1e1e1e;border-radius:14px;padding:22px;text-align:center"><span style="font-size:2rem;margin-bottom:12px;display:block">📧</span><h3 style="font-size:0.9rem;font-weight:800;margin-bottom:6px">Email Us</h3><p style="font-size:0.8rem;color:var(--grey);line-height:1.5;margin-bottom:12px">Reply within 24–48 hours</p><a href="mailto:contact@cinenova.site" style="display:inline-flex;align-items:center;gap:6px;background:var(--card2);border:1px solid #2a2a2a;color:#ccc;padding:8px 16px;border-radius:8px;font-size:0.8rem;font-weight:600">✉️ Send Email</a></div><div style="background:var(--card);border:1px solid #1e1e1e;border-radius:14px;padding:22px;text-align:center"><span style="font-size:2rem;margin-bottom:12px;display:block">🎬</span><h3 style="font-size:0.9rem;font-weight:800;margin-bottom:6px">Movie Request</h3><p style="font-size:0.8rem;color:var(--grey);line-height:1.5;margin-bottom:12px">Can\'t find a movie? Request it!</p><a href="/" style="display:inline-flex;align-items:center;gap:6px;background:var(--card2);border:1px solid #2a2a2a;color:#ccc;padding:8px 16px;border-radius:8px;font-size:0.8rem;font-weight:600">📤 Request Now</a></div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px"><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:12px;padding:16px;text-align:center"><span style="font-size:1.4rem;margin-bottom:8px;display:block">⏱️</span><h4 style="font-size:0.78rem;font-weight:700;margin-bottom:4px">Response Time</h4><p style="font-size:0.72rem;color:var(--grey)">24–48 hours</p></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:12px;padding:16px;text-align:center"><span style="font-size:1.4rem;margin-bottom:8px;display:block">🌐</span><h4 style="font-size:0.78rem;font-weight:700;margin-bottom:4px">Languages</h4><p style="font-size:0.72rem;color:var(--grey)">English & Urdu</p></div><div style="background:var(--card2);border:1px solid #1e1e1e;border-radius:12px;padding:16px;text-align:center"><span style="font-size:1.4rem;margin-bottom:8px;display:block">📅</span><h4 style="font-size:0.78rem;font-weight:700;margin-bottom:4px">Support Days</h4><p style="font-size:0.72rem;color:var(--grey)">Mon – Sat</p></div></div>'
    + '<div style="
