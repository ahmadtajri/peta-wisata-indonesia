import DrawerInitiator from '../utils/drawer-initiator.js';
import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initAppShell();
  }

  _initAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];

    console.log('🔍 Current URL:', window.location.hash);
    console.log('🔍 Parsed URL:', url);
    console.log('🔍 Found page:', !!page);

    if (!page) {
      console.error('❌ Page not found for URL:', url);
      this._content.innerHTML = '<h1>Halaman tidak ditemukan 😢</h1>';
      return;
    }

    console.log('✅ Rendering page for:', url);

    // 🎬 VIEW TRANSITION API
    if ('startViewTransition' in document) {
      console.log('🎬 Using View Transition API');
      
      document.startViewTransition(async () => {
        this._content.innerHTML = await page.render();
        await page.afterRender?.();
        console.log('✅ Page rendered successfully');
      });
    } else {
      console.warn('⚠️ View Transition API not supported');
      this._content.innerHTML = await page.render();
      await page.afterRender?.();
      console.log('✅ Page rendered successfully (fallback)');
    }
  }
}

export default App;