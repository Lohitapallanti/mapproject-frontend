import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import DashboardPage from './views/DashboardPage.vue'
import MunicipalAnalyticsPage from './views/MunicipalAnalyticsPage.vue'
import ErrorPage from './views/ErrorPage.vue'
import MapPage from './views/MapPage.vue'
import RoadPlanerAnalyticsPage from '@/views/RoadPlanerAnalyticsPage.vue'
import BuisnessAnalyticsPage from '@/views/BuisnessAnalyticsPage.vue'
import TurismAnalyticsPage from '@/views/TurismAnalyticsPage.vue'
import EnterpreneurAnalyticsPage from '@/views/EnterpreneurAnalyticsPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage
    },
    {
      path: '/municipalanalytics',
      name: 'MunicipalAnalytics',
      component: MunicipalAnalyticsPage
    },
    {
      path: '/mappage',
      name: 'MapPage',
      component: MapPage
    },
    {
      path: '/errorPage',
      name: 'error',
      component: ErrorPage
    },
    {
      path: '/roadanalytics',
      name: 'RoadPlanerAnalyticsPage',
      component: RoadPlanerAnalyticsPage
    },
    {
      path: '/buisnessanalytics',
      name: 'BuisnessAnalyticsPage',
      component: BuisnessAnalyticsPage
    },
    {
      path: '/turismanalytics',
      name: 'TurismAnalyticsPage',
      component: TurismAnalyticsPage
    },
    {
      path: '/enterpreneurnalytics',
      name: 'EnterpreneurAnalyticsPage',
      component: EnterpreneurAnalyticsPage
    }
  ]
})
