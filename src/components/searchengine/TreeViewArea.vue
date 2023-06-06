<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card-text>
        <v-scroll-x-transition group hide-on-leave>
          <v-chip
            v-for="(area, i) in selection"
            :key="i"
            color="grey"
            dark
            small
            >{{ areacodename(area) }}</v-chip
          >
        </v-scroll-x-transition>
      </v-card-text>
    </v-flex>
    <v-progress-linear
      color="teal accent-4"
      rounded
      height="4"
      :buffer-value="progressbarValue"
      v-show="isLoading"
    >
    </v-progress-linear>

    <v-flex xs3>
      <v-card-text>
        <v-treeview
          :id="searchname"
          v-model="selection"
          :items="items"
          selectable
          open-on-click
          :selection-type="selectionType"
          return-object
          activatable
          active-class="grey lighten-4 indigo--text"
          selected-color="#408280"
          expand-icon="mdi-chevron-down"
          on-icon="mdi-bookmark"
          off-icon="mdi-bookmark-outline"
        >
          <!-- old treeview template - Don't remove -->
          <!-- <template slot="label" slot-scope="{ item }">
            <a v-if="item.code" @click="getChild(item)">({{ item.code }}) {{ item.name }}</a>
            <a v-else @click="getChild(item)">{{ item.name }}</a>
          </template> -->
        </v-treeview>
      </v-card-text>

      <v-card-actions>
        <v-btn left outline color="#408280" flat @click="selection = []">
          <b>Reset</b>
        </v-btn>
      </v-card-actions>
    </v-flex>
  </v-layout>
</template>

<script>
import areaRests from '@/api/api_area.js'
import { EventBus } from '@/event-bus.js'
// import { mapState } from 'vuex'
export default {
  props: ['searchname'],
  data: () => ({
    selection: [],
    selectionType: 'independent', // or leaf
    // old items - Don't remove
    // items: [
    //   {
    //     areatypeid: 1,
    //     code: 11,
    //     geometryid: 15274,
    //     id: 104197,
    //     kidsnumber: 30,
    //     name: 'Rogaland'
    //   }
    // ],
    items: [],
    interval: {},
    progressbarValue: 0,
    isLoading: true,
    value: 50,
    childrens: []
  }),

  created () {
    // get roots/ countries and push into items
    // this.$store.dispatch('area/getroot')
    this.getData({
      areatypeid: 1,
      code: 11,
      geometryid: 15274,
      id: 104197,
      kidsnumber: 30,
      name: 'Rogaland'
    }).then(res => {
      this.items.push(res)
    })
  },
  // computed: {
  //   ...mapState({
  //     items: state => state.area.items
  //   })
  // },
  mounted () {
    this.interval = setInterval(() => {
      if (this.progressbarValue === 100) {
        this.isLoading = false
      }
      this.progressbarValue += 10
    }, 1550)

    EventBus.$on('selection-click', testselection => {
      this.selection = []
      if (this.searchname === 'Time') {
        if (testselection.length > 0) {
          testselection.forEach(element => {
            this.selection.push({
              id: element.Id,
              name: element.name,
              code: element.AreaCode,
              geometryid: element.GeometryId,
              parentareaid: element.parentareaid,
              kidsnumber: element.kidsnumber
            })
          })
          this.$store.state.s_selection = this.selection
        } 
      }
    })
    EventBus.$on('selection-Timeline_click', testselection => {
      this.selection = []
      if (this.searchname === 'TimeLine') {
        if (testselection.length > 0) {
          testselection.forEach(element => {
            this.selection.push({
              id: element.Id,
              name: element.name,
              code: element.AreaCode,
              geometryid: element.GeometryId,
              parentareaid: element.parentareaid,
              kidsnumber: element.kidsnumber
            })
          })
          this.$store.state.s_selectionTimeLine = this.selection
        }       
      }
    })
    EventBus.$on('selectedAreasFrom_History_Time', selectedAreas => {
      if (this.searchname === 'Time') {
        this.selection = []
        this.selection = selectedAreas
        this.$store.state.s_selection = this.selection
      }
    })
    EventBus.$on('selectedAreasFrom_History_TimeTotal', selectedAreas => {
      if (this.searchname === 'TimeSearchTotal') {
        this.selection = []
        this.selection = selectedAreas
        this.$store.state.s_STimeSeachTotal = this.selection
      }
    })
    EventBus.$on('selectedAreasTo_History_Timeline', selectedAreas => {
      if (this.searchname === 'TimeLine') {
        this.selection = []
        this.selection = selectedAreas
        this.$store.state.s_selectionTimeLine = this.selection
      }
    })
  },
  watch: {
    selection () {
      if (this.searchname === 'Time') {
        this.$store.state.s_selection = this.selection
      }
      if (this.searchname === 'TimeLine') {
        this.$store.state.s_selectionTimeLine = this.selection
      }
      if (this.searchname === 'TimeSearchTotal') {
        this.$store.state.s_STimeSeachTotal = this.selection
      }
    }
  },
  methods: {
    // area name with code
    areacodename (area) {
      if (area.code === '' || area.code === null) {
        return area.name
      } else {
        return '(' + area.code + ') ' + area.name
      }
    },
    // old method - Don't remove
    // getChild (item) {
    //   this.selectableValue = true;
    //   if (!item.children) {
    //     this.$set(item, 'children', [])

    //     if (item.children.length === 0) {
    //       areaRests.fetchChildren(item.id).then(response => {
    //         this.childrens = response.data

    //         for (const child of this.childrens) {
    //           item.children.push({
    //             id: child.id,
    //             name: child.name,
    //             code: child.code,
    //             geometryid: child.geometryid
    //           })
    //         }
    //       })
    //     }
    //   }
    // },
    async getData (item) {
      if (!item.children) {
        this.$set(item, 'children', [])

        if (item.children.length === 0) {
          await areaRests.fetchChildren(item.id).then(response => {
            this.childrens = response.data

            for (const child of this.childrens) {
              item.children.push({
                id: child.id,
                name: child.name,
                code: child.code,
                geometryid: child.geometryid,
                kidsnumber: child.kidsnumber
              })
            }

            item.children.forEach((obj, index) => {
              if (obj.kidsnumber > 0) {
                this.levelOne(obj)
              }
            })
          })
          return item
        }
      }
    },
    async levelOne (item) {
      if (!item.children) {
        this.$set(item, 'children', [])
        if (item.children.length === 0) {
          await areaRests.fetchChildren(item.id).then(response => {
            this.childrens = response.data

            for (const child of this.childrens) {
              if (item.children !== null || item.children !== undefined) {
                item.children.push({
                  id: child.id,
                  name: child.name,
                  code: child.code,
                  geometryid: child.geometryid,
                  kidsnumber: child.kidsnumber
                })
              }
            }

            item.children.forEach(obj => {
              if (obj.kidsnumber > 0) {
                this.levelTwo(obj)
              }
            })
          })
          return item
        }
      }
    },
    async levelTwo (item) {
      if (!item.children) {
        this.$set(item, 'children', [])

        if (item.children.length === 0) {
          await areaRests.fetchChildren(item.id).then(response => {
            this.childrens = response.data
            for (const child of this.childrens) {
              item.children.push({
                id: child.id,
                name: child.name,
                code: child.code,
                geometryid: child.geometryid,
                kidsnumber: child.kidsnumber
              })
            }
          })
          return item
        }
      }
    }
  }
}
</script>

<style></style>
