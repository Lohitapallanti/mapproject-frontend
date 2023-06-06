<template>
  <v-btn v-on:click="LogOut" type="submit" color="red" dark>LogOut</v-btn>
</template>

<script>
import userRests from '@/api/api_login.js'
import MyService from '@/services/MyService.js'

export default {
  name: 'LogoutBnt',
  data () {
    return {
      usertoken: null
    }
  },
  methods: {
    LogOut () {
      userRests
        .logoutToken({
          tokendto: {
            token: MyService.getData().tokendto.token
          }
        })
        .then(response => {
          this.$router.push({ path: '/' })
          this.token = null
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
</style>
