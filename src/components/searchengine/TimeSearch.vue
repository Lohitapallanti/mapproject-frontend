<template>
  <v-container>
    <!-- <a name="top"></a> -->
    <form autocomplete="on" @submit.prevent="onSearch">
      <!-- Search/Submit Button -->
      <v-flex xs4 offset-xs7>
        <!-- <v-btn
         block
         dark
         type="submit"
         color="#408280"
         style="font-size : 16px;">
         <b>Search</b>
        </v-btn> -->
      </v-flex>
      <h2 align="left">Time &amp; Date</h2>
      <v-layout row wrap justify-space-between>
        <!-- Time -->
        <v-flex xs12 md2>
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="0"
            :return-value.sync="time"
            lazy
            transition="scale-transition"
            offset-y
            min-width="290px"
            no-title
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                color="#408280"
                v-model="time"
                label="Time"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time"
              format="24hr"
              full-width
              :allowed-minutes="allowedStep"
              @click:minute="$refs.menu.save(time)"
              no-title
              color="#408280"
            ></v-time-picker>
          </v-menu>
        </v-flex>

        <!-- Date1 -->
        <v-flex xs12 md4>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-text-field
                color="#408280"
                v-model="date"
                label="Date"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              width="250px"
              color="#408280"
              v-model="date"
              no-title
              :min="startDate"
              :max="endDate"
            ></v-date-picker>
          </v-menu>
        </v-flex>

        <!-- Date2 -->
        <v-flex xs12 md4>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-text-field
                color="#408280"
                v-model="date1"
                label="Date"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              width="250px"
              color="#408280"
              v-model="date1"
              no-title
              :min="startDate1"
              :max="endDate1"
            ></v-date-picker>
          </v-menu>
        </v-flex>

        <!-- Start Area -->
        <v-flex>
          <p v-if="error" class="errortxt">{{ error }}</p>
          <h2 align="left">Areas From</h2>
          <TreeViewArea searchname="Time" />
        </v-flex>
      </v-layout>

      <!-- End Area -->
      <br />
      <h2 align="left">Area To</h2>
      <v-flex xs11>
        <v-select
          color="#408280"
          label="Area"
          v-model="select"
          :items="endAreas"
          prepend-icon="place"
          :rules="[v => !!v || 'Area is required']"
          required
        >
          <template slot="selection" slot-scope="endAreas">{{
            endAreas.item.name
          }}</template>
          <template slot="item" slot-scope="endAreas">{{
            endAreas.item.name
          }}</template>
        </v-select>
      </v-flex>

      <!-- Search/Submit Button -->
      <v-flex xs4 offset-xs7>
        <v-btn
          block
          dark
          type="submit"
          color="#408280"
          style="font-size : 16px;"
          @click="scrollTop"
        >
          <b>Search</b>
        </v-btn>
      </v-flex>
    </form>
  </v-container>
</template>

