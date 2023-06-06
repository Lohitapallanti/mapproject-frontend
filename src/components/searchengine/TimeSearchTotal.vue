<template>
  <v-container>
    <!-- <a name="top"></a> -->
    <form autocomplete="on" @submit.prevent="onTimeSearchTotal">
      <h2 align="left">Dates</h2>
      <!-- Date -->
      <v-flex>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-combobox
              v-model="dates"
              multiple
              chips
              small-chips
              label="Date"
              readonly
              v-on="on"
              prepend-icon="event"
              color="#408280"
            ></v-combobox>
          </template>
          <v-date-picker
            color="#408280"
            v-model="dates"
            multiple
            :show-current="showDate"
            type="date"
            no-title
            scrollable
            width="250px"
            :min="startDate"
            :max="endDate"
          >
            <div class="flex-grow-1"></div>
            <v-btn text color="#408280" dark @click="menu = false"
              >Cancel</v-btn
            >
            <v-btn text color="#408280" dark @click="$refs.menu.save(dates)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-flex>

      <!-- Start Area -->
      <v-flex>
        <p v-if="error" class="errortxt">{{ error }}</p>
        <h2 align="left">Areas From</h2>
        <TreeViewArea searchname="TimeSearchTotal" />
      </v-flex>

      <!-- End Area -->
      <br />
      <h2 align="left">Area To</h2>
      <v-flex xs11>
        <v-select
          color="#408280"
          label="Area"
          v-model="selectAreaTo"
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
import areaRests from '@/api/api_area.js'
import moment from 'moment'
import { EventBus } from '@/event-bus.js'
export default {
  name: 'TimeSearchTotal',
  components: {
    TreeViewArea
  },
  data () {
    return {
      selectAreaTo: null,
      selectionAreaFrom: [],
      error: '',
      endAreas: [],
      menu: false,
      // dates: [new Date().toISOString().substr(0, 10)],
      dates: [new Date('2019-02-25').toISOString().substr(0, 10)],
      showDate: true,
      startDate: new Date('2019-02-25').toISOString().substr(0, 10),
      endDate: new Date('2019-04-15').toISOString().substr(0, 10)
    }
  },
  watch: {
    dates () {
      this.$store.state.timesearchtotaldates = this.dates
    }
  },
  created () {
    // get composite area
    areaRests.fetchCompositeArea(27).then(response => {
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
    EventBus.$on('clicked-createBookmark_TimeTotal', bookmarkname => {
      this.onCreateBookmark(bookmarkname)
    })
    EventBus.$on('clicked-selectedBookmark_TimeTotal', selectedBookmark => {
      this.onSelectHistorySearch(selectedBookmark)
    })
    EventBus.$on('clicked-selectedHistory_TimeTotal', selectedHistorySearch => {
      this.onSelectHistorySearch(selectedHistorySearch)
    })
  },
  methods: {
    scrollTop () {
      var element = document.getElementById('TimeSearchTotal')
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
    onTimeSearchTotal () {
      this.error = ''

      const timelist = this.getTimeList()

      const datecollection = []
      for (const datelist of this.dates) {
        for (let k = 0; k < timelist.length; k++) {
          let datetimes = datelist + ' ' + timelist[k] + ':00'
          var date = this.localToUTCdate(datetimes)
          datecollection.push(date)
        }
      }

      // check 'Area To' selected or not
      if (this.selectAreaTo != null) {
        // get the selected area list from the store.
        this.selectionAreaFrom = this.$store.state.s_STimeSeachTotal

        // check 'Area From' selected or not
        if (this.selectionAreaFrom.length > 0) {
          const fromAreaId = []
          for (const selected of this.selectionAreaFrom) {
            fromAreaId.push(selected.id)
          }

          // dispatch to get time search result by passing parameters (date, date1, AreaFrom list & AreaTo)
          this.$store.dispatch('timesearchtotal/get_timesearchtotal_result', {
            date: datecollection,
            fromAreaId: fromAreaId,
            toAreaId: this.selectAreaTo.id
          })

          // create History Search
          // this.$timetotal is restserviceid for TimeTotal search - global variable declared in main.js
          this.$store.dispatch('searchhistory/create_SearchHistory', {
            Bookmarkname: this.historyCreatedDatetime(),
            SearchRequest: {
              Dates: this.dates,
              AreaFrom: this.selectionAreaFrom,
              AreaTo: this.selectAreaTo
            },
            restserviceid: this.$timetotal
          })
        } else {
          this.error = 'Please select Areas From'
        }
      } else {
        this.error = 'Please select Area To'
      }
    },
    localToUTCdate (datetime) {
      var date = new Date(datetime)
      if (datetime) {
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
          ':00'
        )
      }
    },
    getTimeList () {
      var start = moment('00:00', 'hh:mm')
      var end = moment('23:30', 'hh:mm')
      var result = []
      while (start <= end) {
        result.push(start.format('HH:mm'))
        start.add(60, 'minutes')
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
      // check 'Area To' selected or not
      if (this.selectAreaTo != null) {
        // get the selected area list from the store.
        this.selectionAreaFrom = this.$store.state.s_STimeSeachTotal
        // check 'Area From' selected or not
        if (this.selectionAreaFrom.length > 0) {
          // this.$timetotal is restserviceid for TimeTotal search - global variable declared in main.js
          this.$store.dispatch('searchhistory/create_Bookmark', {
            Bookmarkname: bookmarkname,
            SearchRequest: {
              Dates: this.dates,
              AreaFrom: this.selectionAreaFrom,
              AreaTo: this.selectAreaTo
            },
            restserviceid: this.$timetotal
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
      this.dates = searchreq.Dates
      this.$store.state.s_STimeSeachTotal = searchreq.AreaFrom
      this.selectAreaTo = searchreq.AreaTo

      // show selected AreasFrom in Treeview component
      EventBus.$emit('selectedAreasFrom_History_TimeTotal', searchreq.AreaFrom)
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
