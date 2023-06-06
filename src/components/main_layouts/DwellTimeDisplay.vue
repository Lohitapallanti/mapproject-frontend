<template>
  <div>
    <!-- Chart & Table-->
    <v-layout row wrap justify-space-between>
      <v-flex xs12 class="elevation-1" style="background-color: #FFEDE3">
        <linechartDwell />
      </v-flex>

      <v-flex xs12 mt-3 class="elevation-1" style="background-color: #FFEDE3">
        <tableDwell />
      </v-flex>

      <v-flex xs12 mt-3 class="elevation-1" style="background-color: #FFEDE3">
        <stackedbarchartDwell />
      </v-flex>

      <v-flex xs12 mt-3 class="elevation-1" style="background-color: #FFEDE3">
        <tableDwellHr />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import tableDwell from '@/components/table/tableDwell.vue'
import linechartDwell from '@/components/charts/linechart.vue'
import stackedbarchartDwell from '@/components/charts/stackedbarchart.vue'
import tableDwellHr from '@/components/table/tableDwellHr.vue'

export default {
  name: 'DwellTimeDisplay',
  components: {
    tableDwell,
    linechartDwell,
    stackedbarchartDwell,
    tableDwellHr
  }
}
</script>

<style>
@media screen and (min-width: 760px) {
  #chartDwell {
    height: 600px;
  }
}
@media screen and (max-width: 1440px) {
  #chartDwell {
    height: 400px;
  }
}
</style>