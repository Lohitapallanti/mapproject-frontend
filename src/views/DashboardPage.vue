<template>
<v-app>
  <v-content class="dashboard-class">
    <NavBar v-slot:subtitle></NavBar>

    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-flex xs12 md2>
                <clock class="elevation-6"></clock>
              </v-flex>

              <v-layout row wrap justify-space-between>
                <v-flex xs12 md2 class="pt-5">
                  <v-date-picker
                    class="elevation-3"
                    no-title
                    color="rgb(255, 226, 203)"
                    :min="nowDate"
                    dark
                    disabled
                    prev-icon
                    width="210px"
                  ></v-date-picker>
                </v-flex>

                <v-flex class="pt-5" xs12 md12 lg7 xl8 @dblclick="gotoMap">
                  <div class="elevation-3" id="map1"></div>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 md6>
              <v-card-text>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <a>
                      <img
                        id="municipal_style"
                        class="elevation-6"
                        src="@/assets/MunicipalLogo.png"
                        v-on:click="gotoMunicipalAnalytics"
                        v-on="on"
                      />
                    </a>
                  </template>
                  <span>MUNICIPAL - ANALYTICS</span>
                </v-tooltip>
              </v-card-text>

              <v-layout row wrap>
                <v-flex xs12 md6>
                  <v-card-text>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <a>
                          <img
                            id="road_style"
                            class="elevation-6"
                            src="@/assets/RoadplannerLogo.png"
                            v-on="on"
                            @click="gotoRoadAnalytics"
                          />
                        </a>
                      </template>
                      <span>ROAD PLANNER - ANALYTICS</span>
                    </v-tooltip>
                  </v-card-text>
                </v-flex>

                <v-flex xs12 md6>
                  <v-card-text left>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <a>
                          <img
                            id="buisness_style"
                            class="elevation-6"
                            src="@/assets/BusinessLogo.png"
                            @click="gotoBuisnessAnalytics"
                            v-on="on"
                          />
                        </a>
                      </template>
                      <span>BUSINESS - ANALYTICS</span>
                    </v-tooltip>
                  </v-card-text>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 md6 class="justify-center">
                  <v-card-text>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <a>
                          <img
                            id="enter_style"
                            class="elevation-6"
                            src="@/assets/EnterpreneurLogo.png"
                            @click="gotoEnterpreneurAnalytics"
                            v-on="on"
                          />
                        </a>
                      </template>
                      <span>ENTERPRENEUR - ANALYTICS</span>
                    </v-tooltip>
                  </v-card-text>
                </v-flex>

                <v-flex xs12 md6>
                  <v-card-text>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <a>
                          <img
                            id="turism_style"
                            class="elevation-6"
                            src="@/assets/TourismLogo.png"
                            @click="gotoTurismAnalytics"
                            v-on="on"
                          />
                        </a>
                      </template>
                      <span>TOURIST - ANALYTICS</span>
                    </v-tooltip>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </body>
    </html>
  </v-content>
</v-app>
</template>

<script>
import NavBar from '@/components/layouts/NavBar.vue'
import Clock from 'vue-clock2'

export default {
  name: 'DashboardPage',
  components: {
    NavBar,
    Clock
  },
  data() {
    return {
      nowDate: new Date().toISOString().slice(0, 10),
      date: new Date()
    }
  },

  mounted() {
    this.initmap()
  },

  methods: {
    gotoMap() {
      this.$router.push({ path: '/mappage' })
    },
    gotoMunicipalAnalytics() {
      this.$router.push({ path: '/municipalanalytics' })
    },
    gotoBuisnessAnalytics() {
      this.$router.push({ path: '/buisnessanalytics' })
    },
    gotoRoadAnalytics() {
      this.$router.push({ path: '/roadanalytics' })
    },
    gotoTurismAnalytics() {
      this.$router.push({ path: '/turismanalytics' })
    },
    gotoEnterpreneurAnalytics() {
      this.$router.push({ path: '/enterpreneurnalytics' })
    },

    initmap() {
      const map = new google.maps.Map(document.getElementById('map1'), {
        zoom: 11,
        center: { lat: 58.970139, lng: 5.73311 }
      })
      let trafficLayer = new google.maps.TrafficLayer()
      trafficLayer.setMap(map)
    }
  }
}
</script>

<style>
#municipal_style {
  border-radius: 50%;
  background-color: #cea48e;
}
#road_style {
  border-radius: 50%;
  background-color: #4a7177;
}
#enter_style {
  border-radius: 50%;
  background-color: #fff0c0;
}
#turism_style {
  border-radius: 50%;
  background-color: #027064;
}
#buisness_style {
  border-radius: 50%;
  background-color: #09546f;
}
@media screen and (min-width: 2000px) {
  img {
    width: 300px;
  }
}
@media screen and (max-width: 2000px) {
  img {
    width: 180px;
  }
}
.dashboard-class {
  background-color: #8b9b9e;
  background-size: cover;
  overflow: hidden;
}
#map1 {
    height: 305px;
  }
</style>
