<template>
  <v-app>
    <v-content class="MAcontainer-class">
      <NavBar></NavBar>
      <v-container fluid>
        <v-layout row wrap justify-space-between>
          <v-flex xs12 md7 xl8>
            <!-- SEARCHES LAYOUTS -->
            <TimeAreaDisplay v-if="showTime" />
            <TimeAreaTotalDisplay v-if="showTimeSearchTotal" />
            <DwellTimeDisplay v-if="showDwell" />
            <TimelineDisplay v-if="showTimeline" />
            <TimelineTotalDisplay v-if="showTimelineoverview" />
          </v-flex>

          <!-- SEARCH ENGINE -->
          <v-flex xs12 md4 xl3>
            <v-layout row wrap justify-space-between>
              <v-flex xl12 class="elevation-2" style="background-color: #FFEDE3">
                <SearchContainerMA />
              </v-flex>

              <!-- HISTORY SEARCH -->
              <v-flex xs12 xl12 mt-3 class="elevation-2" style="background-color: #FFEDE3">
                <Historysearch />
              </v-flex>

              <!-- DWELL &TIME TOTOAL MAP -->
              <v-flex
                xs12 xl12 mt-3
                v-if="showDwell || showTimeSearchTotal"
                id="mapGlobal"
                class="elevation-2"
              >
                <googleMapDwell
                  :sample="myData"
                  :transitsample="transitData"
                  :bicyclesample="bicycleData"
                  ref="form"
                />
               
                
               
              
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import NavBar from '@/components/layouts/NavBar.vue'
import SearchContainerMA from '@/components/SearchContainerMA.vue'
import TimelineDisplay from '@/components/main_layouts/TimelineDisplay.vue'
import googleMapDwell from '@/components/map/googleMapDwell.vue'
import TimeAreaDisplay from '@/components/main_layouts/TimeAreaDisplay.vue'
import TimeAreaTotalDisplay from '@/components/main_layouts/TimeAreaTotalDisplay.vue'
import DwellTimeDisplay from '@/components/main_layouts/DwellTimeDisplay.vue'
import TimelineTotalDisplay from '@/components/main_layouts/TimelineTotalDisplay.vue'
import Historysearch from '@/components/Historysearch.vue'

export default {
  name: 'MunicipalAnalyticsPage',
  components: {
    NavBar,
    SearchContainerMA,
    TimeAreaDisplay,
    TimeAreaTotalDisplay,
    DwellTimeDisplay,
    TimelineDisplay,
    TimelineTotalDisplay,
    googleMapDwell,
    Historysearch
  },
  data() {
    return {
      myData: false,
      transitData: false,
      bicycleData: false,
      borderData: false,
      showDwell: false,
      showTime: true,
      showTimeline: false,
      showTimelineoverview: false,
      showTotal: false,
      showTimeSearchTotal: false,
      bicycle: false,
      transit: false,
      traffic: false,
      borderCheckValue: false
    }
  },
  mounted() {
    // Listen for the 'clicked-event'
    EventBus.$on('clicked-tabchange', setvalue => {
      this.bicycle = false
      this.transit = false
      this.traffic = false
      this.myData = false
      this.transitData = false
      this.bicycleData = false
      this.borderData = false
      if (setvalue === 'Dwell') {
        this.showDwell = true
        this.showTime = false
        this.showTimeline = false
        this.showTotal = false
        this.showTimeSearchTotal = false
        this.showTimelineoverview = false

      }
      if (setvalue === 'Time') {
        this.showDwell = false
        this.showTime = true
        this.showTimeline = false
        this.showTotal = false
        this.showTimeSearchTotal = false
        this.showTimelineoverview = false
      }
      if (setvalue === 'Timeline') {
        this.showDwell = false
        this.showTime = false
        this.showTimeline = true
        this.showTotal = false
        this.showTimeSearchTotal = false
        this.showTimelineoverview = false
        
      }
      if (setvalue === 'Total') {
        this.showDwell = false
        this.showTime = false
        this.showTimeline = false
        this.showTotal = true
        this.showTimeSearchTotal = false
        this.showTimelineoverview = false
      }
      if (setvalue === 'TimeSearchTotal') {
        this.showDwell = false
        this.showTime = false
        this.showTimeline = false
        this.showTotal = false
        this.showTimeSearchTotal = true
        this.showTimelineoverview = false
      }
      if (setvalue === 'TimelineOverview') {
        this.showDwell = false
        this.showTime = false
        this.showTimeline = false
        this.showTotal = false
        this.showTimeSearchTotal = false
        this.showTimelineoverview = true
       
      }
    })
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
    },
   

  }
}
</script>

<style>
.MAcontainer-class {
  background-color: #cea48e;
  background-size: auto;
  overflow: hidden;
}
/* TABLE - GLOBAL */
table.v-table thead th {
  font-size: 15px !important;
}
table.v-table tbody tr td {
  font-size: 12px !important;
  background-color: #ded1ca;
  background-color: #ffffef;
  color: #524d4a;
  height: 10px !important;
}
.v-table tbody tr:hover td {
  background-color: #f2f2f2;
}
.v-table th {
  background-color: #fff9e3;
  color: #524d4a;
  line-height: 3;
}
/* CHAR - GLOBAL */
@media screen and (min-width: 760px) {
  #chart {
    height: 500px;
  }
}
@media screen and (max-width: 1440px) {
  #chart {
    height: 400px;
  }
}
/* MAP - LOCAL */
@media screen and (min-width: 760px) {
  #mapGlobal {
    height: 700px;
  }
}
@media screen and (max-width: 1280px) {
  #mapGlobal {
    height: 500px;
  }
}
</style>
