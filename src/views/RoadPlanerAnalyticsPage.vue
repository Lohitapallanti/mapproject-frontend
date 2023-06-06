<template>
  <v-app>
    <v-content class="road_background">
      <NavBar></NavBar>
      <v-container fluid>
        <v-layout row wrap justify-space-between>
          <!-- Map -->
          <v-flex xs12 md4 xl5 id="mapstyle" class="elevation-3">
            <GoogleMaps />
          </v-flex>

          <!-- Chart & Table-->
          <v-flex xs12 md4 xl4>
            <v-layout wrap column>
              <v-flex class="elevation-1" style="background-color: #EBFCFF">
                <barchartMA />
                <!--   <piechartMA />-->
              </v-flex>

              <v-flex mt-5 class="elevation-1" style="background-color: #EBFCFF">
                <br />
                <tableMA />
              </v-flex>
            </v-layout>
          </v-flex>

          <!-- Search Engine -->
          <v-flex xs12 md3 xl2>
            <v-layout>
              <v-flex class="elevation-2">
                <SearchContainerMA style="background-color: #EBFCFF" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/layouts/NavBar.vue'
import SearchContainerMA from '@/components/SearchContainerMA.vue'
import GoogleMaps from '@/components/map/GoogleMap.vue'
import tableMA from '@/components/table/table.vue'
import barchartMA from '@/components/charts/barchart.vue'

export default {
  name: 'RoadPlanerAnalyticsPage',
  components: {
    NavBar,
    SearchContainerMA,
    GoogleMaps,
    tableMA,
    barchartMA
  },
  data () {
    return {
      teststyle: {
        background: 'red'
      }
    }
  }
}
</script>

<style>
.road_background {
  background-color: #4a7177;
  background-size: auto;
  overflow: hidden;
}
</style>
