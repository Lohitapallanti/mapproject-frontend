<template>
  <v-container v-if="date1">
    <v-data-table :headers="getHeaders()" :items="getItems()" hide-actions class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.areaname }}</td>
        <td class="text-xs-left">{{ props.item.people}}</td>
        <td class="text-xs-left">{{ props.item.people1}}</td>
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
// import { mapState } from 'vuex'
import { EventBus } from '@/event-bus.js'
export default {
  name: 'tableMA',
  data() {
    return {
      items: [],
      exportData: [],
      exportCVSbtn: false,
      date1: '',
      date2: '',
      time: ''
    }
  },
  computed: {
    csvData() {
      var Date1 = this.datetimeFormat(this.date1)
      var Date2 = this.datetimeFormat(this.date2)
      return this.exportData.map(item => ({
        Areaname: item.areaname,
        [Date1]: item.people,
        [Date2]: item.people1
      }))
    }
  },
  /* computed: {
    ...mapState({
      items: state => state.timesearch.timeSearchResult
    })
  }, */
  mounted() {
    EventBus.$on('clicked-event', timeSearchResult => {
      this.items = timeSearchResult

      // get selected dates & time from time search store
      this.date1 = this.$store.state.timesearchdate1
      this.date2 = this.$store.state.timesearchdate2
      this.time = this.$store.state.timesearchtime
    })
  },
  methods: {
    getHeaders() {
      if (this.items.length > 0) {
        return [
          { text: 'Area name', align: 'left', sortable: false, value: '' },
          {
            text: '' + this.datetimeFormat(this.date1) + '',
            sortable: false,
            value: ''
          },
          {
            text: '' + this.datetimeFormat(this.date2) + '',
            sortable: false,
            value: ''
          }
        ]
      } else {
        return [
          { text: 'Area name', align: 'left', sortable: false, value: '' },
          { text: 'Date1', sortable: false, value: '' },
          { text: 'Date2', sortable: false, value: '' }
        ]
      }
    },
    getItems() {
      if (this.items.length > 0) {
        const tabledataset = []
        this.selection = this.$store.state.s_selection

        var selecteddate1 = this.datetimeFormatLocal(this.date1)
        var selecteddate2 = this.datetimeFormatLocal(this.date2)
        for (const selected of this.selection) {
          var area = ''
          var people1 = ''
          var people2 = ''

          for (let i = 0; i < this.items.length; i++) {
            var resultitemdate = this.utcToLocaldatetimeFormat(
              this.items[i].datetime
            )
            var resultitemcode = this.items[i].areacode

            if (
              selected.code === resultitemcode &&
              selecteddate1 === resultitemdate
            ) {
              area =
                '(' + this.items[i].areacode + ') ' + this.items[i].areaname
              people1 = this.items[i].people
            }

            if (
              selected.code === resultitemcode &&
              selecteddate2 === resultitemdate
            ) {
              area =
                '(' + this.items[i].areacode + ') ' + this.items[i].areaname
              people2 = this.items[i].people
            }
          }
          if (area !== '') {
            tabledataset.push({
              areaname: area,
              people: people1,
              people1: people2
            })
          }
        }

        // sort tabledataset by area name - ascending order
        tabledataset.sort((a, b) => (a.areaname > b.areaname ? 1 : -1))

        this.exportData = tabledataset
        this.exportCVSbtn = true
        return tabledataset
      } else {
        this.exportCVSbtn = false
      }
    },
    // Date & Time formating
    datetimeFormat(datetime) {
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
    utcToLocaldatetimeFormat(datetime) {
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
    },

    datetimeFormatLocal(datetime) {
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
    // Export table data
    csvExport(arrData) {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += [
        Object.keys(arrData[0]).join(';'),
        ...arrData.map(item => Object.values(item).join(';'))
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')

      const data = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', 'export_TimeSearch.csv')
      link.click()
    }
  }
}
</script>

<style>
</style>
