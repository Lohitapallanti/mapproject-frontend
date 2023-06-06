import apiGlobal from '@/api/api_global.js'
import MyService from '@/services/MyService.js'

// get Children name
function fetchAreaGeomeries (areageometryid) {
  return apiGlobal.post('areageometries/getgeojsonborders', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    areageometrydto: areageometryid
  })
}

export default {
  fetchAreaGeomeries
}
