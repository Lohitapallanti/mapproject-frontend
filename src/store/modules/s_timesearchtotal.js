import areaRests from '@/api/api_search.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  timeSearchTotalResult: [],
  timesearchtotaldates: []
}

export const getters = {}

export const mutations = {
  GET_TIMESEARCHTOTAL_RESULT: (state, timeSearchTotalResult) => {
    state.timeSearchTotalResult = timeSearchTotalResult
    EventBus.$emit('timesearchtotal_event', timeSearchTotalResult)
  }
}

export const actions = {
  get_timesearchtotal_result ({ commit }, allParams) {
    // console.log('s_timesearchtotal allParams', allParams)
    areaRests
      .timesearchtotal({
        from: allParams.fromAreaId,
        to: [allParams.toAreaId],
        dates: allParams.date
      })
      .then(response => {
        commit('GET_TIMESEARCHTOTAL_RESULT', response.data.areas)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
