import apiGlobal from '@/api/api_global.js'
import MyService from '@/services/MyService.js'

// get time search
function timesearch (data) {
  return apiGlobal.post('visitors/searchbyareastoareasfromtwodatesonetime', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    searchrequestdto: data
  })
}

// get dwelltime search
function dwelltimesearch (data) {
  return apiGlobal.post('dwells/searchbyareatodates', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    searchrequestdto: data
  })
}

// get timeline search
function timelinesearch (data) {
  return apiGlobal.post('timelines/searchbyareafromareastodaterange', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    searchrequestdto: data
  })
}

// get timesearchtotal
function timesearchtotal (data) {
  return apiGlobal.post('visitors/searchbyareasfromareastodates', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    searchrequestdto: data
  })
}
export default {
  timesearch,
  dwelltimesearch,
  timelinesearch,
  timesearchtotal
}
