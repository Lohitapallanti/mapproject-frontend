<template>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0" />
    </head>
    <body>
      <div
      
  id="progress-circular">
 
      <v-progress-circular
      :rotate="360"
      :size="80"
      :width="15"
     :value="value"
      color="teal"
      v-show="isValue"
    >
      {{ value }}
    </v-progress-circular>
      </div>

      <div id="map2"></div>
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
      rogalandhild: [],
      map: '',
      trafficLayer: new window.google.maps.TrafficLayer(),
      transitLayer: new window.google.maps.TransitLayer(),
      bicycleLayer: new window.google.maps.BicyclingLayer(),
      interval: {},
         value: 0,
         isValue:false,
         show:true

    }
  },

  mounted () {
    this.initFirstMap()
    // receive eventbus - Add borders(features) to the map.
    /* EventBus.$on('clicked-getareageometry', selectedArea => {
      // bomringen, for now stavanger bomringen
      this.getBomringen()
      this.getcoordinates(selectedArea)
    }) */
    // receive eventbus - remove borders(features) from map.
    EventBus.$on('clicked-removecoordinates', test => {
      this.removecoordinates(this.map)
    })

    // receive eventbus - get map data.
    EventBus.$on('clicked-getmapdata', datacollection => {
      this.datatomap(datacollection)
    })
  },
  methods: {
    beforeDestroy () {
      clearInterval(this.interval)
    },

    initFirstMap () {
      this.map = new window.google.maps.Map(document.getElementById('map2'), {
        zoom: 12,
        center: { lat: 58.977722, lng: 5.716285 },
        mapTypeControl: true,
        ClickableIcons: true,
        fullscreenControl: true
      })

      // bomringen, for now stavanger bomringen
      this.getBomringen()
       this.map.controls[window.google.maps.ControlPosition.CENTER].push(
        document.getElementById('progress-circular')
      )
    },
    getBomringen () {
      // Define the LatLng coordinates for the outer path.
      var outerCoords = [
        { lat: 58.977722, lng: 5.716285 },
        { lat: 58.976545, lng: 5.711828 },
        { lat: 58.975384, lng: 5.710498 },
        { lat: 58.969118, lng: 5.702089 },
        { lat: 58.968776, lng: 5.701967 },
        { lat: 58.964816, lng: 5.702054 },
        { lat: 58.959018, lng: 5.722535 },
        { lat: 58.951644, lng: 5.72923 },
        { lat: 58.951221, lng: 5.751634 },
        { lat: 58.958831, lng: 5.767946 },
        { lat: 58.97025, lng: 5.767786 },
        { lat: 58.975212, lng: 5.725025 },
        { lat: 58.983001, lng: 5.716433 }
      ]

      // Construct the polygon with path: outerCoords.
      var areaPolygon = new window.google.maps.Polygon({
        paths: outerCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0.1
      })

      // set polygon to map
      areaPolygon.setMap(this.map)

      // mouseover - open infowindow for polygon
      var infowindow = new window.google.maps.InfoWindow()
      areaPolygon.addListener('mouseover', function (event) {
        infowindow.setContent('Stavanger Bomring')
        infowindow.setPosition(event.latLng)
        infowindow.open(this.map, areaPolygon)
      })

      // mouseout - close infowindow for polygon
      areaPolygon.addListener('mouseout', function (event) {
        infowindow.close()
      })
    },
    getBordersUsingCheck (value) {
             

      if (value) {
        this.isValue = true
        this.interval = setInterval(() => {
        if (this.value === 100) {
              this.isValue = false
               this.show = true 
              
            console.log('this.show',this.show)
            return (this.value = 0)
        }
        this.value += 10
      }, 4000)
   
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

        // old method - style
        // this.map.data.setStyle(function (feature) {
        //   for (let i = 0; i < myList.length; i++) {
        //     if (feature.h.Id === myList[i].Id) {
        //       return {
        //         fillColor: '#e41f1b',
        //         strokeColor: '#000000'
        //       }
        //     }
        //   }
        // })

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

        EventBus.$emit('selection-click', myList)
      })

      // show infoWindow - area & code
      this.showInfowindow()
    },
    showInfowindow () {
      var infowindow = new window.google.maps.InfoWindow()

      // Set mouseover event for each feature.
      this.map.data.addListener('mouseover', function (event) {
        var contentString = ''
        // if no data for the selected area, show 'No data' contentString , else show the contentString with data
        if (event.feature.h.Color === '#FFFFFF') {
          contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h3>' +
            event.feature.h.Name +
            ' (' +
            event.feature.h.AreaCode +
            ')' +
            '</h3>' +
            '<div id="bodyContent"> No Data</div>' +
            '</div>'
        } else if (event.feature.h.Date1 !== undefined) {
          contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h3>' +
            event.feature.h.Name +
            ' (' +
            event.feature.h.AreaCode +
            ')' +
            '</h3>' +
            '<div id="bodyContent">' +
            '<p>' +
            event.feature.h.Date1 +
            ': ' +
            event.feature.h.Date1People +
            '</br>' +
            event.feature.h.Date2 +
            ': ' +
            event.feature.h.Date2People +
            '</p>' +
            '</div>' +
            '</div>'
        } else {
          contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h3>' +
            event.feature.h.Name +
            ' (' +
            event.feature.h.AreaCode +
            ')' +
            '</h3>'
        }

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
    },
    datatomap (datacollection) {
      var selectionArea = []
      // get selected areas from store
      selectionArea = this.$store.state.s_selection
      for (const selected of selectionArea) {
        for (let i = 0; i < datacollection.datasets.length; i++) {
          if ('(' + selected.code + ') ' + selected.name === datacollection.datasets[i].label) {
            if (selected.geometryid !== undefined) {
              geometryRests
                .fetchAreaGeomeries({
                  id: selected.geometryid
                })
                .then(response => {
                  response.data.features[0].geometry.coordinates = JSON.parse(
                    response.data.features[0].geometry.coordinates
                  )

                  // set property data for item
                  response.data.features[0].properties = {}
                  response.data.features[0].properties.Color = datacollection.datasets[i].backgroundColor
                  response.data.features[0].properties.Id = selected.id
                  response.data.features[0].properties.Name = selected.name
                  response.data.features[0].properties.Date1 = datacollection.labels[0]
                  response.data.features[0].properties.Date2 = datacollection.labels[1]
                  response.data.features[0].properties.Date1People = datacollection.datasets[i].data[0]
                  response.data.features[0].properties.Date2People = datacollection.datasets[i].data[1]
                  response.data.features[0].properties.AreaCode = selected.code
                  this.map.data.addGeoJson(response.data, {
                    idPropertyName: 'Id'
                  })

                  this.map.data.setStyle(function (feature) {
                    // if no data for the selected area, show only border, else show with fill color
                    if (feature.getProperty('Color') === '#FFFFFF') {
                      return {
                        fillColor: '#000000',
                        fillOpacity: 0,
                        strokeWeight: 2,
                        strokeOpacity: 0.5
                      }
                    } else {
                      return {
                        fillColor: feature.getProperty('Color'),
                        fillOpacity: 0.3,
                        strokeWeight: 2,
                        strokeOpacity: 0.8
                      }
                    }
                  })
                  // show inforwindow for each feature
                  this.showInfowindow()
                })
            }
          }
        }
      }

      // if no data for the selected area, show the border
      for (const selected of selectionArea) {
        const b = datacollection.datasets.find(
          item => item.label === '(' + selected.code + ') ' + selected.name
        )
        if (b === undefined) {
          if (selected.geometryid !== undefined) {
            geometryRests
              .fetchAreaGeomeries({
                id: selected.geometryid
              })
              .then(response => {
                response.data.features[0].geometry.coordinates = JSON.parse(
                  response.data.features[0].geometry.coordinates
                )

                // set property data for item
                response.data.features[0].properties = {}
                response.data.features[0].properties.Color = '#FFFFFF'
                response.data.features[0].properties.Id = selected.id
                response.data.features[0].properties.Name = selected.name
                response.data.features[0].properties.AreaCode = selected.code

                this.map.data.addGeoJson(response.data)
              })
          }
        }
      }
    },
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
    getcoordinates (items) {
      // Add Features
      items.features[0].geometry.coordinates = JSON.parse(
        items.features[0].geometry.coordinates
      )

      this.map.data.addGeoJson(items)

      // set color for each area or feature
      this.map.data.setStyle(function (feature) {
        return {
          fillOpacity: 0.1,
          strokeWeight: 2,
          strokeOpacity: 0.8
        }
      })
    },
    removecoordinates (map) {
      // Remove features
      map.data.forEach(function (feature) {
        map.data.remove(feature)
      })
    },
    colorGenerator () {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    }
  }
}
</script>
<style>
/* Always set the map height explicitly to define the size of the div element that contains the map.
Optional: Makes the sample page fill the window. */
html,
#map2 {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
  padding: 0;
  /* max-width: 100%; */
}
</style>