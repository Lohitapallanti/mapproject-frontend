<template>
  <v-container v-if="this.items.length > 0">
    <v-data-table
      dense
      :headers="getHeaders()"
      :items="getItems()"
      hide-actions
      class="elevation-1 "
    >
      <!--hide-actions-->
      <template v-if="getHeaders()" slot="headers" slot-scope="row">
        <tr>
          <th
          class="pointer"
            v-for="header in row.headers"
            :key="header.text"
            @click="gethoursdetails(header.value)"
          >{{ header.text }}</th>
        </tr>
      </template>

      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.country }}</td>
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
  name: 'tableDwell',
  data () {
    return {
      items: [],
      exportData: [],
      exportCVSbtn: false,
      selecteddwelltimedates: [],
      dialog2: false
    }
  },
  computed: {
    csvData () {
      const dates = []
      for (const selecteddate of this.selecteddwelltimedates) {
        dates.push(this.datetimeFormat(selecteddate))
      }

      return this.exportData.map(item => ({
        Countryname: item.country,
        [dates]: item.people
      }))
    }
  },
  mounted () {
    EventBus.$on('clicked-event_dwelltime', dwelltimeResult => {
      this.items = dwelltimeResult

      // get selected date list from dwell time search  - from store
      this.selecteddwelltimedates = this.$store.state.dwelltimesearchdates
    })
  },
  methods: {
    getHeaders () {
      if (this.items.length > 0) {
        // get the list of selected dates
        const dates = []
        for (const selecteddate of this.selecteddwelltimedates) {
          dates.push({
            text: '' + this.datetimeFormat(selecteddate) + '',
            sortable: false,
            value: '' + selecteddate + ''
          })
        }

        // add country name
        dates.unshift({
          text: 'Country name',
          align: 'left',
          sortable: false,
          value: ''
        })

        return dates
      } else {
        return [
          { text: 'Country name', align: 'left', sortable: false, value: '' },
          { text: 'Date', sortable: false, value: '' }
        ]
      }
    },
    getItems () {
      if (this.items.length > 0) {
        const tabledataset = []

        for (let i = 0; i < this.items.length; i++) {
          // check if the item's people has -1, then ignore that item, go to next item
          if (parseInt(this.items[i].people) === -1) {
            continue
          }

          // country
          let datasetindex = -1
          for (let j = 0; j < tabledataset.length; j++) {
            if (tabledataset[j].country === this.items[i].country) {
              datasetindex = j
              break
            }
          }
          // date
          let dateindex = -1
          for (let k = 0; k < this.selecteddwelltimedates.length; k++) {
            if (this.datetimeFormatLocal(this.selecteddwelltimedates[k]) === this.utcToLocaldatetimeFormat(this.items[i].date)) {
              dateindex = k
              break
            }
          }
          if (dateindex === -1) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          }
          if (datasetindex === -1) {
            tabledataset.push({
              country: this.items[i].country,
              people: new Array(this.selecteddwelltimedates.length).fill(0)
            })
            tabledataset[tabledataset.length - 1].people[dateindex] = parseInt(this.items[i].people)
          } else {
            tabledataset[datasetindex].people[dateindex] = parseInt(tabledataset[datasetindex].people[dateindex]) +
              parseInt(this.items[i].people)
          }
        }

        // sort tabledataset by country name - ascending order
        tabledataset.sort((a, b) => (a.country > b.country ? 1 : -1))

        // set tabledataset to exportData
        this.exportData = tabledataset
        this.exportCVSbtn = true

        return tabledataset
      } else {
        this.exportCVSbtn = false
      }
    },
    gethoursdetails (date) {
      if (this.items.length > 0) {
        // get hours list
        const arrayhrlist = this.getHoursList()

        // store the hours list to get in tableDwellHr.vue
        this.$store.state.dwelltimesearch.dwellhourslist = arrayhrlist

        const tablehoursdataset = []
        for (let i = 0; i < this.items.length; i++) {
          // compare each items date with the clicked date, If not same, continue(compare with the next item).
          if (this.datetimeFormatLocal(date) !== this.utcToLocaldatetimeFormat(this.items[i].date)) {
            continue
          }

          let datasetindex = -1
          for (let j = 0; j < tablehoursdataset.length; j++) {
            if (tablehoursdataset[j].country === this.items[i].country) {
              datasetindex = j
              break
            }
          }
          let dateindex = -1

          for (let k = 0; k < arrayhrlist.length; k++) {
            if (arrayhrlist[k] === this.items[i].min + ' - ' + this.items[i].max) {
              dateindex = k
              break
            }
          }
          if (dateindex === -1) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
          }
          if (datasetindex === -1) {
            tablehoursdataset.push({
              country: this.items[i].country,
              people: new Array(arrayhrlist.length).fill(0)
            })
            tablehoursdataset[tablehoursdataset.length - 1].people[dateindex] = parseInt(this.items[i].people)
          } else {
            tablehoursdataset[datasetindex].people[dateindex] = parseInt(this.items[i].people)
          }
        }

        // sort tablehoursdataset by country name - ascending order
        tablehoursdataset.sort((a, b) => (a.country > b.country ? 1 : -1))

        // send the 'tablehoursdataset' to tabledwellhr.
        EventBus.$emit('clicked-event_dwellhr', tablehoursdataset)
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
    // Date formating - to get only date 'DD-MM-YYYY'
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
      link.setAttribute('download', 'export_Dwell.csv')
      link.click()
    },
    getHoursList () {
      // get the min max hours list from items
      const hrlist = []
      for (let i = 0; i < this.items.length; i++) {
        var minmaxitem = this.items[i].min + ' - ' + this.items[i].max
        hrlist.push(minmaxitem)
      }

      // remove duplicates from the list using set
      const newhrlist = new Set(hrlist)

      // convert the set to array
      const arraylist = [...newhrlist]

      // sort the hr list
      arraylist.sort(function (a, b) {
        var x = a.substr(0, a.indexOf('-'))
        var y = b.substr(0, b.indexOf('-'))
        return x - y
      })

      return arraylist
    }
  }
}
</script>

<style> 
.pointer {cursor: pointer;}
</style>
