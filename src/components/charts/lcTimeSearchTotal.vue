<template>
  <div>
    <line-chart id="chart" :chart-data="datacollection1"  :options="options"></line-chart>
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
      datacollection1: null,
      items: [],
      selecteddatetimes: [],
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
                display: true
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
    EventBus.$on('timesearchtotal_event', timesearchtotalResult => {
      this.items = timesearchtotalResult

      this.fillChartData()
    })
  },
  methods: {
    createLineChart () {
      this.datacollection1 = {
        labels: ['DateTime 1', 'DateTime 2', 'DateTime 3'],
        datasets: [
          {
            label: 'Areas',
            borderColor: '#f87979',
            data: [0, 0, 0]
          }
        ]
      }
    },
    fillChartData () {
      
      if (this.items.length > 0) {
        console.log('this.items:',this.items)
        // get datetime from items -- unique dates -- sort dates
        const selected = []
        for (let d = 0; d < this.items.length; d++) {
          selected.push(this.utcToLocaldatetimeFormat(this.items[d].datetime))
        }
        const uniquedataselected = new Set(selected)
        this.selecteddatetimes = [...uniquedataselected]

        // sort datetime - ascending order
        var datesortasc = function (date1, date2) {
          if (date1 > date2) return 1
          if (date1 < date2) return -1
          return 0
        }
        this.selecteddatetimes.sort(datesortasc)

        // prepare chartdataset from the result items
        const chartdataset = []
        for (let i = 0; i < this.items.length; i++) {
          // area - dataset index
          let datasetindex = -1
          for (let j = 0; j < chartdataset.length; j++) {
            if (
              chartdataset[j].area ===
              '(' + this.items[i].areacode + ') ' + this.items[i].areaname
            ) {
              datasetindex = j
              break
            }
          }

          // date index
          let dateindex = -1
          for (let k = 0; k < this.selecteddatetimes.length; k++) {
            if (
              this.selecteddatetimes[k] ===
              this.utcToLocaldatetimeFormat(this.items[i].datetime)
            ) {
              dateindex = k
              break
            }
          }
          if (dateindex === -1) {
            console.log(
              '!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!'
            )
          }
          if (datasetindex === -1) {
            chartdataset.push({
              area:
                '(' + this.items[i].areacode + ') ' + this.items[i].areaname,
              people: new Array(this.selecteddatetimes.length).fill(0)
            })
            chartdataset[chartdataset.length - 1].people[dateindex] = parseInt(
              this.items[i].people
            )
          } else {
            chartdataset[datasetindex].people[dateindex] =
              parseInt(chartdataset[datasetindex].people[dateindex]) +
              parseInt(this.items[i].people)
          }
        }

        // Prepare linechartdatesets - get data(area, people) from chartdataset & add to label, data and set other properties.
        const linechartdataset = []
        for (let t = 0; t < chartdataset.length; t++) {
          linechartdataset.push({
            label: chartdataset[t].area,
            borderColor: this.colorGenerator(),
            data: chartdataset[t].people,
            fill: false
          })
        }

        // add linechartdatesets & datetimes to datacollection1 to show in chart
        this.datacollection1 = {
          labels: this.selecteddatetimes,
          datasets: linechartdataset
        }
      }
      // else {
      //   this.createLineChart();
      // }
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
    },
    colorGenerator () {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    }
  }
}
</script>

<style>
</style>
