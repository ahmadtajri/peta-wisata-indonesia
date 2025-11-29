const DrawerInitiator = {
  init({ button, drawer, content }) {
    console.log('🚀 DrawerInitiator.init called');
    console.log('📍 Button:', button);
    console.log('📍 Drawer:', drawer);
    console.log('📍 Content:', content);

    // Validasi elemen
    if (!button || !drawer) {
      console.error('❌ DrawerInitiator: Button or drawer element not found');
      console.error('Button exists:', !!button);
      console.error('Drawer exists:', !!drawer);
      return;
    }

    // Buat overlay backdrop
    this._createOverlay(drawer);

    // Toggle drawer saat button diklik
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._toggleDrawer(drawer);
      console.log('🍔 Hamburger clicked, drawer toggled');
    });

    // IMPORTANT: Use event delegation for dynamically added links
    // Attach listener to drawer itself, not individual links
    drawer.addEventListener('click', (event) => {
      // Find closest anchor tag
      const link = event.target.closest('a[data-link]');

      if (link) {
        console.log('🔗 Link clicked:', link.href);
        console.log('🔗 Link text:', link.textContent);

        // Special handling for logout
        if (link.id === 'logout-btn') {
          console.log('🚪 Logout button clicked');
          // Let the main logout handler deal with it
          this._closeDrawer(drawer);
          return;
        }

        // For navigation links, close drawer
        // Don't preventDefault - let navigation happen
        console.log('🎯 Closing drawer for navigation');
        this._closeDrawer(drawer);
      }
    });

    console.log('📱 Event delegation set up on drawer');

    // Tutup drawer saat hash berubah (route change) - BACKUP
    window.addEventListener('hashchange', () => {
      console.log('🔄 Hash changed, closing drawer');
      this._closeDrawer(drawer);
    });

    // Tutup drawer dengan tombol ESC
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        console.log('⌨️ ESC pressed, closing drawer');
        this._closeDrawer(drawer);
      }
    });

    console.log('✅ Drawer initialized successfully');
  },

  _toggleDrawer(drawer) {
    const isOpen = drawer.classList.contains('open');
    console.log('🔀 Toggle drawer, currently open:', isOpen);

    if (isOpen) {
      this._closeDrawer(drawer);
    } else {
      this._openDrawer(drawer);
    }
  },

  _openDrawer(drawer) {
    const overlay = document.getElementById('drawer-overlay');
    const button = document.getElementById('hamburgerButton');

    console.log('📂 Opening drawer...');
    console.log('  - Overlay found:', !!overlay);
    console.log('  - Button found:', !!button);

    drawer.classList.add('open');
    overlay?.classList.add('open');
    button?.classList.add('active');
    document.body.style.overflow = 'hidden';

    console.log('✅ Drawer opened');
  },

  _closeDrawer(drawer) {
    const overlay = document.getElementById('drawer-overlay');
    const button = document.getElementById('hamburgerButton');

    console.log('📁 Closing drawer...');

    drawer.classList.remove('open');
    overlay?.classList.remove('open');
    button?.classList.remove('active');
    document.body.style.overflow = '';

    console.log('✅ Drawer closed');
  },

  _createOverlay(drawer) {
    console.log('🎨 Creating overlay...');

    // Cek apakah overlay sudah ada
    if (document.getElementById('drawer-overlay')) {
      console.log('ℹ️ Overlay already exists');
      return;
    }

    // Buat overlay element
    const overlay = document.createElement('div');
    overlay.id = 'drawer-overlay';
    overlay.className = 'drawer-overlay';

    // Tambahkan ke body
    document.body.appendChild(overlay);

    // Event listener untuk menutup drawer saat klik overlay
    overlay.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('🎯 Overlay clicked');
      this._closeDrawer(drawer);
    });

    console.log('✨ Overlay created and event listener attached');
  },
};

export default DrawerInitiator;