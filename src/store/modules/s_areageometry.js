import geometryRests from '@/api/api_geometry.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  areageometry: []
}

export const getters = {}

export const mutations = {
  GET_AREA_GEOMETRY: (state, areageometry) => {
    state.areageometry = areageometry

    EventBus.$emit('clicked-getareageometry', areageometry)
  }
}

export const actions = {
  get_area_geometry ({ commit }, allParams) {
    geometryRests.fetchAreaGeomeries({
      id: allParams.id
    }).then(response => { commit('GET_AREA_GEOMETRY', response.data) })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
