import areaRests from '@/api/api_search.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  timeLineSearchResult: [],
  timeLinesearchtimes: [],
  timeLinesearchdate: '',
  timeLinesearcharea: ''
}

export const getters = {}

export const mutations = {
  GET_TIMELINESEARCH_RESULT: (state, timeLineSearchResult) => {
    state.timeLineSearchResult = timeLineSearchResult

    EventBus.$emit('clicked-event_TimeLineSearch', timeLineSearchResult)
  }
}

export const actions = {
  get_timelinesearch_result ({ commit }, allParams) {
    areaRests
      .timelinesearch({
        from: [allParams.fromAreaId],
        to: allParams.toAreaId,
        timerange: allParams.date
      })
      .then(response => {
        commit('GET_TIMELINESEARCH_RESULT', response.data.timelines)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
