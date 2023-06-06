<template>
  <div>
       <!-- Chart & Table-->
    <v-layout row wrap justify-space-between>
      <v-flex xs12 class="elevation-1" style="background-color: #FFEDE3">
        <linechartTimeSearchTotal />
      </v-flex>

      <v-flex xs12 mt-3 class="elevation-1" style="background-color: #FFEDE3">
        <tableTimeSearchTotal />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import tableTimeSearchTotal from '@/components/table/tableTimeSearchTotal.vue'
import linechartTimeSearchTotal from '@/components/charts/lcTimeSearchTotal.vue'

export default {
    name: 'TimeAreaTotalDisplay',
    components: {
        tableTimeSearchTotal,
        linechartTimeSearchTotal
    }
}
</script>

<style>
</style>