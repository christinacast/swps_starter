import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue'; // Home page
import MapsPage from '@/pages/MapsPage.vue'; // maps page
import CalendarPage from '@/pages/CalendarPage.vue'; // calendar page
import ProfilePage from '@/pages/ProfilePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/maps', name: 'MapsPage', component: MapsPage },
    { path: '/calendar', name: 'CalendarPage', component: CalendarPage },
    { path: '/profile', name: 'Profile', component: ProfilePage },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/register', name: 'Register', component: RegisterPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
