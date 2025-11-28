import HomePage from '../pages/home/home-page.js';
import AboutPage from '../pages/about/about-page.js';
import LoginPage from '../pages/auth/login-page.js';
import RegisterPage from '../pages/auth/register-page.js';
import AddStoryPage from '../pages/story/add-story-page.js';
import DetailStoryPage from '../pages/story/detail-story-page.js';
import FavoritesPage from '../pages/favorites/favorites-page.js';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/about': AboutPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add-story': AddStoryPage,
  '/story/:id': DetailStoryPage,
  '/favorites': FavoritesPage,
};

export default routes;

