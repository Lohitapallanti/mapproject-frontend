// global for Api
import axiosApi from 'axios'

const baseURL = 'https://maptrendsdev.no/maptrends-1.0/webapi/'
// create api function
export default axiosApi.create({
  baseURL
})
