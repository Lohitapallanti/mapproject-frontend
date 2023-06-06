<template>
<v-app>
  <v-content class="map-class">
    <NavBar v-slot:subtitle></NavBar>

    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      </head>
      <body id="map1style">
        <div id="map" class="map1style"></div>
        <v-container>
          <v-layout row wrap justify-space-between>
            <v-flex xs2>
              <v-checkbox
                v-model="traffic"
                @change="trafficLayermap()"
                color="primary"
                label="Traffic"
              ></v-checkbox>
            </v-flex>
            <v-flex xs2>
              <v-checkbox
                v-model="transit"
                @change="transitLayermap()"
                color="primary"
                label="Transit"
              ></v-checkbox>
            </v-flex>
            <v-flex>
              <v-checkbox
                v-model="bicycle"
                @change="bicycleLayermap()"
                color="primary"
                label="Bicycle"
              ></v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
      </body>
    </html>
  </v-content>
</v-app>
</template>

<script>
// import { EventBus } from '@/event-bus.js'
import NavBar from '@/components/layouts/NavBar.vue'
export default {
  name: 'MapPage',
  components: {
    NavBar
  },
  data () {
    return {
      map: '',
      traffic: true,
      bicycle: false,
      transit: false,
      trafficLayer: new google.maps.TrafficLayer(),
      transitLayer: new google.maps.TransitLayer(),
      bicycleLayer: new google.maps.BicyclingLayer()
    }
  },
  mounted () {
    this.initmap()
    // this.trafficLayermap()
  },
  methods: {
    initmap () {
      this.map = new google.maps.Map(document.getElementById('map'), {
        // center: { lat: 58.970139, lng: 5.73311 }
        // center: { lat: 58.97158301227925, lng: 5.725714494462636 },
        center: { lat: 58.977722, lng: 5.716285 },
        zoom: 6
      })

      var infoWindow = new google.maps.InfoWindow()

      //  Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }

            infoWindow.setPosition(pos)
            infoWindow.setContent('Location found.')
            infoWindow.open(this.map)
            this.map.setCenter(pos)
          },
          function () {
            handleLocationError(true, infoWindow, this.map.getCenter())
          }
        )
      } else {
        //  Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, this.map.getCenter())
      }

      function handleLocationError (browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos)
        infoWindow.setContent(
          browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : "Error: Your browser doesn't support geolocation."
        )
        infoWindow.open(this.map)
      }

      if (this.traffic === true) {
        this.trafficLayer.setMap(this.map)
      }
    },
    // Traffic Layer map
    trafficLayermap () {
      if (this.traffic === true) {
        this.trafficLayer.setMap(this.map)
      } else {
        // this.initmap()
        this.trafficLayer.setMap(null)
      }
    },
    // Transit Layer map
    transitLayermap () {
      if (this.transit === true) {
        this.transitLayer.setMap(this.map)
      } else {
        this.transitLayer.setMap(null)
      }
    },
    // Bicycle Layer map
    bicycleLayermap () {
      if (this.bicycle === true) {
        this.bicycleLayer.setMap(this.map)
      } else {
        this.bicycleLayer.setMap(null)
      }
    }
  }
}
</script>

<style>
.map-class {
  background-color: #8b9b9e;
  background-size: auto;
  overflow: hidden;
}

@media screen and (min-width: 1280px) {
  #map1style {
  height: 80%;
}
}
@media screen and (min-width: 1440px) {
  #map1style {
  height: 90%;
}
}
@media screen and (min-width: 1920px) {
  #map1style {
  height: 95%;
}
}
@media screen and (min-width: 2560px) {
  #map1style {
  height: 100%;
}
}
#map {
  height: 80%;
  margin: 50px 50px 0px 50px;
}
</style>
