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
            :max="tickslength - 1"
            step="1"
            ticks="always"
            :tick-labels="ticksLabels"
            thumb-color="red"
            @change="onTimeSelect(ticksLabels[value])"
          >
            <template v-slot:prepend>
              <v-btn
                v-if="tickslength"
                dark
                color="#408280"
                fab
                @click="toggle"
              >
                <v-icon medium>{{
                  isPlaying ? 'mdi-pause' : 'mdi-play'
                }}</v-icon>
              </v-btn>
            </template>
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
import areaRests from '@/api/api_area.js'
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
      interval: null,
      rogalandhild: []
    }
  },
  mounted () {
    this.initFirstMap()
    EventBus.$on('clicked-getareageometry_timeline', selectedArea => {
      this.getareaborder(selectedArea)
    })

    // receive eventbus - remove borders(features) from map.
    EventBus.$on('clicked-removecoordinates_timeline', remove => {
      this.removecoordinates(this.map)
    })

    EventBus.$on('clicked-event_TimeLineSearch', timelineResult => {
      this.items = timelineResult
      this.value = 0
      // get selected time list & date from timeline search  - from store
      this.ticksLabels = this.$store.state.timeLinesearchtimes
      this.tickslength = this.ticksLabels.length
      this.selecteddate = this.$store.state.timeLinesearchdate
      this.onTimeSelect(this.ticksLabels[0])
    })
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
        this.interval = setInterval(this.increment, 2000)
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
    
    // remove the heatmap in map
      // for (let jj = 0; jj < this.heatmaps.length; jj++) {
      //   this.heatmaps[jj].setMap(null)
      // }

      // max people count from whole items
      let maxpeoplevalue = 0
      for (let kk = 0; kk < this.items.length; kk++) {
        if (maxpeoplevalue < this.items[kk].people) {
          maxpeoplevalue = this.items[kk].people
        }
      }
      var selectedArea = this.$store.state.s_selectionTimeLine
       // if no data for the selected area, show the border        
      for (const selected of selectedArea) {
        const b = this.items.find(
          item => (item.areatoid ===  selected.id && this.utcToLocaldatetimeFormat(item.datetime)=== this.datetimeFormatLocal(time))
        )
        if (b === undefined) {
          console.log('missing item:', selected)
          
          for (let jj = 0; jj < this.heatmaps.length; jj++) {
        this.heatmaps[jj].setMap(null)
        //  this.heatmaps[jj].setMap(this.heatmaps[jj].getMap() ? null : this.map);
      }
        }
      }


      for (let i = 0; i < this.items.length; i++) {
        if (this.datetimeFormatLocal(time) === this.utcToLocaldatetimeFormat(this.items[i].datetime)) {
          // get area coordinates
          if (this.items[i].areatogeometryid !== undefined) {
            geometryRests
              .fetchAreaGeomeries({
                id: this.items[i].areatogeometryid
              })
              .then(response => {
                response.data.features[0].geometry.coordinates = JSON.parse(response.data.features[0].geometry.coordinates)
                var items = response.data.features[0].geometry.coordinates[0]
 
                // get center using coordinates
                var bounds = new window.google.maps.LatLngBounds()
                var polygonCoords = []
                for (let k = 0; k < items.length; k++) {
                  polygonCoords.push(new window.google.maps.LatLng(items[k][0], items[k][1]))
                }
                for (let l = 0; l < polygonCoords.length; l++) {
                  bounds.extend(polygonCoords[l])
                }
                var centerlatlng = bounds.getCenter()

                var heatmap = new window.google.maps.visualization.HeatmapLayer(
                  {
                    data: [new window.google.maps.LatLng(centerlatlng.lng(), centerlatlng.lat())],
                    map: this.map,
                    radius: (this.items[i].people / maxpeoplevalue) * 100.0,
                     gradient: this.setColors()
                   
                  }
                )
                
               
                this.heatmaps.push(heatmap)
               
              })
          }
        }
      }
    },


    setColors () {
      return [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    },
    getareaborder (geometryid) {
      geometryRests
        .fetchAreaGeomeries({
          id: geometryid
        })
        .then(response => {
          var items = response.data
          // Add Features
          items.features[0].geometry.coordinates = JSON.parse(
            items.features[0].geometry.coordinates
          )
          items.features[0].properties = {}
          items.features[0].properties.Name = this.$store.state.timeLinesearcharea
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
    },
    getBordersUsingCheck (value) {
      if (value) {
        this.map.data.forEach(feature => {
          this.map.data.remove(feature)
        })
        this.getCHildren(104197)
      } else {
        this.map.data.forEach(feature => {
          this.map.data.remove(feature)
        })
      }
    },
    getCHildren (id) {
      areaRests.fetchChildren(id).then(response => {
        response.data.forEach(element => {
          if (element.kidsnumber > 0) {
            this.abc(element)
          }
        })
      })

      var myList = []
      this.map.data.addListener('click', function (event) {
        if (event.feature.getProperty('isColorful')) {
          event.feature.setProperty('isColorful', false)
        } else {
          event.feature.setProperty('isColorful', true)
        }

        const index = myList.findIndex(e => e.Id === event.feature.h.Id)

        if (index === -1) {
          myList.push(event.feature.h)
        } else {
          myList = myList.filter(obj => {
            return obj.Name !== event.feature.h.Name
          })
        }

        this.map.data.setStyle(function (feature) {
          var color = '#FFFFFF'
          if (feature.getProperty('isColorful')) {
            color = '#e41f1b'
          } else {
            color = '#FFFFFF'
          }
          return {
            fillColor: color,
            fillOpacity: 0.4,
            strokeWeight: 0.5,
            strokeOpacity: 0.8
          }
        })

        EventBus.$emit('selection-Timeline_click', myList)
      })

      var infowindow = new window.google.maps.InfoWindow()
      // Set mouseover event for each feature.
      this.map.data.addListener('mouseover', function (event) {
        var contentString =
          '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h3>' +
          event.feature.h.Name +
          ' (' +
          event.feature.h.AreaCode +
          ')' +
          '</h3>' +
          '</div>'

        infowindow.setContent(contentString)
        infowindow.setPosition(event.latLng)
        infowindow.open(this.map)
      })
      // Set mouseout event for each feature.
      this.map.data.addListener('mouseout', function (event) {
        infowindow.close()
      })
    },
    abc (obj) {
      areaRests.fetchChildren(obj.id).then(response => {
        response.data.forEach(element => {
          if (element.kidsnumber > 0) {
            this.border(element)
          }
        })
      })
    },
    border (obj) {
      areaRests.fetchChildren(obj.id).then(response => {
        response.data.forEach(element => {
          if (element.kidsnumber === 0) {
            this.rogalandhild.push(element)
            if (element.geometryid !== undefined) {
              this.getGeometryBorders(
                element.geometryid,
                element.name,
                element.code,
                element.id,
                element.parentareaid,
                element.kidsnumber
              )
            }
          }
        })
      })
    },
    getGeometryBorders (geometryId, name, code, id, parentareaid, kidsnumber) {
      geometryRests
        .fetchAreaGeomeries({
          id: geometryId
        })
        .then(response => {
          response.data.features[0].geometry.coordinates = JSON.parse(
            response.data.features[0].geometry.coordinates
          )

          // set property data for item
          response.data.features[0].properties = {}
          response.data.features[0].properties.Id = id
          response.data.features[0].properties.Name = name
          response.data.features[0].properties.AreaCode = code
          response.data.features[0].properties.GeometryId = geometryId
          response.data.features[0].properties.parentareaid = parentareaid
          response.data.features[0].properties.kidsnumber = kidsnumber
          this.map.data.addGeoJson(response.data, {
            idPropertyName: 'Id'
          })

          this.map.data.setStyle(function (feature) {
            return {
              fillColor: '#FFFFFF',
              fillOpacity: 0.1,
              strokeWeight: 0.5,
              strokeOpacity: 0.8
            }
          })
        })
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