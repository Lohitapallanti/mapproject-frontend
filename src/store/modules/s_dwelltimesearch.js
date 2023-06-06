import searchRests from '@/api/api_search.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  dwelltimeResult: [],
  dwelltimesearchdates: [],
  dwellhourslist: []
}

export const getters = {}

export const mutations = {
  GET_DWELLTIME_RESULT: (state, dwelltimeResult) => {
    state.dwelltimeResult = dwelltimeResult
    EventBus.$emit('clicked-event_dwelltime', dwelltimeResult)
  }
}

export const actions = {
  get_dwelltime_result ({ commit }, allParams) {
    searchRests
      .dwelltimesearch({
        dates: allParams.date,
        to: [allParams.AreaId]
      })
      .then(response => {
        commit('GET_DWELLTIME_RESULT', response.data.nationalities)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
