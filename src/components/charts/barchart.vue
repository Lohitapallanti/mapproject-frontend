<template>
  <div>
    <bar-chart id="chart" :chart-data="datacollection" v-if="datacollection" :options="options"></bar-chart>
  </div>
</template>

<script>
import BarChart from '@/components/charts/bar-chart.js'
import { EventBus } from '@/event-bus.js'

export default {
  components: {
    BarChart
  },
  data () {
    return {
      datacollection: null,
      timeSearchResult: [],
      date1: '',
      date2: '',
      time: '',
      options: {
         title: {
      display: true,
      text: 'Estimated numbers of persons from selected areas to stavanger bomrings',
      font: 12,
    },
        scales: {
          yAxes: [
            {
              yAxisID:"dfgdfgdfg",

              id: 'y-axis-label',
              ticks: {
                /* max: 300,
           min: 0,
           stepSize: 50,
           maxTicksLimit: 3 */
                beginAtZero: true,
              
              },
              position: 'left',
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          position: 'bottom'
        },
        responsive: true,
        maintainAspectRatio: false,
        scaleBeginAtZero: true
      }
    }
  },

  mounted () {
    // this.fillData()
    EventBus.$on('clicked-event', timeSearchResult => {
      this.timeSearchResult = timeSearchResult

      // get selected dates & time from time search store
      this.date1 = this.$store.state.timesearchdate1
      this.date2 = this.$store.state.timesearchdate2
      this.time = this.$store.state.timesearchtime

      this.fillChartData()
    })
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: ['Date 1', 'Date 2'],
        datasets: [
          {
            label: 'Area 1',
            backgroundColor: '#f87979',
            data: [0, 0]
          }
        ]
      }
    },
    fillChartData () {
      // If result has value, then add into chart, else show empty chart
      var date1 = this.datetimeFormat(this.date1)
      var date2 = this.datetimeFormat(this.date2)
      if (this.timeSearchResult.length > 0) {
        const chartdataset = []

        this.selection = this.$store.state.s_selection
        var selecteddate1 = this.datetimeFormatLocal(this.date1)
        var selecteddate2 = this.datetimeFormatLocal(this.date2)

        for (const selected of this.selection) {
          var area = ''
          var people1 = ''
          var people2 = ''

          for (let i = 0; i < this.timeSearchResult.length; i++) {
            var resultitemdate = this.utcToLocaldatetimeFormat(
              this.timeSearchResult[i].datetime
            )
            var resultitemcode = this.timeSearchResult[i].areacode

            if (
              selected.code === resultitemcode &&
              selecteddate1 === resultitemdate
            ) {
              area = '(' + this.timeSearchResult[i].areacode + ') ' + this.timeSearchResult[i].areaname              
              people1 = this.timeSearchResult[i].people
            }

            if (
              selected.code === resultitemcode &&
              selecteddate2 === resultitemdate
            ) {
              area = '(' + this.timeSearchResult[i].areacode + ') ' + this.timeSearchResult[i].areaname
              people2 = this.timeSearchResult[i].people
            }
          }
          if (area !== '') {
            chartdataset.push({
              label: area,
              backgroundColor: this.colorGenerator(),
              data: [people1, people2]
            })
          }
        }

        // sort chartdataset by area name - ascending order
        chartdataset.sort((a, b) => (a.label > b.label ? 1 : -1))

        this.datacollection = {
          labels: [date1, date2],
          datasets: chartdataset
        }
      } else {
        this.fillData()
      }
      EventBus.$emit('clicked-getmapdata', this.datacollection)
    },
    colorGenerator () {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    },
    // Date & Time formating
    datetimeFormat (datetime) {
      let date = new Date(datetime)
      if (datetime) {
        return (
          ('0' + date.getDate()).slice(-2) +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          ('-' + date.getFullYear()) +
          ' ' +
          this.time
        )
      }
    },
    datetimeFormatLocal (datetime) {
      var timeString = this.time + ':00'
      var date = new Date(datetime + ' ' + timeString)
      if (datetime) {
        return (
          date.getFullYear() +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + date.getDate()).slice(-2) +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes() +
          ':' +
          date.getSeconds()
        )
      }
    },
    utcToLocaldatetimeFormat (datetime) {
      let date = new Date(datetime)
      var utctolocal = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      )
      if (datetime) {
        return (
          utctolocal.getFullYear() +
          '-' +
          ('0' + (utctolocal.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + utctolocal.getDate()).slice(-2) +
          ' ' +
          utctolocal.getHours() +
          ':' +
          utctolocal.getMinutes() +
          ':' +
          utctolocal.getSeconds()
        )
      }
    }
  }
}
</script>

<style>
</style>
