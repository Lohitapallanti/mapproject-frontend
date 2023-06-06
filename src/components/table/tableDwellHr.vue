<template>
  <v-container v-if="this.items.length > 0">
    <v-data-table
      :headers="getHeaders()"
      :items="items"
      hide-actions
      class="elevation-1 dwellhrtable"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.country }}</td>
        <td v-for="(item, index) in props.item.people" :key="index">{{ item }}</td>
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
  name: 'tableDwellHr',
  data () {
    return {
      items: [],
      exportData: [],
      exportCVSbtn: false
    }
  },
  computed: {
    csvData () {
      const hrslist = this.$store.state.dwelltimesearch.dwellhourslist

      const hrs = []
      for (const selectedhr of hrslist) {
        hrs.push(selectedhr)
      }
      return this.exportData.map(item => ({
        Countryname: item.country,
        [hrs]: item.people
      }))
    }
  },

  mounted () {
    EventBus.$on('clicked-event_dwellhr', tablehrdataset => {
      this.items = tablehrdataset

      if (this.items.length > 0) {
        // set tablehrdataset to exportData
        this.exportData = tablehrdataset
        this.exportCVSbtn = true
      }
    })
  },
  methods: {
    getHeaders () {
      // get the list of hrs from store
      const hrslist = this.$store.state.dwelltimesearch.dwellhourslist

      const hrs = []
      for (const selectedhr of hrslist) {
        hrs.push({
          text: '' + selectedhr + '',
          sortable: false,
          value: ' '
        })
      }

      // add country name
      hrs.unshift({
        text: 'Country name',
        align: 'left',
        sortable: false,
        value: ''
      })

      return hrs
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
      link.setAttribute('download', 'export_DwellHours.csv')
      link.click()
    }
  }
}
</script>

<style>
.dwellhrtable .v-table tbody tr td {
  background-color: #ffffef;
  color: #524d4a;
  font-size: 18px;
}

.dwellhrtable .v-table th {
  background-color: #fff9e3;
  font-size: 20px;
  color: #524d4a;
  line-height: 3;
}

.dwellhrtable .v-table tbody tr:hover td {
  background-color:#f2f2f2;
}  
</style>
