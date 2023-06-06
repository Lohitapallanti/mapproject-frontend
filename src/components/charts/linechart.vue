<template>
  <div>
    <line-chart id="chartDwell" :chart-data="datacollection" :options="options"></line-chart>
  </div>
</template>

<script>
import LineChart from '@/components/charts/line-chart.js'
import { EventBus } from '@/event-bus.js'
export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null,
      dwelltimeResult: [],
      selecteddwelltimedates: [],
      options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-label',
              ticks: {
                /* max: 300,
           min: 0,
           stepSize: 50,
           maxTicksLimit: 3 */
                beginAtZero: true
              },
              position: 'left',
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          position: 'top'
        },
        responsive: true,
        maintainAspectRatio: false,
        scaleBeginAtZero: true
      }
    }
  },

  mounted () {
    // this.createLineChart()
    EventBus.$on('clicked-event_dwelltime', dwelltimeResult => {
      this.dwelltimeResult = dwelltimeResult
      // get selected date list from dwell time search  - from store
      this.selecteddwelltimedates = this.$store.state.dwelltimesearchdates

      this.fillChartData()
    })
  },
  methods: {
    createLineChart () {
      this.datacollection = {
        labels: ['Date 1', 'Date 2'],
        datasets: [
          {
            label: 'Country',
            borderColor: '#f87979',
            data: [0, 0]
          }
        ]
      }
    },
    fillChartData () {
      if (this.dwelltimeResult.length > 0) {
        const dataset = []

        for (let i = 0; i < this.dwelltimeResult.length; i++) {
          if (parseInt(this.dwelltimeResult[i].people) === -1) {
            continue
          }

          let datasetindex = -1
          for (let j = 0; j < dataset.length; j++) {
            if (dataset[j].country === this.dwelltimeResult[i].country) {
              datasetindex = j
              break
            }
          }
          let dateindex = -1
          for (let k = 0; k < this.selecteddwelltimedates.length; k++) {
            if (
              this.datetimeFormatLocal(this.selecteddwelltimedates[k]) ===
              this.utcToLocaldatetimeFormat(this.dwelltimeResult[i].date)
            ) {
              dateindex = k
              break
            }
          }
          if (dateindex === -1) {
            console.log(
              '!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!'
            )
          }
          if (datasetindex === -1) {
            dataset.push({
              country: this.dwelltimeResult[i].country,
              people: new Array(this.selecteddwelltimedates.length).fill(0)
            })
            dataset[dataset.length - 1].people[dateindex] = parseInt(
              this.dwelltimeResult[i].people
            )
          } else {
            dataset[datasetindex].people[dateindex] =
              parseInt(dataset[datasetindex].people[dateindex]) +
              parseInt(this.dwelltimeResult[i].people)
          }
        }

        // sort dataset by country name - ascending order
        dataset.sort((a, b) => (a.country > b.country ? 1 : -1))

        // get date labels
        const dates = []
        for (const selecteddate of this.selecteddwelltimedates) {
          dates.push(this.datetimeFormat(selecteddate))
        }

        const linechartdataset = []
        for (let t = 0; t < dataset.length; t++) {
          linechartdataset.push({
            label: dataset[t].country,
            borderColor: this.colorGenerator(),
            data: dataset[t].people,
            fill: false
          })
        }

        this.datacollection = {
          labels: dates,
          datasets: linechartdataset
        }
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
          ('0' + utctolocal.getHours()).slice(-2) +
          ':' +
          ('0' + utctolocal.getMinutes()).slice(-2) +
          ':' +
          ('0' + utctolocal.getSeconds()).slice(-2)
        )
      }
    },

    datetimeFormatLocal (datetime) {
      var timeString = '00:00:00'
      var date = new Date(datetime + ' ' + timeString)
      if (datetime) {
        return (
          date.getFullYear() +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + date.getDate()).slice(-2) +
          ' ' +
          ('0' + date.getHours()).slice(-2) +
          ':' +
          ('0' + date.getMinutes()).slice(-2) +
          ':' +
          ('0' + date.getSeconds()).slice(-2)
        )
      }
    },
    // Date & Time formating
    datetimeFormat (datetime) {
      let date = new Date(datetime)
      if (datetime) {
        return (
          ('0' + date.getDate()).slice(-2) +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          ('-' + date.getFullYear())
        )
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
