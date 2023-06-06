<template>
  <div class="small">
    <pie-chart :chart-data="datacollection"></pie-chart>
  </div>
</template>

<script>
import PieChart from '@/components/charts/pie-chart.js'
import { EventBus } from '@/event-bus.js'

export default {
  components: {
    PieChart
  },
  data () {
    return {
      datacollection: null,
      timeSearchResult: [],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        pieceLabel: {
          mode: 'percentage',
          precision: 1
        }
      }
    }
  },

  mounted () {
    this.fillData()
    EventBus.$on('clicked-event', timeSearchResult => {
      /* console.log(
        `Ggreat. It's gotten ${timeSearchResult} clicks! :)`
      ) */
      this.timeSearchResult = timeSearchResult
      this.fillChartData(this.timeSearchResult)
    })
  },
  methods: {
    fillData () {
      console.log('filldata for piechart')
      this.datacollection = {
        labels: ['Date 1', 'Date 2'],
        datasets: [
          {
            backgroundColor: '#0e90a0',
            data: [0, 0]
          }
        ]
      }
    },
    fillChartData (items) {
      if (items.length > 0) {
        let increment = items.length / 2
        // console.log('increment by:', increment)
        const chartdataset = []
        let date1 = ''
        let date2 = ''
        date1 = this.timeSearchResult[0].datetime
        date2 = this.timeSearchResult[0 + increment].datetime
        for (let i = 0; i < increment; i++) {
          chartdataset.push({
            // label: this.timeSearchResult[i].areaname,
            backgroundColor: [this.generator(), this.generator()], // '#f87979',
            data: [
              this.timeSearchResult[i].people,
              this.timeSearchResult[i + increment].people
            ]
          })
        }
        this.datacollection = {
          labels: [date1, date2],
          datasets: chartdataset
        }
      }
    },
    generator () {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    }
  }
}
</script>

<style>
.small {
  max-width: 400px;
  margin: 10px auto;
}
</style>
