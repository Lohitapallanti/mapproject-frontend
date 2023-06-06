<template>
  <div>
    <!-- styles defined in bartchart.vue -->
    <stackedBar class="elevation-1" id="chartDwell" v-if="datacollection != null" :chart-data="datacollection" :options="options"></stackedBar>
  </div>
</template>

<script>
import stackedBar from '@/components/charts/stackedbar-chart.js'
import { EventBus } from '@/event-bus.js'

export default {
  components: {
    stackedBar
  },
  data () {
    return {
      datacollection: null,
      timeSearchResult: [],
      date1: '',
      date2: '',
      time: '',
      items: [],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 0.8,
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true
              },
              position: 'left',
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    }
  },

  mounted () {
    EventBus.$on('clicked-event_dwellhr', tablehrdataset => {
      this.items = tablehrdataset
      this.fillChartData()
    })
  },
  methods: {
    fillChartData () {
      if (this.items.length > 0) {
        // get hrs labels from store
        const hrslist = this.$store.state.dwelltimesearch.dwellhourslist

        // add each items to linechartdataset
        const linechartdataset = []
        for (let t = 0; t < this.items.length; t++) {
          linechartdataset.push({
            label: this.items[t].country,
            backgroundColor: this.colorGenerator(),
            data: this.items[t].people
          })
        }

        // set the labels: hrslist and linechartdataset to datacollection - this datacollection will show in chart.
        this.datacollection = {
          labels: hrslist,
          datasets: linechartdataset
        }
      }
    },
    colorGenerator () {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    }
  }
}
</script>

<style>
</style>
