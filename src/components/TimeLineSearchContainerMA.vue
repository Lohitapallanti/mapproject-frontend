<template>
<!-- <v-tabs v-model="active" color="#013068" dark slider-color="#8FCFCC">-->
  <v-tabs v-model="active_tab" color="#468F8C" dark slider-color="#8FCFCC" centered >
    <v-tab @click="gettab('Timeline')">TimeLine</v-tab>
    <v-tab @click="gettab('TimelineOverview')">Overview</v-tab>

    <v-tab-item>
      <TimeLineSearch />
    </v-tab-item>
    <v-tab-item>
      <TimeLineSearchOverview />
    </v-tab-item>
 </v-tabs>
 </template>

<script>
import TimeLineSearch from '@/components/searchengine/TimeLineSearch.vue'
import TimeLineSearchOverview from '@/components/searchengine/TimeLineSearchOverview.vue'

import { EventBus } from '@/event-bus.js'

export default {
  name: 'TimeLineSearchContainerMA',
  components: {
    TimeLineSearch,
    TimeLineSearchOverview
  },
  data () {
    return {
      active_tab: 0
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
