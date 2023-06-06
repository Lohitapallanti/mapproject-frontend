<template>
  <v-container v-if="this.items.length > 0">
    <v-data-table
      :headers="getHeaders()"
      :items="getItems()"
      hide-actions
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.datetime}}</td>
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
  data() {
    return {
      items: [],
      selecteddates: [],
      selectionAreaFrom: [],
      exportData: [],
      exportCVSbtn: false,
      showTable: false
    }
  },

  mounted() {
    EventBus.$on('timesearchtotal_event', timesearchtotalResult => {
      this.items = timesearchtotalResult

      // get selected date list & areasFrom from timesearchtotal  - from store
      // this.selecteddates = this.$store.state.timesearchtotaldates
      this.selectionAreaFrom = this.$store.state.s_STimeSeachTotal
    })
  },
  computed: {
    csvData() {
      const areas = []
      for (const selectedArea of this.selectionAreaFrom) {
        areas.push('(' + selectedArea.code + ') ' + selectedArea.name)
      }
      return this.exportData.map(item => ({
        DateTime: item.datetime,
        [areas]: item.people
      }))
    }
  },
  methods: {
    getHeaders() {
      if (this.items.length > 0) {
        // get the list of selected areas
        const areas = []
        for (const selectedArea of this.selectionAreaFrom) {
          areas.push({
            text: '(' + selectedArea.code + ') ' + selectedArea.name,
            sortable: false,
            value: ' '
          })
        }

        // add Datetime name
        areas.unshift({
          text: 'DateTime',
          align: 'left',
          sortable: false,
          value: ''
        })

        return areas
      } else {
        return [
          { text: 'DateTime', align: 'left', sortable: false, value: '' },
          { text: 'Areas', sortable: false, value: '' }
        ]
      }
    },
    getItems() {
      if (this.items.length > 0) {
        const tabledataset = []
        for (let i = 0; i < this.items.length; i++) {
          // dateime index
          let datasetindex = -1
          for (let j = 0; j < tabledataset.length; j++) {
            if (
              tabledataset[j].datetime ===
              this.utcToLocaldatetimeFormat(this.items[i].datetime)
            ) {
              datasetindex = j
              break
            }
          }

          // area index
          let areaindex = -1
          for (let k = 0; k < this.selectionAreaFrom.length; k++) {
            if (
              '(' +
                this.selectionAreaFrom[k].code +
                ') ' +
                this.selectionAreaFrom[k].name ===
              '(' + this.items[i].areacode + ') ' + this.items[i].areaname
            ) {
              areaindex = k
              break
            }
          }
          if (areaindex === -1) {
            console.log(
              '!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
            )
          }
          if (datasetindex === -1) {
            tabledataset.push({
              datetime: this.utcToLocaldatetimeFormat(this.items[i].datetime),
              people: new Array(this.selectionAreaFrom.length).fill(0)
            })
            tabledataset[tabledataset.length - 1].people[areaindex] = parseInt(
              this.items[i].people
            )
          } else {
            tabledataset[datasetindex].people[areaindex] =
              parseInt(tabledataset[datasetindex].people[areaindex]) +
              parseInt(this.items[i].people)
          }
        }

        // sort tabledataset by area name - ascending order
        tabledataset.sort((a, b) => (a.datetime > b.datetime ? 1 : -1))

        this.exportData = tabledataset
        this.exportCVSbtn = true
        this.showTable = true
        return tabledataset
      } else {
        this.exportCVSbtn = false
      }
    },
    // convert utc date to local system date - 'YYYY-MM-DD hh:mm:ss'
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
          ('0' + utctolocal.getHours()).slice(-2) +
          ':' +
          ('0' + utctolocal.getMinutes()).slice(-2) +
          ':' +
          ('0' + utctolocal.getSeconds()).slice(-2)
        )
      }
    },

    // Export table data
    csvExport(arrData) {
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
      link.setAttribute('download', 'export_TimeSearchTotal.csv')
      link.click()
    }
  }
}
</script>

<style>
</style>
