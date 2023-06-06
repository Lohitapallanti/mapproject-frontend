<template>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0" />
  </head>
  <body>
    <template>
      <div id="slider" style="width:85%">
        <v-slider
          v-model="value"
          :max="tickslength-1"
          step="1"
          ticks="always"
          :tick-labels="ticksLabels"
          thumb-color="red"
          @change="onTimeSelect(ticksLabels[value])"
        >
          <!-- <template v-slot:prepend>
            <v-btn v-if="tickslength" dark color="#408280" fab @click="toggle">
              <v-icon medium>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
          </template> -->
        </v-slider>
      
      </div>
     
          
      
      <div id="map2"></div>
    </template>
  </body>
</html>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import geometryRests from '@/api/api_geometry.js'
export default {
  props: {
    sample: {
      type: Boolean
    },
    transitsample: {
      type: Boolean
    },
    bicyclesample: {
      type: Boolean
    }
  },
  data () {
    return {
      map: '',
      trafficLayer: new window.google.maps.TrafficLayer(),
      transitLayer: new window.google.maps.TransitLayer(),
      bicycleLayer: new window.google.maps.BicyclingLayer(),
      heatmaps: [],
      items: [],
      selecteddate: '',
      value: 0,
      ticksLabels: [],
      tickslength: 0,
      isPlaying: false,
      interval: null
    }
  },
  mounted () {
    this.initFirstMap()
    EventBus.$on('clicked-getareageometry_timelineoverview', selectedArea => {
      this.getareaborder(selectedArea)
    })

    // receive eventbus - remove borders(features) from map.
    EventBus.$on('clicked-removecoordinates_timelineoverview', remove => {
      this.removecoordinates(this.map)
    })

    EventBus.$on(
      'clicked-event_timelineoverview',
      timeLineSearchOverviewResult => {
        this.items = timeLineSearchOverviewResult
        this.value = 0
        // get selected time list & date from timeline search  - from store
        this.ticksLabels = this.$store.state.timeLineOverviewtimes
        this.tickslength = this.ticksLabels.length
        this.selecteddate = this.$store.state.timeLineOverviewdate
        this.onTimeSelect(this.ticksLabels[0])
      }
    )
  },
  methods: {
    submit () {
      if (this.sample === false) {
        this.trafficLayer.setMap(this.map)
      } else {
        this.trafficLayer.setMap(null)
      }
    },
    transit () {
      if (this.transitsample === false) {
        this.transitLayer.setMap(this.map)
      } else {
        this.transitLayer.setMap(null)
      }
    },
    bicycle () {
      if (this.bicyclesample === false) {
        this.bicycleLayer.setMap(this.map)
      } else {
        this.bicycleLayer.setMap(null)
      }
    },

    toggle () {
      if (this.isPlaying === false) {
        this.isPlaying = true
        this.interval = setInterval(this.increment, 8000)
      } else {
        this.isPlaying = false
        clearInterval(this.interval)
      }
    },
    increment () {
      this.value = (this.value % 360) + 1

      if (this.value < this.ticksLabels.length) {
        this.onTimeSelect(this.ticksLabels[this.value])
      } else {
        this.value = 0
        this.onTimeSelect(this.ticksLabels[this.value])
      }
    },
    initFirstMap () {
      this.map = new window.google.maps.Map(document.getElementById('map2'), {
        zoom: 13,
        center: { lat: 58.977722, lng: 5.716285 },
        mapTypeControl: true,
        ClickableIcons: true,
        fullscreenControl: true
      })
      // add slider to map
      this.map.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(
        document.getElementById('slider')
      )
    },
    onTimeSelect (time) {
      // remove styles in map
      // this.map.data.setStyle(null)

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].areatocode.length === 8) {
          if (this.datetimeFormatLocal(time) === this.utcToLocaldatetimeFormat(this.items[i].datetime)) {
            // get area coordinates
            if (this.items[i].areatogeometryid !== undefined) {
              geometryRests
                .fetchAreaGeomeries({
                  id: this.items[i].areatogeometryid
                })
                .then(response => {
                  response.data.features[0].geometry.coordinates = JSON.parse(
                    response.data.features[0].geometry.coordinates
                  )

                  // set property data for item
                  response.data.features[0].properties = {}
                  response.data.features[0].properties.Id = this.items[i].areatoid
                  response.data.features[0].properties.Name = this.items[i].areatoname
                  response.data.features[0].properties.AreaCode = this.items[i].areatocode
                  response.data.features[0].properties.Datetime = this.items[i].datetime
                  response.data.features[0].properties.People = this.items[i].people

                  if (this.items[i].people > 20 && this.items[i].people <= 30) {
                    // 21-30: Very week color
                    response.data.features[0].properties.Opacity = 0.1
                  } else if (this.items[i].people >= 31 && this.items[i].people <= 100) {
                    // 31-100: Week color
                    response.data.features[0].properties.Opacity = 0.3
                  } else if (this.items[i].people >= 101 && this.items[i].people <= 300) {
                    // 101-300: Medium stong color
                    response.data.features[0].properties.Opacity = 0.5
                  } else if (this.items[i].people >= 301 && this.items[i].people <= 1000) {
                    // 301-1000: Strong color
                    response.data.features[0].properties.Opacity = 0.8
                  } else {
                    // 1001-> Super strong color
                    response.data.features[0].properties.Opacity = 1.0
                  }

                  this.map.data.addGeoJson(response.data, {
                    idPropertyName: 'Name'
                  })

                  this.map.data.setStyle(function (feature) {
                    if (feature.getProperty('Opacity') !== undefined) {
                      return {
                        fillColor: '#FF0000',
                        fillOpacity: feature.getProperty('Opacity'),
                        strokeWeight: 2,
                        strokeOpacity: 0.8
                      }
                    }
                  })
                })
            }
          }
        }
      }
    },

    getareaborder (geometryid) {
      geometryRests
        .fetchAreaGeomeries({
          id: geometryid
        })
        .then(response => {
          var items = response.data
          // Add Features
          items.features[0].geometry.coordinates = JSON.parse(items.features[0].geometry.coordinates)

          // if (this.$store.state.timeLineOverviewarea === 'Sandnes' || this.$store.state.timeLineOverviewarea === 'Strand') {
            items.features[0].properties = {}
            items.features[0].properties.Name = this.$store.state.timeLineOverviewarea
            this.map.data.addGeoJson(items, { idPropertyName: 'Name' })

            // set color for each area or feature
            this.map.data.setStyle(function (feature) {
              return {
                fillColor: '#FFFFFF',
                fillOpacity: 0.1,
                strokeColor: '#FF0000',
                strokeWeight: 2,
                strokeOpacity: 0.8
              }
            })

            var infowindow = new window.google.maps.InfoWindow()
            // Set mouseover event for each feature.
            this.map.data.addListener('mouseover', function (event) {
              infowindow.setContent(event.feature.i)
              infowindow.setPosition(event.latLng)
              infowindow.open(this.map)
            })
            // Set mouseout event for each feature.
            this.map.data.addListener('mouseout', function (event) {
              infowindow.close()
            })
         // }
        })
    },

    removecoordinates (map) {
      // Remove features
      map.data.forEach(function (feature) {
        map.data.remove(feature)
      })
    },
    // convert utc date to local system date - 'YYYY-MM-DD hh:mm:ss'
    utcToLocaldatetimeFormat (datetime) {
      let date = new Date(datetime)
      var utctolocal = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      )
      if (datetime) {
        return (
          utctolocal.getFullYear() +
          '-' +
          ('0' + (utctolocal.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + utctolocal.getDate()).slice(-2) +
          ' ' +
          ('0' + utctolocal.getHours()).slice(-2) +
          ':' +
          ('0' + utctolocal.getMinutes()).slice(-2) +
          ':' +
          ('0' + utctolocal.getSeconds()).slice(-2)
        )
      }
    },

    // 'YYYY-MM-DD 00:00:00'
    datetimeFormatLocal (time) {
      var date = new Date(this.selecteddate + ' ' + time)
      if (date) {
        return (
          date.getFullYear() +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + date.getDate()).slice(-2) +
          ' ' +
          ('0' + date.getHours()).slice(-2) +
          ':' +
          ('0' + date.getMinutes()).slice(-2) +
          ':' +
          ('0' + date.getSeconds()).slice(-2)
        )
      }
    }
  }
}
</script>
<style>
/* Always set the map height explicitly to define the size of the div element that contains the map.
Optional: Makes the sample page fill the window. */
html,
#map_dwell {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
  padding: 0;
  /* max-width: 100%; */
}
.v-slider__ticks > span {
  margin-top: 10px !important;
  margin-left: -28px !important;
  transform: rotate(301deg) !important;
}
</style>
