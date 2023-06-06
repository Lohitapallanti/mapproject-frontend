<template>
  <v-container>
    <!-- <a name="top"></a> -->
    <!--<form autocomplete="on">-->
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
              <v-text-field color="#408280" v-model="time" label="Time" readonly v-on="on"></v-text-field>
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
              <v-text-field color="#408280" v-model="date" label="Date" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker width="250px" color="#408280" v-model="date" no-title></v-date-picker>
          </v-menu>
        </v-flex>

        <!-- Date2 -->
        <v-flex xs12 md4>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-text-field color="#408280" v-model="date1" label="Date" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker width="250px" color="#408280" v-model="date1" no-title></v-date-picker>
          </v-menu>
        </v-flex>

        <!-- Start Area -->
        <v-flex>
          <p v-if="error" class="errortxt">{{ error }}</p>
          <h2 align="left">Areas From</h2>
          <TreeViewArea />
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
          item-text="name"
          item-value="id"
          prepend-icon="place"
          :rules="[v => !!v || 'Area is required']"
          required
        ></v-select>
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
    <!--</form>-->
  </v-container>
</template>

<script>
import TreeViewArea from '@/components/searchengine/TreeViewArea.vue'
import areaRests from '@/api/api_area.js'
export default {
  name: 'TotalSearch',
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
      date: new Date().toISOString().substr(0, 10),
      date1: new Date().toISOString().substr(0, 10),
      error: '',
      selection: [],
      endAreas: []
    }
  },

  created () {
    // get composite area
    areaRests.fetchCompositeArea(27).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        this.endAreas.push(response.data[i].areadto)
      }
    })
  },
  methods: {
    scrollTop () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
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
