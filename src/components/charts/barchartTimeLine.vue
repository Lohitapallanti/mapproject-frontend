<template>
  <div>
    <bar-chart :chart-data="datacollection" v-if="datacollection" :options="options" id="chart"></bar-chart>
  </div>
</template>

<script>
import BarChart from '@/components/charts/bar-chart.js'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'barchartTimeLine',
  components: {
    BarChart
  },
  data () {
    return {
      datacollection: null,
      items: [],
      selecteddate: '',
      selectedtimes: '',
      options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-label',
              ticks: {
                beginAtZero: true
              },
              position: 'left',
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              id: 'x-axis-label',
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
    // this.fillData()
    EventBus.$on('clicked-event_TimeLineSearch', timelineResult => {
      this.items = timelineResult

      // get selected time list & date from timeline search  - from store
      this.selectedtimes = this.$store.state.timeLinesearchtimes
      this.selecteddate = this.$store.state.timeLinesearchdate
      this.fillChartData()
    })
  },
  methods: {
    fillData () {
      // console.log('filldata for barchart')
      this.datacollection = {
        labels: ['Time'],
        datasets: [
          {
            label: 'Area 1',
            backgroundColor: '#f87979',
            data: ['0:00']
          }
        ]
      }
    },
    fillChartData () {
      if (this.items.length > 0) {
        const dataset = []

        for (let i = 0; i < this.items.length; i++) {
          // check if the item's people has -1, then ignore that item, go to next item
          if (parseInt(this.items[i].people) === -1) {
            continue
          }

          // Area
          let datasetindex = -1
          for (let j = 0; j < dataset.length; j++) {
            if (dataset[j].areatoname === '(' + this.items[i].areatocode + ') ' + this.items[i].areatoname) {
              datasetindex = j
              break
            }
          }
          // time
          let timeindex = -1
          for (let k = 0; k < this.selectedtimes.length; k++) {
            if (this.datetimeFormatLocal(this.selectedtimes[k]) === this.utcToLocaldatetimeFormat(this.items[i].datetime)) {
              timeindex = k
              break
            }
          }
          if (timeindex === -1) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          }
          if (datasetindex === -1) {
            dataset.push({
              areatoname: '(' + this.items[i].areatocode + ') ' + this.items[i].areatoname,
              people: new Array(this.selectedtimes.length).fill(0)
            })
            dataset[dataset.length - 1].people[timeindex] = parseInt(this.items[i].people)
          } else {
            dataset[datasetindex].people[timeindex] = parseInt(dataset[datasetindex].people[timeindex]) + parseInt(this.items[i].people)
          }
        }

        // sort dataset by area name - ascending order
        dataset.sort((a, b) => (a.areatoname > b.areatoname ? 1 : -1))

        const barchartdataset = []
        for (let t = 0; t < dataset.length; t++) {
          barchartdataset.push({
            label: dataset[t].areatoname,
            backgroundColor: this.colorGenerator(),
            data: dataset[t].people
          })
        }

        this.datacollection = {
          labels: this.selectedtimes,
          datasets: barchartdataset
        }
      } else {
        this.fillData()
      }
    },
    colorGenerator () {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    },
    // 'YYYY-MM-DD 00:00:00'
    datetimeFormatLocal (time) {
      var date = new Date(this.selecteddate + ' ' + time)
      if (date) {
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
    // convert utc date to local system date - 'YYYY-MM-DD hh:mm:ss'
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
    }
  }
}
</script>

<style>
</style>
