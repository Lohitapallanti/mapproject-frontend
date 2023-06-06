<template>
  <div>
    <v-layout column wrap>
      <!-- Map -->
      <v-flex id="mapstyle" class="elevation-3">
        <googleMapTimeLine
          :sample="myData"
          :transitsample="transitData"
          :bicyclesample="bicycleData"
          ref="form"
        ></googleMapTimeLine>
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
        <barchartTimeLine />
      </v-flex>

      <v-flex xs12 mt-5 class="elevation-1" style="background-color: #FFEDE3">
        <tableTimeLine />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import googleMapTimeLine from '@/components/map/heatMapTimeLine.vue'
import tableTimeLine from '@/components/table/tableTimeLine.vue'
import barchartTimeLine from '@/components/charts/barchartTimeLine.vue'

export default {
  name: 'TimelineDisplay',
  components: {
    googleMapTimeLine,
    tableTimeLine,
    barchartTimeLine
  },
  data () {
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
    trafficLayermap () {
      this.myData = this.traffic
      this.$refs.form.submit()
    },
    transitLayermap () {
      this.transitData = this.transit
      this.$refs.form.transit()
    },
    bicycleLayermap () {
      this.bicycleData = this.bicycle
      this.$refs.form.bicycle()
    },
    bordermap () {
      this.borderData = this.borderCheckValue
      this.$refs.form.getBordersUsingCheck(this.borderCheckValue)
    }
  }
}
</script>

<style></style>
