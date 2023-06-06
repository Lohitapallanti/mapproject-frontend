<template>
  <v-container>
    <v-tabs
      v-model="active"
      color="#408280"
      dark
      slider-color="#8FCFCC"
      centered
    >
      <v-tab>Bookmarks</v-tab>
      <v-tab>History</v-tab>
      <v-tab-item>
        <p v-if="bookmarkerror" class="errortxt">{{ bookmarkerror }}</p>
        <v-text-field
          label="Define search name"
          v-model="bookmarkName"
        ></v-text-field>
        <v-flex xs4 offset-xs7>
          <v-btn
            dark
            block
            color="#408280"
            style="font-size : 16px;"
            type="submit"
            @click="onSaveBookmark"
          >
            <b>SAVE</b>
          </v-btn>
        </v-flex>
        <br />
        <h3>BOOKMARKED SEARCHES</h3>
        <v-list one-line>
          <template v-for="bResult in bookmarkResult">
            <v-list-tile
              :key="bResult.id"
              ripple
              @click="onShowBookmarkSearch(bResult)"
            >
              <v-list-tile-content>
                <v-list-tile-title
                  >{{ bResult.bookmarkname }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon @click="onDeleteHistorySearch(bResult)" @click.stop>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-tab-item>
      <!-- HISTORY SEARCH-->
      <v-tab-item>
        <v-list one-line>
          <template v-for="historyResult in searchHistoryResult">
            <v-list-tile
              :key="historyResult.id"
              ripple
              @click="onShowHistorySearch(historyResult)"
            >
              <v-list-tile-content>
                <v-list-tile-title
                  >{{ utcToLocaldatetimeFormat(historyResult.bookmarkname) }}
                </v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn
                  icon
                  @click="onDeleteHistorySearch(historyResult)"
                  @click.stop
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import SearchesRests from '@/api/api_searchhistory.js'
export default {
  name: 'Historysearch',
  data () {
    return {
      searchHistoryResult: [],
      bookmarkResult: [],
      bookmarkName: '',
      bookmarkerror: '',
      fullSearchHistory: [],
      showTime: true,
      showTimeTotal: false,
      showDwell: false,
      showTimeline: false,
      showTimelineoverview: false,
      active: null
    }
  },
  mounted () {
    EventBus.$on('clicked-tabchange', setvalue => {
      this.searchHistoryResult = []
      this.bookmarkResult = []
      if (setvalue === 'Time') {
        this.showTimeSearchHistory()
      }
      if (setvalue === 'TimeSearchTotal') {
        this.showTimeTotalSearchHistory()
      }
      if (setvalue === 'Dwell') {
        this.showDwellTimeSearchHistory()
      }
      if (setvalue === 'Timeline') {
        this.showTimelineSearchHistory()
      }
      if (setvalue === 'TimelineOverview') {
        this.showTimelineoverviewSearchHistory()
      }
    })
    EventBus.$on('created_History_event', searchHistoryResult => {
      this.searchHistoryResult = []
      this.bookmarkResult = []
      // this.$timetime , this.$timetotal, this.$dwelltime, this.$timeline_timeline & this.$timeline_overview is restserviceid for History searches - global variables declared in main.js
      if (searchHistoryResult.restserviceid === this.$timetime) {
        this.showTimeSearchHistory()
      }
      if (searchHistoryResult.restserviceid === this.$timetotal) {
        this.showTimeTotalSearchHistory()
      }
      if (searchHistoryResult.restserviceid === this.$dwelltime) {
        this.showDwellTimeSearchHistory()
      }
      if (searchHistoryResult.restserviceid === this.$timeline_timeline) {
        this.showTimelineSearchHistory()
      }
      if (searchHistoryResult.restserviceid === this.$timeline_overview) {
        this.showTimelineoverviewSearchHistory()
      }
    })
  },
  created () {
    this.showTimeSearchHistory()
  },
  methods: {
    showTimeSearchHistory () {
      this.showTime = true
      this.showTimeTotal = false
      this.showDwell = false
      this.showTimeline = false
      this.showTimelineoverview = false
      SearchesRests.getSearchHistory().then(response => {
        this.fullSearchHistory = response.data
        const searchHisResultObj = []
        const bookmarkResultObj = []
        for (let i = 0; i < this.fullSearchHistory.length; i++) {
          // this.$timetime is restserviceid for Time search - global variable declared in main.js
          if (this.fullSearchHistory[i].bookmark === false && this.fullSearchHistory[i].restserviceid === this.$timetime) {
            searchHisResultObj.push(this.fullSearchHistory[i])
          }
          if (this.fullSearchHistory[i].bookmark === true && this.fullSearchHistory[i].restserviceid === this.$timetime) {
            bookmarkResultObj.push(this.fullSearchHistory[i])
          }
        }
        this.searchHistoryResult = searchHisResultObj.reverse().slice(0, 11)
        this.bookmarkResult = bookmarkResultObj.reverse()
      })
    },
    showTimeTotalSearchHistory () {
      this.showTime = false
      this.showTimeTotal = true
      this.showDwell = false
      this.showTimeline = false
      this.showTimelineoverview = false
      SearchesRests.getSearchHistory().then(response => {
        this.fullSearchHistory = response.data
        const searchHisResultObj = []
        const bookmarkResultObj = []
        for (let i = 0; i < this.fullSearchHistory.length; i++) {
          // this.$timetotal is restserviceid for TimeTotal search - global variable declared in main.js
          if (this.fullSearchHistory[i].bookmark === false && this.fullSearchHistory[i].restserviceid === this.$timetotal) {
            searchHisResultObj.push(this.fullSearchHistory[i])
          }
          if (this.fullSearchHistory[i].bookmark === true && this.fullSearchHistory[i].restserviceid === this.$timetotal) {
            bookmarkResultObj.push(this.fullSearchHistory[i])
          }
        }
        this.searchHistoryResult = searchHisResultObj.reverse().slice(0, 11)
        this.bookmarkResult = bookmarkResultObj.reverse()
      })
    },
    showDwellTimeSearchHistory () {
      this.showTime = false
      this.showTimeTotal = false
      this.showDwell = true
      this.showTimeline = false
      this.showTimelineoverview = false
      SearchesRests.getSearchHistory().then(response => {
        this.fullSearchHistory = response.data
        const searchHisResultObj = []
        const bookmarkResultObj = []
        for (let i = 0; i < this.fullSearchHistory.length; i++) {
          // this.$dwelltime is restserviceid for DwellTime search - global variable declared in main.js
          if (this.fullSearchHistory[i].bookmark === false && this.fullSearchHistory[i].restserviceid === this.$dwelltime) {
            searchHisResultObj.push(this.fullSearchHistory[i])
          }
          if (this.fullSearchHistory[i].bookmark === true && this.fullSearchHistory[i].restserviceid === this.$dwelltime) {
            bookmarkResultObj.push(this.fullSearchHistory[i])
          }
        }
        this.searchHistoryResult = searchHisResultObj.reverse().slice(0, 11)
        this.bookmarkResult = bookmarkResultObj.reverse()
      })
    },
    showTimelineSearchHistory () {
      this.showTime = false
      this.showTimeTotal = false
      this.showDwell = false
      this.showTimeline = true
      this.showTimelineoverview = false
      SearchesRests.getSearchHistory().then(response => {
        this.fullSearchHistory = response.data
        const searchHisResultObj = []
        const bookmarkResultObj = []
        for (let i = 0; i < this.fullSearchHistory.length; i++) {
          // this.$timeline_timeline is restserviceid for Timeline search - global variable declared in main.js
          if (this.fullSearchHistory[i].bookmark === false && this.fullSearchHistory[i].restserviceid === this.$timeline_timeline) {
            searchHisResultObj.push(this.fullSearchHistory[i])
          }
          if (this.fullSearchHistory[i].bookmark === true && this.fullSearchHistory[i].restserviceid === this.$timeline_timeline) {
            bookmarkResultObj.push(this.fullSearchHistory[i])
          }
        }
        this.searchHistoryResult = searchHisResultObj.reverse().slice(0, 11)
        this.bookmarkResult = bookmarkResultObj.reverse()
      })
    },
    showTimelineoverviewSearchHistory () {
      this.showTime = false
      this.showTimeTotal = false
      this.showDwell = false
      this.showTimeline = false
      this.showTimelineoverview = true
      SearchesRests.getSearchHistory().then(response => {
        this.fullSearchHistory = response.data
        const searchHisResultObj = []
        const bookmarkResultObj = []
        for (let i = 0; i < this.fullSearchHistory.length; i++) {
          // this.$timeline_overview is restserviceid for TimelineOverview search - global variable declared in main.js
          if (this.fullSearchHistory[i].bookmark === false && this.fullSearchHistory[i].restserviceid === this.$timeline_overview) {
            searchHisResultObj.push(this.fullSearchHistory[i])
          }
          if (this.fullSearchHistory[i].bookmark === true && this.fullSearchHistory[i].restserviceid === this.$timeline_overview) {
            bookmarkResultObj.push(this.fullSearchHistory[i])
          }
        }
        this.searchHistoryResult = searchHisResultObj.reverse().slice(0, 11)
        this.bookmarkResult = bookmarkResultObj.reverse()
      })
    },
    onSaveBookmark () {
      this.bookmarkerror = ''

      if (this.bookmarkName !== '') {
        if (this.showTime === true) {
          EventBus.$emit('clicked-createBookmark_Time', this.bookmarkName)
        }
        if (this.showTimeTotal === true) {
          EventBus.$emit('clicked-createBookmark_TimeTotal', this.bookmarkName)
        }
        if (this.showDwell === true) {
          EventBus.$emit('clicked-createBookmark_DwellTime', this.bookmarkName)
        }
        if (this.showTimeline === true) {
          EventBus.$emit('clicked-createBookmark_Timeline', this.bookmarkName)
        }
        if (this.showTimelineoverview === true) {
          EventBus.$emit('clicked-createBookmark_TimelineOverview', this.bookmarkName)
        }
        this.bookmarkName = ''
      } else {
        this.bookmarkerror = 'Please enter search name'
      }
    },
    onShowHistorySearch (selectedSearchHistory) {
      if (this.showTime === true) {
        EventBus.$emit('clicked-selectSearchHistory_Time', selectedSearchHistory)
      }
      if (this.showTimeTotal === true) {
        EventBus.$emit('clicked-selectedHistory_TimeTotal', selectedSearchHistory)
      }
      if (this.showDwell === true) {
        EventBus.$emit('clicked-selectedHistory_DwellTime', selectedSearchHistory)
      }
      if (this.showTimeline === true) {
        EventBus.$emit('clicked-selectedHistory_Timeline',selectedSearchHistory)
      }
      if (this.showTimelineoverview === true) {
        EventBus.$emit('clicked-selectedHistory_TimelineOverview', selectedSearchHistory)
      }
    },
    onShowBookmarkSearch (selectedBookmark) {
      if (this.showTime === true) {
        EventBus.$emit('clicked-selectBookmark_Time', selectedBookmark)
      }
      if (this.showTimeTotal === true) {
        EventBus.$emit('clicked-selectedBookmark_TimeTotal', selectedBookmark)
      }
      if (this.showDwell === true) {
        EventBus.$emit('clicked-selectedBookmark_DwellTime', selectedBookmark)
      }
      if (this.showTimeline === true) {
        EventBus.$emit('clicked-selectedBookmark_Timeline', selectedBookmark)
      }
      if (this.showTimelineoverview === true) {
        EventBus.$emit('clicked-selectedBookmark_TimelineOverview', selectedBookmark)
      }
    },
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
          ('0' + utctolocal.getDate()).slice(-2) +
          '-' +
          ('0' + (utctolocal.getMonth() + 1)).slice(-2) +
          '-' +
          utctolocal.getFullYear() +
          ' ' +
          ('0' + utctolocal.getHours()).slice(-2) +
          ':' +
          ('0' + utctolocal.getMinutes()).slice(-2)
        )
      }
    },
    onDeleteHistorySearch (selectedSearchHistory) {
      SearchesRests.deleteSearchHistory(selectedSearchHistory.id).then(
        response => {
          if (this.showTime === true) {
            this.showTimeSearchHistory()
          }
          if (this.showTimeTotal === true) {
            this.showTimeTotalSearchHistory()
          }
          if (this.showDwell === true) {
            this.showDwellTimeSearchHistory()
          }
          if (this.showTimeline === true) {
            this.showTimelineSearchHistory()
          }
          if (this.showTimelineoverview === true) {
            this.showTimelineoverviewSearchHistory()
          }
        }
      )
    }
  }
}
</script>

<style>
.history {
  color: #408280;
}
</style>
