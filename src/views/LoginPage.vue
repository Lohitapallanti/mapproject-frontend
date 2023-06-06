
<template>
  <v-app>
    <v-content class="container-class">
      <v-toolbar
        class="navbar"
        height="85px"
        color="rgb(255, 226, 203, 0.8)"
        style="margin-top:30px"
        data-app
      >
        <img class="img" src="@/assets/MTlogo.png" />
      </v-toolbar>
      <v-container>
        <v-layout align-center justify-start style="margin-top:200px">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" color="rgb(255, 226, 203, 0.9)">
              <v-toolbar color="rgb(0, 184, 217, 0.6)" dark>
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <form autocomplete="on" @submit.prevent="onLogin">
                    <p style="color: red" v-if="errors">
                      <b v-for="error in errors" :key="error">{{ error }}</b>
                    </p>
                    <v-text-field
                      color="#003067"
                      prepend-icon="person"
                      label="User name"
                      v-model="username"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      color="#003067"
                      name="passwordname"
                      label="Password"
                      id="passwordid"
                      v-model="userpassword"
                      type="password"
                      required
                    ></v-text-field>
                    <v-layout>
                      <!--<v-flex  xs7 offset-xs5 offset-md2 offset-lg7>
                      <b><a href="" color="#01b8D9">Forgot Password</a></b>
                      </v-flex>-->
                      <v-flex offset-xs9>
                        <v-btn block dark type="submit" color="#01b8D9" style="font-size : 16px;">
                          <b>Login</b>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import userRests from '@/api/api_login.js'
import MyService from '../services/MyService.js'

export default {
  name: 'LoginPage',
  data () {
    return {
      errors: [],
      username: '',
      userpassword: '',
      usertoken: null
    }
  },
  methods: {
    // LOGIN method
    onLogin () {
      userRests
        .fetchUsers({
          login: this.username,
          password: this.userpassword
        })
        .then(response => {
          MyService.setData(response.data)
          MyService.setToken(response.data.tokendto.token)
          // MyService.setRole(response.data.permissiondto[0])
          const restLoginResponsData = MyService.getData()
          // const token = MyService.getToken()
          /* let mainRole = MyService.getRole().permission
          for (var i = 0; i < restLoginResponsData.permissiondto.length; i++) {
            if (restLoginResponsData.permissiondto[i].permission.main) {
              mainRole = response.data.permissiondto[i].permission;
            }
          }
          if (
            mainRole == null ||
            mainRole == undefined ||
            mainRole.roleid == null ||
            mainRole.roleid == undefined
          ) {
            this.$router.push({ path: '/errorPage' });
            return;
          }
          switch (restLoginResponsData.userid) {
            case 1: {
              this.$router.push({ path: '/dashboardPage' })
              break
            }
            default:
              this.$router.push({ path: '/errorPage' })
          }  */
          console.log('Response data:', restLoginResponsData)
          console.log('Token data:', response.data.tokendto.token)
          this.$router.push({ path: '/dashboard' })
        })
        .catch(error => {
          /* if (!this.userRests) {
            this.errors = []
            this.errors.push('Wrong username or password')
          } */

          this.errors = []
          if (error.response.status === 401) {
            this.errors.push('Wrong username or password')
          } else if (error.response.status === 500) {
            this.errors.push(
              'Network Error. Please check your internet connection'
            )
          } else {
            this.errors.push('Error', error.response.status)
          }
          console.log(error)
        })
    }
  }
}
</script>

<style>
.container-class {
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-image: url('../assets/BackgroundLogin.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

/* @media screen and (min-width: 760px) {
  img {
    width: 300px;
    position: relative;
  }
} */
/* @media screen and (max-width: 760px) {
  img {
    width: 200px;
    position: relative;
  }
} */
</style>
