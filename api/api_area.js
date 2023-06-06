import apiGlobal from '@/api/api_global.js'
import MyService from '@/services/MyService.js'
let officialAreaType = 1

// get roots/countries
function fetchRoots () {
  return apiGlobal.post('areas/getroots', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    areadto: {
      areatypeid: officialAreaType
    }
  })
}

// get Child area
function fetchChildren (areaid) {
  return apiGlobal.post('areas/getchildren', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    areadto: {
      id: areaid,
      areatypeid: officialAreaType
    }
  })
}

// get composite area
function fetchCompositeArea (categoryid) {
  return apiGlobal.post('datasets/getallfullbyuserandcategory', {
    tokendto: {
      token: MyService.getData().tokendto.token
    },
    datasetdto: {
      datasetcategoryid: categoryid
    }
  })
}
export default {
  fetchRoots,
  fetchChildren,
  fetchCompositeArea
}
