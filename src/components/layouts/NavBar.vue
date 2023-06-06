<template>
  <v-toolbar class="navbar" height="85px" color="rgb(255, 226, 203, 0.8)" style="margin-top:30px" data-app>
    <a>
      <img class="img" src="@/assets/MTlogo.png" @click="gotoHome" />
    </a>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-layout column wrap>
      <v-flex xs12>
        <label>
          <b>Company name:</b>
          {{companyname}}
        </label>
      </v-flex>
      <v-flex xs12>
        <label>
          <b>User name:</b>
          {{username}}
        </label>
      </v-flex>
    </v-layout>
    <LogoutBnt />
  </v-toolbar>
</template>

<script>
import LogoutBnt from '@/components/layouts/LogoutBnt.vue'
import MyService from '@/services/MyService.js'

export default {
  name: 'NavBar',
  components: {
    LogoutBnt
  },
  data() {
    return {
      username: MyService.getData().userdto.login,
      companyname: MyService.getData().companydto.name
    }
  },
  methods: {
    gotoHome() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style>
@media screen and (min-width: 1280px) {
  .img {
    width: 300px;
  }
}
@media screen and (max-width: 1270px) {
  .img {
    width: 250px;
  }
}
</style>
