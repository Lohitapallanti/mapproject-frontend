<template>
  <v-tabs v-model="active" color="#408280" dark slider-color="#8FCFCC">
    <v-tab @click="gettab('Time')" title="Time">Time</v-tab>
    <v-tab @click="gettab('Dwell')">Dwell Time</v-tab>
    <v-tab @click="gettab('Timeline')">Timeline</v-tab>
    <v-tab @click="gettab('Total')">Total</v-tab>
    <v-tab-item>
      <TimeSearchContainerMA />
    </v-tab-item>
    <v-tab-item>
      <DwellTimeSearch />
    </v-tab-item>
    <v-tab-item>
     <TimeLineSearchContainerMA />
    </v-tab-item>
    <v-tab-item>
      <TotalSearch />
    </v-tab-item>
  </v-tabs>
</template>

<script>
import DwellTimeSearch from '@/components/searchengine/DwellTimeSearch.vue'
import TotalSearch from '@/components/searchengine/TotalSearch.vue'
import TimeSearchContainerMA from '@/components/TimeSearchContainerMA.vue'
import TimeLineSearchContainerMA from '@/components/TimeLineSearchContainerMA.vue'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'SearchContainerMA',
  components: {
    TimeSearchContainerMA,
    TimeLineSearchContainerMA,
    DwellTimeSearch,
    TotalSearch
  },
  data () {
    return {
      active: null
    }
  },
  methods: {
    gettab (val) {
      EventBus.$emit('clicked-tabchange', val)
    }
  }
}
</script>

<style>
</style>
