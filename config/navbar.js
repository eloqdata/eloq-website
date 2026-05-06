module.exports = {
  title: 'EloqData',
  logo: {
    src: 'img/eloqdata_logo.png',
    alt: 'EloqData',
    style: { width: '150px', height: 'auto' },
  },
  items: [
    // GitHub icon
    {
      href: 'https://github.com/eloqdata',
      position: 'right',
      className: 'header-github-link',
      'aria-label': 'GitHub repository',
    },
    // Theme switch placeholder (replaced by CSS)
    {
      type: 'html',
      value: '<div class="theme-switch-wrapper"></div>',
      position: 'right',
    },
    // Log In link
    {
      href: 'https://cloud.eloqdata.com/login',
      position: 'right',
      className: 'header-login-link',
      label: 'Log In',
    },
    // Sign Up button with orange background
    {
      href: 'https://cloud.eloqdata.com/signup',
      position: 'right',
      className: 'header-signup-link',
      label: 'Sign Up',
    },
    // Main navigation items
    {
      type: 'dropdown',
      label: 'Product',
      position: 'left',
      items: [
        {
          type: 'html',
          value: `
            <a href="/product/eloqkv" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <rect x="6" y="8" width="8" height="16" rx="1" fill="var(--navbar-dropdown-title-color)" />
                  <rect x="18" y="8" width="8" height="16" rx="1" fill="var(--navbar-dropdown-title-color)" />
                  <rect x="14" y="15" width="4" height="2" fill="var(--navbar-dropdown-title-color)" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqKV</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Redis API compatible, transactional, auto tiering</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/product/eloqdoc" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M10 8h8l4 4v12H10V8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M18 8v4h4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M12 14h8M12 18h8M12 22h5" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqDoc</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">MongoDB compatible, decouple compute & storage</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/product/eloqsql" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <ellipse cx="16" cy="10" rx="8" ry="3" fill="var(--navbar-dropdown-title-color)" />
                  <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqSQL</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">MySQL API compatible, high perfromance, elastic</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/product/eloqconvergeddb" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 340px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 8v16h16V8H8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M8 14h16" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                  <path d="M14 8v16" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                  <circle cx="19" cy="19" r="3" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqConvergedDB</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Multi model AI native database</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="https://cloud.eloqdata.com/signup" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 340px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 18.5C8 16 10 14 12.5 14c.5-2.5 2.7-4.5 5.5-4.5 3 0 5.4 2.4 5.5 5.4 1.8.3 3 1.8 3 3.6 0 2-1.5 3.5-3.5 3.5h-12C9.5 22 8 20.5 8 18.5z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none"/>
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqCloud</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Get Started for Free</span>
                </div>
              </div>
            </a>
          `,
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Docs',
      position: 'left',
      items: [
        {
          type: 'html',
          value: `
            <a href="/eloqkv/install-from-binary" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <rect x="6" y="8" width="8" height="16" rx="1" fill="var(--navbar-dropdown-title-color)" />
                  <rect x="18" y="8" width="8" height="16" rx="1" fill="var(--navbar-dropdown-title-color)" />
                  <rect x="14" y="15" width="4" height="2" fill="var(--navbar-dropdown-title-color)" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqKV</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Introduction, quick start</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/eloqdoc/install-from-binary" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M10 8h8l4 4v12H10V8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M18 8v4h4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M12 14h8M12 18h8M12 22h5" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqDoc</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Quick start</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/eloqsql/introduction" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <ellipse cx="16" cy="10" rx="8" ry="3" fill="var(--navbar-dropdown-title-color)" />
                  <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqSQL</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Deploy cluster, data migration</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/eloqcloud/quick-start" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 18.5C8 16 10 14 12.5 14c.5-2.5 2.7-4.5 5.5-4.5 3 0 5.4 2.4 5.5 5.4 1.8.3 3 1.8 3 3.6 0 2-1.5 3.5-3.5 3.5h-12C9.5 22 8 20.5 8 18.5z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none"/>
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqCloud</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Quick start guide</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/operator/introduction" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <rect x="10" y="11" width="12" height="9" rx="2" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <circle cx="13" cy="15.5" r="1.5" fill="var(--navbar-dropdown-title-color)" />
                  <circle cx="19" cy="15.5" r="1.5" fill="var(--navbar-dropdown-title-color)" />
                  <path d="M16 11V8M13 8h6" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" stroke-linecap="round" />
                  <path d="M12 20v4M16 20v4M20 20v4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" stroke-linecap="round" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">Eloq Operator</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Deploy on Kubernetes</span>
                </div>
              </div>
            </a>
          `,
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Learn',
      position: 'left',
      items: [
        {
          type: 'html',
          value: `
            <a href="/blog" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 8h16v4H8zM8 14h16v2H8zM8 18h12v2H8z" fill="var(--navbar-dropdown-title-color)" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">Blog</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Insights from EloqData</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/news" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M24 8H8v16h16V8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M12 12h8M12 16h8M12 20h4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">News</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Get latest updates</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/post" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 8h16v4H8zM8 14h16v2H8zM8 18h10v2H8z" fill="var(--navbar-dropdown-title-color)" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">Articles</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Long-form guides (not the blog)</span>
                </div>
              </div>
            </a>
          `,
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Pricing',
      position: 'left',
      items: [
        {
          to: '/pricing',
          label: 'Cloud Pricing',
        },
        {
          to: '/costsaving',
          label: 'Cost Saving Calculator',
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Download',
      position: 'left',
      items: [
        {
          type: 'html',
          value: `
            <a href="/download" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <ellipse cx="16" cy="10" rx="8" ry="3" fill="var(--navbar-dropdown-title-color)" />
                  <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">Eloq Database</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Download EloqKV, EloqDoc and EloqSQL</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/downloadeloqctl" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 16a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M16 12v8M12 16h8" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">EloqCtl</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">One stop cluster deployment and management tool</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/downloadwhitepaper" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M10 8h8l4 4v12H10V8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M18 8v4h4" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M12 14h8M12 18h8M12 22h5" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">Whitepaper</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Download EloqKV on EloqStore PDF</span>
                </div>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/product-comparison" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); min-width: 320px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 8h16v16H8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M8 12h16M8 16h16M8 20h12" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0 0 4px 0;">Product Comparison</span>
                  <span style="font-size: 14px; color: var(--navbar-dropdown-subtitle-color);">Open Source vs Enterprise vs Cloud</span>
                </div>
              </div>
            </a>
          `,
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Company',
      position: 'left',
      items: [
        {
          type: 'html',
          value: `
            <a href="/aboutus" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); border-bottom: 1px solid var(--navbar-dropdown-border); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M16 8c-4.4 0-8 3.6-8 8v8h16v-8c0-4.4-3.6-8-8-8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <circle cx="16" cy="12" r="2" fill="var(--navbar-dropdown-title-color)" />
                </svg>
                <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0;">About Us</span>
              </div>
            </a>
          `,
        },
        {
          type: 'html',
          value: `
            <a href="/contact" style="display: block; padding: 16px 20px; text-decoration: none; background-color: var(--navbar-dropdown-bg); min-width: 240px;">
              <div style="display: flex; align-items: center;">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--navbar-dropdown-icon-bg)" />
                  <path d="M8 10h16v12H8z" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                  <path d="M8 10l8 6 8-6" stroke="var(--navbar-dropdown-title-color)" stroke-width="2" fill="none" />
                </svg>
                <span style="font-size: 18px; font-weight: 500; color: var(--navbar-dropdown-title-color); margin: 0;">Contact Us</span>
              </div>
            </a>
          `,
        },
      ],
    },
  ],
};
