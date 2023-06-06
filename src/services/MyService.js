/* GLOGAL PROPERTIES jest to class, przez co trzeba to zmienic poniewaz
// nie jest supportowana przez wszystkie przegladarki */
export default class MyService {
  static setToken (token) {
    localStorage.setItem('token', token)
  }

  static getToken () {
    return localStorage.getItem('token')
  }

  static setData (data) {
    localStorage.setItem('data', JSON.stringify(data))
  }

  static getData () {
    return JSON.parse(localStorage.getItem('data'))
  }

  static setRole (role) {
    localStorage.setItem('role', JSON.stringify(role))
  }

  static getRole () {
    return JSON.parse(localStorage.getItem('role'))
  }
}
/*   static setType (types_id) {
    this.task_type = types_id
  }

  static getType () {
    return this.task_type
  }

static resetStore () {
      localStorage.d
  }
  task_type = undefined; */
