<template>
  <v-app>
    <v-content class="turism_backgroung">
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
              <v-flex class="elevation-1" style="background-color: #E8FFFC">
                <barchartMA />
                <!--   <piechartMA />-->
              </v-flex>

              <v-flex mt-5 class="elevation-1" style="background-color: #E8FFFC">
                <br />
                <tableMA />
              </v-flex>
            </v-layout>
          </v-flex>

          <!-- Search Engine -->
          <v-flex xs12 md3 xl2>
            <v-layout>
              <v-flex class="elevation-2">
                <SearchContainerMA style="background-color: #E8FFFC" />
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
  name: 'TurismAnalyticsPage',
  components: {
    NavBar,
    SearchContainerMA,
    GoogleMaps,
    tableMA,
    barchartMA /*,
    piechartMA */
  }
}
</script>

<style>
.turism_backgroung {
  background-color: #027064;
  background-size: auto;
  overflow: hidden;
}
</style>
