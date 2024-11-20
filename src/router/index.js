import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue'; // Home page
import MapsPage from '@/pages/MapsPage.vue'; // maps page
import ProfilPage from '@/pages/ProfilPage.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/maps', name: 'Maps', component: MapsPage },
    { path: '/profil', name: 'Profil', component: ProfilPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;