import areaRests from '@/api/api_area.js'

export const namespaced = true

export const state = {
  items: [],
  s_selection: [],
  s_selectionTimeLine: [],
  s_STimeSeachTotal: [],
  compositeArea: []
}

export const getters = {}

export const mutations = {
  GET_ROOTS: (state, items) => {
    state.items = items
  },
  GET_COMPOSITE_AREA: (state, compositeArea) => {
    state.compositeArea = compositeArea
  }
}

export const actions = {
  getroot ({ commit }) {
    areaRests.fetchRoots().then(response => {
      commit('GET_ROOTS', response.data)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
