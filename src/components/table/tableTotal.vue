
<template>
  <v-container>
    <v-data-table
      dense
      :headers="getHeaders()"
      :items="getItems()"
      hide-actions
      class="elevation-1 mytable"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.Time }}</td>
        <td class="text-xs-left">{{ props.item.Date}}</td>
        <td class="text-xs-left">{{ props.item.Simcards}}</td>
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
// import { EventBus } from '@/event-bus.js'
export default {
  name: 'tableMA',
  data () {
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
    csvData () {
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

  methods: {
    getHeaders () {
      if (this.items.length > 0) {
        return [
          { text: 'Time', align: 'left', sortable: false, value: 'Time' },
          { text: 'Date', sortable: false, value: 'Date' },
          { text: 'Simcards', sortable: false, value: 'Simcards' }
          //   {
          //     text: '' + this.datetimeFormat(this.date1) + '',
          //     sortable: false,
          //     value: ''
          //   },
          //   {
          //     text: '' + this.datetimeFormat(this.date2) + '',
          //     sortable: false,
          //     value: ''
          //   }
        ]
      } else {
        return [
          { text: 'Time', sortable: false, value: 'Time' },
          { text: 'Date', sortable: false, value: 'Date' },
          { text: 'No. of Simcards', sortable: false, value: 'Simcards' }
        ]
      }
    },
    getItems () {
      if (this.items.length > 0) {
        return [
          {
            Time: 'Frozen Yogurt',
            Date: 159,
            Simcards: 6.0
          }
        ]
      } else {
        return [
          {
            Time: '12:00',
            Date: '07/03/2019',
            Simcards: '24182'
          },
          {
            Time: '12:30',
            Date: '07/03/2019',
            Simcards: '24315'
          },
          {
            Time: '01:00',
            Date: '07/03/2019',
            Simcards: '24231'
          },
          {
            Time: '01:30',
            Date: '07/03/2019',
            Simcards: '24004'
          },
          {
            Time: '02:00',
            Date: '07/03/2019',
            Simcards: '24102'
          },
          {
            Time: '02:30',
            Date: '07/03/2019',
            Simcards: '23868'
          },
          {
            Time: '03:00',
            Date: '07/03/2019',
            Simcards: '23765'
          },
          {
            Time: '03:30',
            Date: '07/03/2019',
            Simcards: '23620'
          },
          {
            Time: '04:00',
            Date: '07/03/2019',
            Simcards: '23363'
          },
          {
            Time: '04:30',
            Date: '07/03/2019',
            Simcards: '23119'
          },
          {
            Time: '05:00',
            Date: '07/03/2019',
            Simcards: '22983'
          },
          {
            Time: '05:30',
            Date: '07/03/2019',
            Simcards: '22890'
          },
          {
            Time: '06:00',
            Date: '09/03/2019',
            Simcards: '23070'
          },
          {
            Time: '06:30',
            Date: '08/03/2019',
            Simcards: '24182'
          },
          {
            Time: '07:00',
            Date: '08/03/2019',
            Simcards: '23323'
          },
          {
            Time: '07:30',
            Date: '08/03/2019',
            Simcards: '23852'
          },
          {
            Time: '08:00',
            Date: '08/03/2019',
            Simcards: '25097'
          },
          {
            Time: '08:30',
            Date: '08/03/2019',
            Simcards: '25377'
          },

          {
            Time: '09:00',
            Date: '09/03/2019',
            Simcards: '25565'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          },
          {
            Time: '09:30',
            Date: '09/03/2019',
            Simcards: '25894'
          }
        ]
      }
    }
  }
}
</script>

<style>
/* .mytable .v-table tbody tr:not(:last-child) { */
.mytable .v-table tbody tr td {
  /* background-color: #DED1CA; */
  background-color: #ffffef;
  color: #524d4a;
  font-size: 18px;
  /* background-color: lightgoldenrodyellow;
   border-bottom: none; */
}

.mytable .v-table th {
  background-color: #fff9e3;
  font-size: 20px;
  color: #524d4a;
  line-height: 3;
  /* text-transform: uppercase; */
}
</style>
