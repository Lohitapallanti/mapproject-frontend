import apiGlobal from '@/api/api_global.js'
import MyService from '@/services/MyService.js'

// create search history for user
function createSearchHistory (data) {
  return apiGlobal.post('searches/createbyuserid', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    searchdto: data
  })
}

// get search history for user
function getSearchHistory () {
  return apiGlobal.post('searches/getallbyuserid', {
    tokendto: {
      token: MyService.getData().tokendto.token
    }
  })
}

// delete search history for user
function deleteSearchHistory (historyid) {
  return apiGlobal.post('searches/delete', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    searchdto: {
      id: historyid
    }
  })
}

export default {
  createSearchHistory,
  getSearchHistory,
  deleteSearchHistory
}
