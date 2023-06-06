<template>
  <v-container>
    <form autocomplete="on" @submit.prevent="onTimeLineSearch">
      <h2 align="left">Times &amp; Date</h2>
      <v-layout row wrap justify-space-between>
        <!-- Time1 -->
        <v-flex xs12 md2>
          <v-menu
            ref="menu"
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="0"
            :return-value.sync="time1"
            lazy
            transition="scale-transition"
            offset-y
            min-width="290px"
            no-title
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                color="#408280"
                v-model="time1"
                label="Start Time"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu1"
              v-model="time1"
              format="24hr"
              full-width
              :allowed-minutes="allowedStep"
              @click:minute="$refs.menu.save(time1)"
              no-title
              color="#408280"
            ></v-time-picker>
          </v-menu>
        </v-flex>

        <!-- Time2 -->
        <v-flex xs12 md4>
          <v-menu
            ref="menu2"
            v-model="menu3"
            :close-on-content-click="false"
            :nudge-right="0"
            :return-value.sync="time2"
            lazy
            transition="scale-transition"
            offset-y
            min-width="290px"
            no-title
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                color="#408280"
                v-model="time2"
                label="End Time"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu3"
              v-model="time2"
              format="24hr"
              full-width
              :allowed-minutes="allowedStep"
              @click:minute="$refs.menu2.save(time2)"
              no-title
              color="#408280"
            ></v-time-picker>
          </v-menu>
        </v-flex>

        <!-- Date -->
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

        <!-- Start Area -->
        <v-flex>
          <h2 align="left">Area From</h2>
          <p v-if="error" class="errortxt">{{ error }}</p>
          <v-select
            color="#408280"
            label="Area"
            v-model="select"
            :items="startAreas"
            prepend-icon="place"
            :rules="[v => !!v || 'Area is required']"
            required
          >
            <template slot="selection" slot-scope="startAreas">{{ startAreas.item.name }}</template>
            <template slot="item" slot-scope="startAreas">{{ startAreas.item.name }}</template>
          </v-select>
        </v-flex>
      </v-layout>

      <!-- End Area -->
      <br />
      <h2 align="left">Areas To</h2>
      <v-flex xs11>
        <TreeViewArea searchname="TimeLine" />
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
import moment from 'moment'
export default {
  name: 'TimeLineSearch',
  components: {
    TreeViewArea
  },
  data () {
    return {
      select: null,
      time1: '07:00',
      time2: '10:00',
      allowedStep: m => m % 5 === 0,
      menu: false,
      menu1: false,
      menu2: false,
      menu3: false,
      // date: new Date().toISOString().substr(0, 10),
      date: new Date('2019-04-24').toISOString().substr(0, 10),
      error: '',
      selection: [],
      startAreas: [],
      startDate: new Date('2019-04-22').toISOString().substr(0, 10),
      endDate: new Date('2019-04-26').toISOString().substr(0, 10)
    }
  },
  created () {
    // get composite area
    areaRests.fetchCompositeArea(28).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        this.startAreas.push(response.data[i].areadto)
      }
    })
  },
  mounted() {
    EventBus.$on('clicked-createBookmark_Timeline', bookmarkname => {
      this.onCreateBookmark(bookmarkname)
    })
    EventBus.$on('clicked-selectedBookmark_Timeline', selectedBookmark => {
      this.onSelectHistorySearch(selectedBookmark)
    })
    EventBus.$on('clicked-selectedHistory_Timeline', selectedHistorySearch => {
      this.onSelectHistorySearch(selectedHistorySearch)
    })
  },
  methods: {
    scrollTop () {
      var element = document.getElementById('TimeLine')
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
    onTimeLineSearch () {
      this.error = ''

      // check 'Area From' selected or not
      if (this.select != null) {
        // remove  area borders in map - emit to heatmapTimeLine.vue
        EventBus.$emit('clicked-removecoordinates_timeline', 'remove')
        // add  area borders in map - emit to heatmapTimeLine.vue
        EventBus.$emit('clicked-getareageometry_timeline', this.select.geometryid)

        // get times between start and end time
        const timeList = this.getTimeList(this.time1, this.time2)
        // store timelist, date & selected 'Area From' to get in tableTimeLine.vue & barchartTimeLine.vue & heatmap
        this.$store.state.timeLinesearchtimes = timeList
        this.$store.state.timeLinesearchdate = this.date
        this.$store.state.timeLinesearcharea = this.select.name

        // get the selected 'Areas To' list from the store.
        // this.selection = this.$store.state.s_selection
        this.selection = this.$store.state.s_selectionTimeLine

        // check 'Areas To' selected or not
        if (this.selection.length > 0) {
          // collect the selected Areas To ids.
          const toAreaId = []
          for (const selected of this.selection) {
            toAreaId.push(selected.id)
          }
          // get the selected date & times convert to UTC date
          var datetl = []
          datetl.push(this.localToUTCdate(this.date, this.time1))
          datetl.push(this.localToUTCdate(this.date, this.time2))

          // dispatch to get time line search result by passing parameters (datetl, start area & end area list)
          this.$store.dispatch('timelinesearch/get_timelinesearch_result', {
            date: datetl,
            fromAreaId: this.select.id,
            toAreaId: toAreaId
          })

          // create History Search
          // this.$timeline_timeline is restserviceid for Timeline search - global variable declared in main.js
          this.$store.dispatch('searchhistory/create_SearchHistory', {
            Bookmarkname: this.historyCreatedDatetime(),
            SearchRequest: {
              Date: this.date,
              startTime: this.time1,
              endTime: this.time2,
              fromArea: this.select,
              toArea: this.selection
            },
            restserviceid: this.$timeline_timeline
          })
        } else {
          this.error = 'Please select Areas To'
        }
      } else {
        this.error = 'Please select Area From'
      }
    },
    localToUTCdate (date, time) {
      var timeString = time + ':00'
      var datec = new Date(date + ' ' + timeString)
      if (datec) {
        return (
          datec.getUTCFullYear() +
          '-' +
          ('0' + (datec.getUTCMonth() + 1)).slice(-2) +
          '-' +
          ('0' + datec.getUTCDate()).slice(-2) +
          ' ' +
          ('0' + datec.getUTCHours()).slice(-2) +
          ':' +
          ('0' + datec.getUTCMinutes()).slice(-2) +
          ':00'
        )
      }
    },
    getTimeList (startTime, endTime) {
      var start = moment(startTime, 'hh:mm')
      var end = moment(endTime, 'hh:mm')
      var result = []
      while (start <= end) {
        result.push(start.format('HH:mm'))
        start.add(15, 'minutes')
      }
      return result
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
    },
    onCreateBookmark (bookmarkname) {
      // create Bookmark
      // check 'Area From' selected or not
      if (this.select != null) {
        // get the selected 'Areas To' list from the store.
        this.selection = this.$store.state.s_selectionTimeLine

        // check 'Areas To' selected or not
        if (this.selection.length > 0) {
          // this.$timeline_timeline is restserviceid for Timeline search - global variable declared in main.js
          this.$store.dispatch('searchhistory/create_Bookmark', {
            Bookmarkname: bookmarkname,
            SearchRequest: {
              date: this.date,
              startTime: this.time1,
              endTime: this.time2,
              fromArea: this.select,
              toArea: this.selection
            },
            restserviceid: this.$timeline_timeline
          })
        } else {
          this.error = 'Please select Areas To'
        }
      } else {
        this.error = 'Please select Area from'
      }
    },
    onSelectHistorySearch (selectedHistory) {
      const searchreq = JSON.parse(selectedHistory.searchrequest)

      // assign value to the search
      this.date = searchreq.date
      this.time1 = searchreq.startTime
      this.time2 = searchreq.endTime
      this.select = searchreq.fromArea
      this.$store.state.s_selectionTimeLine = searchreq.toArea

      // show selected AreasFrom in Treeview component
      EventBus.$emit('selectedAreasTo_History_Timeline', searchreq.toArea)
    }
  }
}
</script>

<style></style>
