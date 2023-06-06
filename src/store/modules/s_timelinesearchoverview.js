import areaRests from '@/api/api_search.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  timeLineSearchOverviewResult: [],
  timeLineOverviewtimes: [],
  timeLineOverviewdate: '',
  timeLineOverviewarea: ''
}

export const getters = {}

export const mutations = {
  GET_TIMELINEOVERVIEW_RESULT: (state, timeLineSearchOverviewResult) => {
    state.timeLineSearchOverviewResult = timeLineSearchOverviewResult

    EventBus.$emit('clicked-event_timelineoverview', timeLineSearchOverviewResult)
  }
}

export const actions = {
  get_timelineoverview_result ({ commit }, allParams) {
    areaRests
      .timelinesearch({
        from: [allParams.fromAreaId],
        timerange: allParams.date
      })
      .then(response => {
        commit('GET_TIMELINEOVERVIEW_RESULT', response.data.timelines)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
