<template>
  <v-container v-if="this.items.length > 0">
    <v-data-table
      dense
      :headers="getHeaders()"
      :items="getItems()"
      hide-actions
      class="elevation-1 tlstable"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.areatoname }}</td>
        <td v-for="(item,index) in props.item.people" :key="index">{{ item }}</td>
      </template>
    </v-data-table>
    <v-flex xs4 offset-xs7>
      <v-btn
        v-if="exportCVSbtn"
        block
        class="black--text"
        @click="csvExport(csvData)"
        style="font-size : 14px;"
      >
        <b>Export to CSV</b>
      </v-btn>
    </v-flex>
  </v-container>
</template>

<script>
import { EventBus } from '@/event-bus.js'

export default {
  name: 'tableTimeLine',
  data () {
    return {
      items: [],
      exportData: [],
      exportCVSbtn: false,
      selectedtimes: [],
      selecteddate: ''
    }
  },
  computed: {
    csvData () {
      return this.exportData.map(item => ({
        Areaname: item.areatoname,
        [this.selectedtimes]: item.people
      }))
    }
  },
  mounted () {
    EventBus.$on('clicked-event_TimeLineSearch', timelineResult => {
      this.items = timelineResult

      // get selected time list & date from timeline search  - from store
      this.selectedtimes = this.$store.state.timeLinesearchtimes
      this.selecteddate = this.$store.state.timeLinesearchdate
    })
  },
  methods: {
    getHeaders () {
      if (this.items.length > 0) {
        // get the list of selected dates
        const times = []
        for (const selectedtime of this.selectedtimes) {
          times.push({
            text: '' + selectedtime + '',
            sortable: false,
            value: ''
          })
        }

        // add Area name
        times.unshift({
          text: 'Area name',
          align: 'left',
          sortable: false,
          value: ''
        })

        return times
      } else {
        return [
          { text: 'Area name', align: 'left', sortable: false, value: '' },
          { text: 'Times', sortable: false, value: '' }
        ]
      }
    },
    getItems () {
      if (this.items.length > 0) {
        const tabledataset = []

        for (let i = 0; i < this.items.length; i++) {
          // Area
          let datasetindex = -1
          for (let j = 0; j < tabledataset.length; j++) {
            if (tabledataset[j].areatoname === '(' + this.items[i].areatocode + ') ' + this.items[i].areatoname) {
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
            tabledataset.push({
              areatoname: '(' + this.items[i].areatocode + ') ' + this.items[i].areatoname,
              people: new Array(this.selectedtimes.length).fill(0)
            })
            tabledataset[tabledataset.length - 1].people[timeindex] = parseInt(this.items[i].people)
          } else {
            tabledataset[datasetindex].people[timeindex] = parseInt(this.items[i].people)
          }
        }

        // sort tabledataset by area name - ascending order
        tabledataset.sort((a, b) => (a.areatoname > b.areatoname ? 1 : -1))

        // set tabledataset to exportData
        this.exportData = tabledataset
        this.exportCVSbtn = true

        return tabledataset
      } else {
        this.exportCVSbtn = false
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
    // Export table data
    csvExport (arrData) {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += [
        Object.keys(arrData[0]).join(','),
        ...arrData.map(item => Object.values(item).join(','))
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')

      const data = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', 'export_TimeLine.csv')
      link.click()
    }
  }
}
</script>

<style>
.tlstable .v-table tbody tr td {
  background-color: #ffffef;
  color: #524d4a;
  font-size: 18px;
}

.tlstable .v-table th {
  background-color: #fff9e3;
  font-size: 20px;
  color: #524d4a;
  line-height: 3;
}

.tlstable .v-table tbody tr:hover td {
  background-color:#f2f2f2;
}
</style>
