<template>
<!-- <v-tabs v-model="active" color="#013068" dark slider-color="#8FCFCC">-->
  <v-tabs v-model="active" color="#468F8C" dark slider-color="#8FCFCC" centered >
    <v-tab @click="gettab('Time')">Time</v-tab>
    <v-tab @click="gettab('TimeSearchTotal')">Total</v-tab>
    <v-tab-item>
      <TimeSearch />
    </v-tab-item>
    <v-tab-item>
      <TimeSearchTotal />
    </v-tab-item>

  </v-tabs>
</template>

<script>
import TimeSearch from '@/components/searchengine/TimeSearch.vue'
import TimeSearchTotal from '@/components/searchengine/TimeSearchTotal.vue'

import { EventBus } from '@/event-bus.js'

export default {
  name: 'TimeSearchContainerMA',
  components: {
    TimeSearch,
    TimeSearchTotal
  },
  data () {
    return {
      active: 0
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
