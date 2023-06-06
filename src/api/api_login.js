import apiGlobal from '@/api/api_global.js'

function fetchUsers (data) { return apiGlobal.post('users/login', data) }
function logoutToken (data) { return apiGlobal.post('users/logout', data) }
export default {
  fetchUsers,
  logoutToken
}
