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

    // JANGAN tutup drawer saat klik content di desktop
    // Hanya untuk mobile yang perlu auto-close
    
    // Tutup drawer saat klik link navigasi (PENTING!)
    const navLinks = drawer.querySelectorAll('a');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        // JANGAN preventDefault! Biarkan navigasi berjalan normal
        console.log(`Nav link ${index} clicked:`, link.href);
        
        // Tutup drawer setelah klik
        setTimeout(() => {
          this._closeDrawer(drawer);
        }, 100); // Delay sedikit agar hash berubah dulu
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
    const isActive = drawer.classList.contains('active');
    
    if (isActive) {
      this._closeDrawer(drawer);
    } else {
      drawer.classList.add('active');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Drawer opened');
    }
  },

  _closeDrawer(drawer) {
    const overlay = document.getElementById('drawer-overlay');
    drawer.classList.remove('active');
    overlay?.classList.remove('active');
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