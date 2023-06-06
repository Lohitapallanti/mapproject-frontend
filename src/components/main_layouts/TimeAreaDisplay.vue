<template>
  <div>
    <v-layout column wrap>
      <!-- Map -->
      <v-flex id="mapstyle" class="elevation-3">
        <google-map-comp
          :sample="myData"
          :transitsample="transitData"
          :bicyclesample="bicycleData"
          ref="form"
        ></google-map-comp>
      </v-flex>
      <v-container>
        <v-layout row wrap>
          <v-flex xs2>
            <v-checkbox
              v-model="traffic"
              @change="trafficLayermap()"
              color="#408280"
              label="Traffic"
            ></v-checkbox>
          </v-flex>
          <v-flex xs2>
            <v-checkbox
              v-model="transit"
              @change="transitLayermap()"
              color="#408280"
              label="Transit"
            ></v-checkbox>
          </v-flex>
          <v-flex xs2>
            <v-checkbox
              v-model="bicycle"
              @change="bicycleLayermap()"
              color="#408280"
              label="Bicycle"
            ></v-checkbox>
          </v-flex>
          <v-flex xs2>
            <v-checkbox
              v-model="borderCheckValue"
              @change="bordermap()"
              color="#408280"
              label="Borders"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>

    <!-- Chart & Table-->
    <v-layout row wrap justify-space-between>
      <v-flex xs12 class="elevation-1" style="background-color: #FFEDE3">
        <barchartMA />
      </v-flex>

      <v-flex xs12 mt-5 class="elevation-1" style="background-color: #FFEDE3">
        <tableMA />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import GoogleMaps from '@/components/map/GoogleMap.vue'
import tableMA from '@/components/table/table.vue'
import barchartMA from '@/components/charts/barchart.vue'

export default {
  name: 'TimeAreaDisplay',
  components: {
    googleMapComp: GoogleMaps,
    tableMA,
    barchartMA
  },
  data() {
    return {
      myData: false,
      transitData: false,
      bicycleData: false,
      borderData: false,
      bicycle: false,
      transit: false,
      traffic: false,
      borderCheckValue: false
    }
  },
  methods: {
    trafficLayermap() {
      this.myData = this.traffic
      this.$refs.form.submit()
    },
    transitLayermap() {
      this.transitData = this.transit
      this.$refs.form.transit()
    },
    bicycleLayermap() {
      this.bicycleData = this.bicycle
      this.$refs.form.bicycle()
    },
    bordermap() {
      this.borderData = this.borderCheckValue
      this.$refs.form.getBordersUsingCheck(this.borderCheckValue)
    }
  }
}
</script>

<style>
/* MAP - LOCAL */
@media screen and (min-width: 760px) {
  #mapstyle {
    height: 700px;
  }
}
@media screen and (max-width: 1280px) {
  #mapstyle {
    height: 530px;
  }
}
</style>