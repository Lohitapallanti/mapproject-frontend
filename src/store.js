import Vue from 'vue'
import Vuex from 'vuex'
import * as area from '@/store/modules/s_areatree.js'
import * as timesearch from '@/store/modules/s_timesearch.js'
import * as areageometry from '@/store/modules/s_areageometry.js'
import * as dwelltimesearch from '@/store/modules/s_dwelltimesearch.js'
import * as timelinesearch from '@/store/modules/s_timelinesearch.js'
import * as timesearchtotal from '@/store/modules/s_timesearchtotal.js'
import * as timelinesearchoverview from '@/store/modules/s_timelinesearchoverview.js'
import * as searchhistory from '@/store/modules/s_searchhistory.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    area,
    timesearch,
    areageometry,
    dwelltimesearch,
    timelinesearch,
    timesearchtotal,
    timelinesearchoverview,
    searchhistory
  }
})
