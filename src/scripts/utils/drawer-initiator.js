const DrawerInitiator = {
  init({ button, drawer, content }) {
    // Validasi elemen
    if (!button || !drawer) {
      console.error('DrawerInitiator: Button or drawer element not found');
      return;
    }

    // Buat overlay backdrop
    this._createOverlay(drawer);

    // Toggle drawer saat button diklik
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      this._toggleDrawer(drawer);
      console.log('Hamburger clicked, drawer toggled');
    });

    // Tutup drawer saat klik link navigasi
    const navLinks = drawer.querySelectorAll('a');
    console.log('Found nav links:', navLinks.length);

    navLinks.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        console.log(`Nav link ${index} clicked:`, link.href);

        // Tutup drawer setelah klik
        setTimeout(() => {
          this._closeDrawer(drawer);
        }, 100);
      });
    });

    // Tutup drawer dengan tombol ESC
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this._closeDrawer(drawer);
      }
    });

    console.log('Drawer initialized ✅');
  },

  _toggleDrawer(drawer) {
    const overlay = document.getElementById('drawer-overlay');
    const button = document.getElementById('hamburgerButton');
    const isOpen = drawer.classList.contains('open');

    if (isOpen) {
      this._closeDrawer(drawer);
    } else {
      drawer.classList.add('open');
      overlay?.classList.add('open');
      button?.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Drawer opened');
    }
  },

  _closeDrawer(drawer) {
    const overlay = document.getElementById('drawer-overlay');
    const button = document.getElementById('hamburgerButton');
    drawer.classList.remove('open');
    overlay?.classList.remove('open');
    button?.classList.remove('active');
    document.body.style.overflow = '';
    console.log('Drawer closed');
  },

  _createOverlay(drawer) {
    // Cek apakah overlay sudah ada
    if (document.getElementById('drawer-overlay')) {
      return;
    }

    // Buat overlay element
    const overlay = document.createElement('div');
    overlay.id = 'drawer-overlay';
    overlay.className = 'drawer-overlay';

    // Tambahkan ke body
    document.body.appendChild(overlay);

    // Event listener untuk menutup drawer saat klik overlay
    overlay.addEventListener('click', () => {
      console.log('Overlay clicked');
      this._closeDrawer(drawer);
    });

    console.log('Overlay created');
  },
};

export default DrawerInitiator;