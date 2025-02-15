// Importiert notwendige Funktionen aus der Vue-Router-Bibliothek
import { createRouter, createWebHistory } from 'vue-router';

// Importiert die Seitenkomponenten
import HomePage from '@/pages/HomePage.vue';
import MapsPage from '@/pages/MapsPage.vue';
import CalendarPage from '@/pages/CalendarPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import ChatPage from '@/pages/ChatPage.vue';
import ForumPage from "@/pages/ForumPage.vue";
import RidesPage from '@/pages/RidesPage.vue';
import ImpressumPage from '@/pages/ImpressumPage.vue';
import TestprojektHinweise from '@/pages/TestprojektHinweise.vue';
import CookiesPage from '@/pages/CookiesPage.vue';
import TransparenzPage from '@/pages/TransparenzPage.vue';
import ViewAllTripsPage from '@/pages/ViewAllTripsPage.vue';

// Definiert die Routen der Anwendung
const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/maps', name: 'MapsPage', component: MapsPage },
    { path: '/calendar', name: 'CalendarPage', component: CalendarPage },
    { path: '/profile', name: 'Profile', component: ProfilePage },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/register', name: 'Register', component: RegisterPage },
    { path: '/forum', name: 'ForumPage', component: ForumPage },
    { path: '/chat', name: 'ChatPage', component: ChatPage },
    { path: '/rides', name: 'Rides', component: RidesPage },
    { path: '/impressum', name: 'Impressum', component: ImpressumPage },
    { path: '/testprojekt-hinweise', name: 'TestprojektHinweise', component: TestprojektHinweise },
    { path: '/cookies', name: 'Cookies', component: CookiesPage },
    { path: '/transparenz', name: 'Transparenz', component: TransparenzPage },
    { path: '/view-all-trips', name: 'ViewAllTrips', component: ViewAllTripsPage },
];

// Erstellt den Router mit SEO-freundlicher WebHistory
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Exportiert den Router für die Verwendung in der Haupt-App
export default router;