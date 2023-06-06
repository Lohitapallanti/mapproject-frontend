<template>
  <v-app>
    <v-content class="buisness_background">
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
              <v-flex class="elevation-1" style="background-color: #E0F7FF">
                <h2>Chart</h2>
                <barchartMA />
                <!--   <piechartMA />-->
              </v-flex>

              <v-flex mt-5 class="elevation-1" style="background-color: #E0F7FF">
                <h2>Table</h2>
                <br />
                <tableMA />
              </v-flex>
            </v-layout>
          </v-flex>

          <!-- Search Engine -->
          <v-flex xs12 md3 xl2>
            <v-layout>
              <v-flex class="elevation-2">
                <SearchContainerMA style="background-color: #E0F7FF" />
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
  name: 'BuisnessAnalyticsPage',
  components: {
    NavBar,
    SearchContainerMA,
    GoogleMaps,
    tableMA,
    barchartMA
  }
}
</script>

<style>
.buisness_background {
  background-color: #095570;
  background-size: auto;
  overflow: hidden;
}
</style>
