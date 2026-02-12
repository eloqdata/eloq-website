module.exports = [
    {
        tagName: 'script',
        attributes: {
            type: 'text/javascript',
        },
        innerHTML: `if (typeof window !== 'undefined' && !window.gtag) { window.gtag = function() { (window.gtag.q = window.gtag.q || []).push(arguments); }; window.gtag.l = +new Date(); }`,
    },
    {
        tagName: 'script',
        attributes: {
            type: 'text/javascript',
        },
        innerHTML: `
        (function() {
          function forceDarkTheme() {
            if (typeof window === 'undefined') return;
            var path = window.location.pathname;
            var isWhiteAllowed = /^\\/(docs|blog|news|eloqkv|eloqdoc|eloqsql|eloqcloud|operator)/i.test(path);
            if (!isWhiteAllowed && document.documentElement.getAttribute('data-theme') === 'light') {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          }

          forceDarkTheme();

          // Use a single observer for efficiency
          var observer = new MutationObserver(function() {
            forceDarkTheme();
          });

          // Watch for theme changes on html and route changes that affect head (title/meta)
          if (document.documentElement) {
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
          }
          if (document.head) {
            observer.observe(document.head, { childList: true, subtree: true });
          }

          // Re-check on every interaction to catch any SPA edge cases
          window.addEventListener('click', function() {
            setTimeout(forceDarkTheme, 100);
          });

          // Fail-safe
          setInterval(forceDarkTheme, 1000);
        })();
      `,
    },
];
