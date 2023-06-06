import areaRests from '@/api/api_search.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  timeSearchResult: [],
  timesearchdate1: '',
  timesearchdate2: '',
  timesearchtime: ''
}

export const getters = {}

export const mutations = {
  GET_TIMESEARCH_RESULT: (state, timeSearchResult) => {
    state.timeSearchResult = timeSearchResult
    EventBus.$emit('clicked-event', timeSearchResult)
  }
}

export const actions = {
  get_timesearch_result ({ commit }, allParams) {
    areaRests
      .timesearch({
        from: allParams.fromAreaId,
        to: [allParams.toAreaId],
        dates: [
          allParams.date,
          allParams.date1
        ]
      })
      .then(response => {
        commit('GET_TIMESEARCH_RESULT', response.data.areas)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
