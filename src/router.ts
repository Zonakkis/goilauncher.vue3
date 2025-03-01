import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from './views/pages/AboutPage.vue'
import ModPage from './views/pages/ModPage.vue'
import MapPage from './views/pages/MapPage.vue'
import SubmitRunPage from './views/pages/SubmitRunPage.vue'
import LeaderboardPage from './views/pages/LeaderboardPage.vue'

const routes = [
    {
        path: '/',
        redirect: '/about'
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage
    },
    {
        path: '/mod',
        name: 'Mod',
        component: ModPage
    },
    {
        path: '/map',
        name: 'Map',
        component: MapPage
    },
    {
        path: '/submitrun',
        name: 'SubmitRun',
        component: SubmitRunPage
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: LeaderboardPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router