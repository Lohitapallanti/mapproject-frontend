<template>
  <v-container>
    <form autocomplete="on" @submit.prevent="onDwellTimeSearch">
      <!-- Error -->
      <p v-if="error" class="errortxt">{{ error }}</p>
      <!-- Area/ City -->
      <h2 align="left">Area</h2>
      <v-select
     
        color="#408280"
        label="Area"
        v-model="selectArea"
        :items="Areas"
        prepend-icon="place"
        :rules="[v => !!v || 'Area is required']"
        required
      >
        <template slot="selection" slot-scope="Areas">{{ Areas.item.name }}</template>
        <template slot="item" slot-scope="Areas">{{ Areas.item.name }}</template>
      </v-select>
      <h2 align="left">Date / Month</h2>
      <!-- Date/Month -->
      <v-flex>
        <!--<v-switch v-model="showDate" class="ma-3" label="Date"></v-switch>
        <v-switch v-model="month" class="ma-3" label="Month"></v-switch>-->

        <v-radio-group v-model="radios" row>
          <v-radio color="#408280" label="Date" value="Date"></v-radio>
          <v-radio color="#408280" label="Month" value="Month"></v-radio>
        </v-radio-group>

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
              :label="month ? 'Month' : 'Date'"
              readonly
              v-on="on"
              prepend-icon="event"
              color="#408280"
            
              @click:prepend="focusDatePicker()"
            ></v-combobox>
          </template>
          <v-date-picker
          id="mydatePicker"
            color="#408280"
            v-model="dates"
            multiple
            :show-current="showDate"
            :type="month ? 'month' : 'date'"
            no-title
            scrollable
            width="250px"
            :min="startDate"
            :max="endDate"
          >
            <div class="flex-grow-1"></div>
            <v-btn text color="#408280" dark @click="menu = false">Cancel</v-btn>
            <v-btn text color="#408280" dark @click="$refs.menu.save(dates)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
      <!-- Search/Submit Button -->
      <v-flex xs4 offset-xs7>
        <v-btn
          block
          class="white--text"
          type="submit"
          color="#408280"
          style="font-size : 16px;"
        >
          <b>Search</b>
        </v-btn>
      </v-flex>
    </form>
  </v-container>
</template>

<script>
import areaRests from '@/api/api_area.js'
import { EventBus } from '@/event-bus.js'
export default {
  name: 'DwellTimeSearch',
  data () {
    return {
      selectArea: null,
      error: '',
      menu: false,
      // dates: [new Date().toISOString().substr(0, 10)],
      dates: [new Date('2019-04-01').toISOString().substr(0, 10)],
      month: false,
      showDate: true,
      radios: 'Date',
      Areas: [],
      startDate: new Date('2019-04-01').toISOString().substr(0, 10),
      endDate: new Date('2019-04-07').toISOString().substr(0, 10)
    }
  },
  created () {
    // get composite area
    areaRests.fetchCompositeArea(29).then(response => {
      /* for (let i = 0; i < response.data.length; i++) {
        this.Areas.push(response.data[i].areadto)
      } */

      var obj = {}
      for (let i = 0; i < response.data.length; i++) {
        obj[response.data[i].areadto['id']] = response.data[i].areadto
      }

      for (var key in obj) {
        this.Areas.push(obj[key])
      }
    })
  },
  mounted () {
    EventBus.$on('clicked-createBookmark_DwellTime', bookmarkname => {
      this.onCreateBookmark(bookmarkname)
    })
    EventBus.$on('clicked-selectedBookmark_DwellTime', selectedBookmark => {
      this.onSelectHistorySearch(selectedBookmark)
    })
    EventBus.$on('clicked-selectedHistory_DwellTime', selectedHistorySearch => {
      this.onSelectHistorySearch(selectedHistorySearch)
    })
  },
  /* watch: {
    month () {
      if( this.month === true){
        this.dates = [new Date().toISOString().substr(0, 10)]
      }
    }
    }, */
  watch: {
    radios () {
      if (this.radios === 'Date') {
        // this.dates = [new Date().toISOString().substr(0, 10)]
        this.dates = [new Date('2019-04-01').toISOString().substr(0, 10)]
        this.month = false
      }
      if (this.radios === 'Month') {
        this.month = true
        this.dates = [new Date().toISOString().substr(0, 10)]
      }
    }
  },
  methods: {
    focusDatePicker(){
      console.log("sdfsdddffs");
      // document.getElementById("mydatePicker").focus();
      let abc= document.getElementById("mydatePicker");
      console.log(abc,"dfgdf");
      abc.focus();
;
    },
    // Dwell time Search method
    onDwellTimeSearch () {
      this.error = ''
      this.$store.state.dwelltimesearchdates = this.dates
      // check area selected or not
      if (this.selectArea != null) {
        // get the selected date, convert to UTC date
        const datecollection = []
        for (const datelist of this.dates) {
          var date = this.localToUTCdate(datelist)
          datecollection.push(date)
        }

        // dispatch for get dwell time result with date(1 or more) and area.
        this.$store.dispatch('dwelltimesearch/get_dwelltime_result', {
          date: datecollection,
          AreaId: this.selectArea.id
        })

        // create History Search
        // this.$dwelltime is restserviceid for DwellTime search - global variable declared in main.js
        this.$store.dispatch('searchhistory/create_SearchHistory', {
          Bookmarkname: this.historyCreatedDatetime(),
          SearchRequest: {
            Dates: this.dates,
            Area: this.selectArea
          },
          restserviceid: this.$dwelltime
        })
      } else {
        this.error = 'Please select area'
      }
    },
    localToUTCdate (datetime) {
      var timeString = '00:00:00'
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
          ':0' +
          date.getUTCMinutes() +
          ':00'
        )
      }
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
      // check area selected or not
      if (this.selectArea != null) {
        // this.$dwelltime is restserviceid for DwellTime search - global variable declared in main.js
        this.$store.dispatch('searchhistory/create_Bookmark', {
          Bookmarkname: bookmarkname,
          SearchRequest: {
            Dates: this.dates,
            Area: this.selectArea
          },
          restserviceid: this.$dwelltime
        })
      } else {
        this.error = 'Please select Area'
      }
    },
    onSelectHistorySearch (selectedHistory) {
      const searchreq = JSON.parse(selectedHistory.searchrequest)

      // assign value to the search
      this.dates = searchreq.Dates
      this.selectArea = searchreq.Area
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
