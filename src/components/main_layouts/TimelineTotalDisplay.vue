<template>
  <div>
    <v-layout column wrap>
      <!-- Map -->
      <v-flex id="mapOverview" class="elevation-3">
        <GoogleMapTimeLineSOverview
          :sample="myData"
          :transitsample="transitData"
          :bicyclesample="bicycleData"
          ref="form"
        ></GoogleMapTimeLineSOverview>
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
            <div v-if="showColorDivValue">
              <v-flex xs2>
                <div class="div1"></div>
                <p style="margin-top:-26px;margin-left:-50px;margin-right:-164px"> 21-30 </p>
              </v-flex>
              <v-flex xs2>
                <div class="div2"></div>
                <p style="margin-top:-26px;margin-left:-50px;margin-right:-164px"> 31-100 </p>
              </v-flex>
              <v-flex xs2>
                <div class="div3"></div>
                <p style="margin-top:-26px;margin-left:-50px;margin-right:-164px"> 101-300 </p>
              </v-flex>
              <v-flex xs2>
                <div class="div4"></div>
                <p style="margin-top:-26px;margin-left:-50px;margin-right:-175px"> 301-1000 </p>
              </v-flex>
              <v-flex xs2>
                <div class="div5"></div>
                <p style="margin-top:-26px;margin-left:-50px;margin-right:-188px" > 1001 & more </p>
              </v-flex>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </div>
</template>

<script>
import GoogleMapTimeLineSOverview from '@/components/map/mapTimeLineOverview.vue'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'TimelineTotalDisplay',
  components: {
    GoogleMapTimeLineSOverview
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
      showColorDivValue: false
    }
  },
  mounted () {
    EventBus.$on('showColorDiv', value => {
      this.showColorDivValue = value
    })
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
    }
  }
}
</script>

<style>
/* MAP - LOCAL */
@media screen and (min-width: 760px) {
  #mapOverview {
    height: 1100px;
  }
}
@media screen and (max-width: 1280px) {
  #mapOverview {
    height: 500px;
  }
}
.div1 {
  width: 35px;
  height: 34px;
  padding: 14px;
  background-color: #ffe5e5;
}
.div2 {
  width: 35px;
  height: 34px;
  padding: 14px;
  background-color: #f5a7a3;
}
.div3 {
  width: 35px;
  height: 34px;
  padding: 14px;
  background-color: #ec796a;
}
.div4 {
  width: 35px;
  height: 34px;
  padding: 14px;
  background-color: #d45351;
}
.div5 {
  width: 35px;
  height: 34px;
  padding: 14px;
  background-color: #ea221e;
}
</style>
