//Import Router
import { createRouter, createWebHistory } from 'vue-router';

// Import user views 
import CartPage from '../views/CartPage.vue';
import ProductDetailPage from '../views/ProductDetailPage.vue';
import ProductsPage from '../views/ProductsPage.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import WelcomePage from '../views/WelcomePage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import SettingsPage from '../views/SettingsPage.vue';
import CheckoutPage from '../views/CheckoutPage.vue';

//Import admin views
import AdminPage from '../views/admin/AdminPage.vue';

const routes = [
  {
    path: '/products',
    name: 'Products',
    component: ProductsPage,
  },
  {
    path: '/products/:productID',
    name: 'ProductDetail',
    component: ProductDetailPage,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsPage
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminPage
  },
  {
    path: "/checkout",
    name: "CheckoutPage",
    component: CheckoutPage
  },
  {
    path: '/:pathMatch(.*)*', // Updated catch-all route
    component: NotFoundPage,
  },
];

//Initialise a new router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
