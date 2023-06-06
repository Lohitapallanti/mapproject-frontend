<template>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0" />
  </head>
  <body>
    <div id="map_dwell"></div>
  </body>
</html>
</template>
<script>
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
      bicycleLayer: new window.google.maps.BicyclingLayer()
    }
  },

  mounted () {
    this.initFirstMap()
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
    initFirstMap () {
      this.map = new window.google.maps.Map(document.getElementById('map_dwell'), {
        zoom: 12,
        center: { lat: 58.977722, lng: 5.716285 },
        mapTypeControl: true,
        ClickableIcons: true,
        fullscreenControl: true
      })

      // bomringen, for now stavanger bomringen
      this.getBomringen()
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
        // {lat:58.969267, lng: 5.747968},
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
        fillColor: '#FFFFFF',
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
</style>
