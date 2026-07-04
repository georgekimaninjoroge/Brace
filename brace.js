(function (window, document) {
  'use strict';

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var config = {
    whatsapp:    script.getAttribute('data-whatsapp')    || '',
    message:     script.getAttribute('data-message')     || 'Hello! I found you online and would like to inquire.',
    ga:          script.getAttribute('data-ga')          || '',
    pixel:       script.getAttribute('data-pixel')       || '',
    emailjs:     script.getAttribute('data-emailjs')     || '',
    emailjsSvc:  script.getAttribute('data-emailjs-service') || '',
    emailjsTpl:  script.getAttribute('data-emailjs-template') || '',
    color:       script.getAttribute('data-color')       || '#25D366',
    position:    script.getAttribute('data-position')    || 'right',
    business:    script.getAttribute('data-business')    || document.title,
    disable:     (script.getAttribute('data-disable')    || '').split(',').map(function(s){ return s.trim(); })
  };

  function isDisabled(mod) {
    return config.disable.indexOf(mod) !== -1;
  }

  /* ─── UTILS ─────────────────────────────────────────────────── */

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    if (cb) s.onload = cb;
    document.head.appendChild(s);
  }

  function injectCSS(css) {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }


  function initSEO() {
    if (isDisabled('seo')) return;

    function ensureMeta(name, content, prop) {
      if (!content) return;
      var attr = prop ? 'property' : 'name';
      var sel = prop
        ? 'meta[property="' + name + '"]'
        : 'meta[name="' + name + '"]';
      var el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      if (!el.getAttribute('content')) el.setAttribute('content', content);
    }

    var title = document.title;
    var desc = (document.querySelector('meta[name="description"]') || {}).content
      || title + ' — serving customers in Kenya.';

    ensureMeta('description', desc);
    ensureMeta('robots', 'index, follow');
    ensureMeta('og:title', title, true);
    ensureMeta('og:description', desc, true);
    ensureMeta('og:type', 'website', true);
    ensureMeta('og:url', window.location.href, true);
    ensureMeta('twitter:card', 'summary');
    ensureMeta('twitter:title', title);
    ensureMeta('twitter:description', desc);


    if (!document.querySelector('link[rel="canonical"]')) {
      var canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = window.location.origin + window.location.pathname;
      document.head.appendChild(canonical);
    }


    if (!document.querySelector('meta[charset]')) {
      var charset = document.createElement('meta');
      charset.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charset, document.head.firstChild);
    }
    if (!document.querySelector('meta[name="viewport"]')) {
      var vp = document.createElement('meta');
      vp.name = 'viewport';
      vp.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(vp);
    }
  }


  function initSpeed() {
    if (isDisabled('speed')) return;


    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(function (img) {
        imgObserver.observe(img);
      });


      document.querySelectorAll('img:not([loading])').forEach(function (img) {
        img.setAttribute('loading', 'lazy');
      });
    }


    var origins = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    origins.forEach(function (o) {
      if (!document.querySelector('link[rel="preconnect"][href="' + o + '"]')) {
        var link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = o;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });


    document.querySelectorAll('script[src]:not([defer]):not([async])').forEach(function (s) {
      s.defer = true;
    });
  }


  function initGA() {
    if (isDisabled('ga') || !config.ga) return;


    function loadGA() {
      if (window._braceGALoaded) return;
      window._braceGALoaded = true;
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + config.ga, function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', config.ga, { anonymize_ip: true });
      });
    }

    ['mousedown', 'touchstart', 'scroll', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, loadGA, { once: true, passive: true });
    });


    setTimeout(loadGA, 4000);
  }


  function initPixel() {
    if (isDisabled('pixel') || !config.pixel) return;

    function loadPixel() {
      if (window._bracePixelLoaded) return;
      window._bracePixelLoaded = true;
      !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', config.pixel);
        window.fbq('track', 'PageView');
    }

    ['mousedown', 'touchstart', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, loadPixel, { once: true, passive: true });
    });
    setTimeout(loadPixel, 5000);
  }


  function initCookie() {
    if (isDisabled('cookie')) return;
    if (localStorage.getItem('brace_cookie_consent')) return;

    onReady(function () {
      injectCSS([
        '#brace-cookie{position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;color:#fff;',
        'padding:14px 20px;display:flex;align-items:center;justify-content:space-between;',
        'flex-wrap:wrap;gap:10px;z-index:99999;font-family:system-ui,sans-serif;font-size:13px;',
        'box-shadow:0 -2px 12px rgba(0,0,0,.3);}',
        '#brace-cookie p{margin:0;flex:1;min-width:200px;}',
        '#brace-cookie a{color:#aaa;text-decoration:underline;}',
        '#brace-cookie button{padding:8px 20px;border:none;border-radius:6px;cursor:pointer;',
        'font-size:13px;font-weight:600;}',
        '#brace-cookie .bc-accept{background:' + config.color + ';color:#fff;}',
        '#brace-cookie .bc-decline{background:transparent;color:#aaa;border:1px solid #555;margin-left:6px;}'
      ].join(''));

      var bar = document.createElement('div');
      bar.id = 'brace-cookie';
      bar.innerHTML = [
        '<p>We use cookies to improve your experience on our site.</p>',
        '<div>',
        '<button class="bc-accept">Accept</button>',
        '<button class="bc-decline">Decline</button>',
        '</div>'
      ].join('');
      document.body.appendChild(bar);

      bar.querySelector('.bc-accept').addEventListener('click', function () {
        localStorage.setItem('brace_cookie_consent', '1');
        bar.remove();
      });
      bar.querySelector('.bc-decline').addEventListener('click', function () {
        localStorage.setItem('brace_cookie_consent', '0');
        bar.remove();
      });
    });
  }


  function initWhatsApp() {
    if (isDisabled('whatsapp') || !config.whatsapp) return;

    onReady(function () {
      var phone = config.whatsapp.replace(/\D/g, '');
      var msg = encodeURIComponent(config.message);
      var side = config.position === 'left' ? 'left:20px' : 'right:20px';
      var color = config.color;

      injectCSS([
        '#brace-wa{position:fixed;bottom:24px;' + side + ';z-index:99998;display:flex;flex-direction:column;align-items:' + (config.position === 'left' ? 'flex-start' : 'flex-end') + ';}',
        '#brace-wa-bubble{background:#fff;border-radius:12px;padding:12px 16px;',
        'box-shadow:0 4px 20px rgba(0,0,0,.15);max-width:220px;margin-bottom:10px;',
        'font-family:system-ui,sans-serif;font-size:13px;line-height:1.4;',
        'animation:braceSlideIn .3s ease;display:none;}',
        '#brace-wa-bubble strong{display:block;font-size:12px;color:#555;margin-bottom:4px;}',
        '#brace-wa-btn{width:56px;height:56px;border-radius:50%;background:' + color + ';',
        'display:flex;align-items:center;justify-content:center;cursor:pointer;',
        'box-shadow:0 4px 16px rgba(37,211,102,.4);transition:transform .2s,box-shadow .2s;}',
        '#brace-wa-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(37,211,102,.5);}',
        '#brace-wa-btn svg{width:28px;height:28px;fill:#fff;}',
        '@keyframes braceSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}'
      ].join(''));

      var wrap = document.createElement('div');
      wrap.id = 'brace-wa';
      wrap.innerHTML = [
        '<div id="brace-wa-bubble">',
        '<strong>' + config.business + '</strong>',
        'Hi there! 👋 Chat with us on WhatsApp.',
        '</div>',
        '<a id="brace-wa-btn" href="https://wa.me/' + phone + '?text=' + msg + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">',
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.118 1.522 5.853L.057 23.882a.75.75 0 0 0 .924.924l6.036-1.463A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.717 9.717 0 0 1-4.983-1.37l-.356-.214-3.697.896.913-3.592-.233-.37A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>',
        '</svg>',
        '</a>'
      ].join('');

      document.body.appendChild(wrap);

      var btn = document.getElementById('brace-wa-btn');
      var bubble = document.getElementById('brace-wa-bubble');


      setTimeout(function () {
        bubble.style.display = 'block';
        setTimeout(function () { bubble.style.display = 'none'; }, 6000);
      }, 3000);

      btn.addEventListener('mouseenter', function () {
        bubble.style.display = 'block';
      });
    });
  }


  function initForms() {
    if (isDisabled('forms')) return;

    onReady(function () {
      var forms = document.querySelectorAll('form[data-brace-form]');
      if (!forms.length) return;


      if (config.emailjs) {
        loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js', function () {
          if (window.emailjs) window.emailjs.init(config.emailjs);
        });
      }

      injectCSS([
        '.brace-form-msg{padding:10px 14px;border-radius:6px;font-size:13px;margin-top:10px;display:none;}',
        '.brace-form-ok{background:#dcfce7;color:#166534;}',
        '.brace-form-err{background:#fee2e2;color:#991b1b;}'
      ].join(''));

      forms.forEach(function (form) {
        var msg = document.createElement('div');
        msg.className = 'brace-form-msg';
        form.appendChild(msg);

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var btn = form.querySelector('[type="submit"]');
          var original = btn ? btn.textContent : '';
          if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

          function showMsg(text, ok) {
            msg.textContent = text;
            msg.className = 'brace-form-msg ' + (ok ? 'brace-form-ok' : 'brace-form-err');
            msg.style.display = 'block';
            if (btn) { btn.textContent = original; btn.disabled = false; }
          }

          if (config.emailjs && config.emailjsSvc && config.emailjsTpl && window.emailjs) {
            window.emailjs.sendForm(config.emailjsSvc, config.emailjsTpl, form)
              .then(function () { showMsg('Message sent! We\'ll be in touch soon.', true); form.reset(); })
              .catch(function () { showMsg('Something went wrong. Please try again.', false); });
          } else {

            var data = new FormData(form);
            var body = [];
            data.forEach(function (v, k) { body.push(k + ': ' + v); });
            window.location.href = 'mailto:?subject=Website Enquiry&body=' + encodeURIComponent(body.join('\n'));
            showMsg('Opening your email client…', true);
            if (btn) { btn.textContent = original; btn.disabled = false; }
          }
        });
      });
    });
  }


  function initLinkCheck() {
    if (isDisabled('linkcheck')) return;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      onReady(function () {
        document.querySelectorAll('a[href]').forEach(function (a) {
          if (a.href && a.href.startsWith(window.location.origin)) {
            fetch(a.href, { method: 'HEAD' }).then(function (r) {
              if (!r.ok) {
                a.style.outline = '2px solid red';
                a.title = '[Brace] Broken link: ' + r.status;
              }
            }).catch(function () {});
          }
        });
      });
    }
  }


  initSEO();
  initSpeed();
  initGA();
  initPixel();
  initCookie();
  initWhatsApp();
  initForms();
  initLinkCheck();

}(window, document));