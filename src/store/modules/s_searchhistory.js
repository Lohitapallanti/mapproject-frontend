import SearchesRests from '@/api/api_searchhistory.js'
import { EventBus } from '@/event-bus.js'

export const namespaced = true

export const state = {
  bookmarkResult: [],
  searchHistoryResult: []
}

export const getters = {}

export const mutations = {
  CREATE_BOOKMARK: (state, bookmarkResult) => {
    state.bookmarkResult = bookmarkResult
    console.log('bookmarkResult:', bookmarkResult)
    // after creating bookmark, emit to History component to show this data in user past search dropdown.
    EventBus.$emit('created_History_event', bookmarkResult)
  },
  CREATE_SEARCHHISTORY: (state, searchHistoryResult) => {
    state.searchHistoryResult = searchHistoryResult
    // after creating history, emit to History component to show this data also.
    EventBus.$emit('created_History_event', searchHistoryResult)
  }
}

export const actions = {
  create_Bookmark ({ commit }, allParams) {
    SearchesRests.createSearchHistory({
      bookmark: true,
      bookmarkname: allParams.Bookmarkname,
      searchrequest: JSON.stringify(allParams.SearchRequest),
      restserviceid: allParams.restserviceid
    }).then(response => {
      commit('CREATE_BOOKMARK', response.data)
    })
  },
  create_SearchHistory ({ commit }, allParams) {
    SearchesRests.createSearchHistory({
      bookmark: false,
      bookmarkname: allParams.Bookmarkname,
      searchrequest: JSON.stringify(allParams.SearchRequest),
      restserviceid: allParams.restserviceid
    }).then(response => {
      commit('CREATE_SEARCHHISTORY', response.data)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