<script>
import TreeViewArea from '@/components/searchengine/TreeViewArea.vue'
import { EventBus } from '@/event-bus.js'
import areaRests from '@/api/api_area.js'
export default {
  name: 'TimeSearch',
  components: {
    TreeViewArea
  },
  data () {
    return {
      select: null,
      time: '10:00',
      allowedStep: m => m % 5 === 0,
      menu2: false,
      menu: false,
      // date: new Date().toISOString().substr(0, 10),
      // date1: new Date().toISOString().substr(0, 10),
      date: new Date('2019-02-25').toISOString().substr(0, 10),
      date1: new Date('2019-02-26').toISOString().substr(0, 10),
      error: '',
      selection: [],
      endAreas: [],
      startDate: new Date('2019-02-25').toISOString().substr(0, 10),
      endDate: new Date('2019-04-15').toISOString().substr(0, 10),
      startDate1: new Date('2019-02-25').toISOString().substr(0, 10),
      endDate1: new Date('2019-04-15').toISOString().substr(0, 10)
    }
  },
  created () {
    // get composite area
    areaRests.fetchCompositeArea(27).then(response => {
      /* for (let i = 0; i < response.data.length; i++) {
        this.endAreas.push(response.data[i].areadto)
      } */
      var obj = {}
      for (let i = 0; i < response.data.length; i++) {
        obj[response.data[i].areadto['id']] = response.data[i].areadto
      }

      for (var key in obj) {
        this.endAreas.push(obj[key])
      }
    })
  },
  mounted () {
    EventBus.$on('clicked-createBookmark_Time', bookmarkname => {
      this.onCreateBookmark(bookmarkname)
    })
    EventBus.$on('clicked-selectBookmark_Time', selectedBookmark => {
      this.onSelectHistorySearch(selectedBookmark)
    })
    EventBus.$on('clicked-selectSearchHistory_Time', selectedHistorySearch => {
      this.onSelectHistorySearch(selectedHistorySearch)
    })
  },
  methods: {
    scrollTop () {
      var element = document.getElementById('Time')
      var iconElement = element.getElementsByTagName('i')[0]
      iconElement.classList.remove('v-treeview-node__toggle--open')

      const abc = document.querySelectorAll('.v-treeview-node__children ')
      abc.forEach(el => el.remove())

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    // Search method
    onSearch () {
      this.error = ''
      // store dates &time to get in table.vue & barchart.vue & GoogleMap.vue
      this.$store.state.timesearchdate1 = this.date
      this.$store.state.timesearchdate2 = this.date1
      this.$store.state.timesearchtime = this.time

      // check 'Area To' selected or not
      if (this.select != null) {
        EventBus.$emit('clicked-removecoordinates', 'test')

        // get the selected area list from the store.
        this.selection = this.$store.state.s_selection

        // check 'Area From' selected or not
        if (this.selection.length > 0) {
          const fromAreaId = []
          for (const selected of this.selection) {
            fromAreaId.push(selected.id)
          }

          // get the selected 2 dates, convert to UTC date with selected Time
          var date = this.localToUTCdate(this.date)
          var date1 = this.localToUTCdate(this.date1)
          // dispatch to get time search result by passing parameters (date, date1, AreaFrom list & AreaTo)
          this.$store.dispatch('timesearch/get_timesearch_result', {
            date: date,
            date1: date1,
            fromAreaId: fromAreaId,
            toAreaId: this.select.id
          })

          // create History Search
          // this.$timetime is restserviceid for Time search - global variable declared in main.js
          this.$store.dispatch('searchhistory/create_SearchHistory', {
            Bookmarkname: this.historyCreatedDatetime(),
            SearchRequest: {
              Time: this.time,
              Date1: this.date,
              Date2: this.date1,
              AreaFrom: this.selection,
              AreaTo: this.select
            },
            restserviceid: this.$timetime
          })
        } else {
          this.error = 'Please select Areas From'
        }
      } else {
        this.error = 'Please select Area To'
      }
    },
    localToUTCdate (datetime) {
      var timeString = this.time + ':00'
      var date = new Date(datetime + ' ' + timeString)
      if (datetime) {
        return (
          date.getUTCFullYear() +
          '-' +
          ('0' + (date.getUTCMonth() + 1)).slice(-2) +
          '-' +
          ('0' + date.getUTCDate()).slice(-2) +
          ' ' +
          date.getUTCHours() +
          ':' +
          date.getUTCMinutes() +
          ':00'
        )
      }
    },
    onCreateBookmark (bookmarkname) {
      // create Bookmark
      // check 'Area To' selected or not
      if (this.select != null) {
        // get the selected area list from the store.
        this.selection = this.$store.state.s_selection
        // check 'Area From' selected or not
        if (this.selection.length > 0) {
          // this.$timetime is restserviceid for Time search - global variable declared in main.js
          this.$store.dispatch('searchhistory/create_Bookmark', {
            Bookmarkname: bookmarkname,
            SearchRequest: {
              Time: this.time,
              Date1: this.date,
              Date2: this.date1,
              AreaFrom: this.selection,
              AreaTo: this.select
            },
            restserviceid: this.$timetime
          })
        } else {
          this.error = 'Please select Areas From'
        }
      } else {
        this.error = 'Please select Area To'
      }
    },
    onSelectHistorySearch (selectedHistory) {
      const searchreq = JSON.parse(selectedHistory.searchrequest)

      // assign value to the search
      this.date = searchreq.Date1
      this.date1 = searchreq.Date2
      this.time = searchreq.Time
      this.$store.state.s_selection = searchreq.AreaFrom
      this.select = searchreq.AreaTo

      // show selected AreasFrom in Treeview component
      EventBus.$emit('selectedAreasFrom_History_Time', searchreq.AreaFrom)
    },
    // current dateTime - parse from local to UTC
    historyCreatedDatetime () {
      let date = new Date()
      return (
        date.getUTCFullYear() +
        '-' +
        ('0' + (date.getUTCMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getUTCDate()).slice(-2) +
        ' ' +
        ('0' + date.getUTCHours()).slice(-2) +
        ':' +
        ('0' + date.getUTCMinutes()).slice(-2) +
        ':' +
        ('0' + date.getSeconds()).slice(-2)
      )
    }
  }
}
</script>

<style>
.errortxt {
  /* text-transform: uppercase; */
  color: red;
  font-size: 18px;
}
</style>
