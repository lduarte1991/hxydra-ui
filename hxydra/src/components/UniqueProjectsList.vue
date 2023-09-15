<template>
  <v-container>
    <v-dialog
      v-model="detail"
      width="80%"
      style="background: white"
    >
      <v-card v-if="selected">
        <v-card-title>{{ selected.prefix }} + {{ selected.sequence }} Projects</v-card-title>
        <v-data-table
          :headers="projectheaders"
          :items="selected.projects"
        >
          <template #[`item.videos_archived`]="{ item }">
            <v-icon
              v-if="item.videos_archived"
              color="green"
            >
              mdi-check-circle
            </v-icon>
            <v-icon
              v-else
              color="red"
            >
              mdi-close-octagon
            </v-icon>
          </template>
        </v-data-table>
        {{ selected.projects }}
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        Unique Projects
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="uniqueprojects"
        :items-per-page="50"
        class="projects-1"
        :search="search"
        :custom-filter="filter"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          itemsPerPageOptions: [10, 20, 50, 100, -1]
        }
        "
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
            prepend-inner-icon="mdi-magnify"
            outlined
          />
        </template>
        <template #item="{ item }">
          <tr 
            style="cursor:pointer" 
            @click="viewDetail(item)"
          >
            <td>
              {{ item['prefix'] }}
            </td>
            <td>
              {{ item['sequence'] }}
            </td>
            <td>
              {{ item['title'] }}
            </td>
            <td>
              <v-container>
                <v-row>
                  <v-col
                    v-if="write_perm"
                    class="col-6"
                  >
                    <v-icon
                      small
                      class="mr-2"
                      @click.stop.prevent="editItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-col>
                  <v-col class="col-6">
                    <v-icon
                      small
                      @click="viewDetail(item)"
                    >
                      mdi-eye
                    </v-icon>
                  </v-col>
                </v-row>
              </v-container>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  let perms = false
  try {
    const cookie = document.cookie
    if (typeof(cookie) !== "undefined") {
      let cookie_split = cookie.split(';').map(x => x.split('='))
      let perm_cookie_val = cookie_split.filter(y => y.length == 2 ? y[0].trim() == 'hx-perms' : false)
      if (perm_cookie_val.length > 0) {
        perms = perm_cookie_val[0][1].trim().indexOf('kondo-editor') > -1
      }
    }
  } catch {
    perms = false
  }
  export default {
    name: 'UniqueProjectsList',
    components: {
    },
    data: () => ({
      search: '',
      headers: [{
        text: 'Prefix',
        sortable: true,
        value: 'prefix',
        cellClass: 'no-padding'
      },{
        text: 'Seq',
        sortable: false,
        value: 'sequence',
        cellClass: 'no-padding'
      },{
        text: 'Title',
        sortable: true,
        value: 'title',
        cellClass: 'no-padding'
      },{
        text: 'Actions',
        sortable: false,
        align: 'left',
        width: '10%',
        cellClass: 'no-padding'
      },],
      projectheaders: [{
        text: 'Videos Archived',
        sortable: false,
        value: 'videos_archived',
        cellClass: 'no-padding'
      },{
        text: 'Prefix',
        sortable: true,
        value: 'prefix',
        cellClass: 'no-padding'
      },{
        text: 'Seq',
        sortable: true,
        value: 'sequence',
        cellClass: 'no-padding'
      }, {
        text: 'Version',
        sortable: true,
        value: 'version',
        cellClass: 'no-padding'
      }, {
        text: 'Run',
        sortable: true,
        value: 'run',
        cellClass: 'no-padding'
      }, {
        text: 'Nickname',
        sortable: true,
        value: 'nickname',
        cellClass: 'no-padding'
      }, {
        text: 'Title',
        sortable: true,
        value: 'title',
        cellClass: 'no-padding'
      }],
      api_uniqueprojects_url: process.env.VUE_APP_KONDO_API_URL + 'projectps/',
      uniqueprojects: [],
      write_perm: perms,
      detail: false,
      editing: false,
      selected: undefined,
    }),
    mounted() {
      this.getUniqueProjects();
    },
    methods: {
      filter (value, search) {
        if (value && search) {
          if (typeof(value) !== "undefined") {
            return value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) > -1
          }
        }
        return false
      },
      async getUniqueProjects () {
        const self = this
        if (!axios) {
          return
        }
        await axios.get(
          self.api_uniqueprojects_url
        )
          .then(data => {
            self.uniqueprojects = data.data
          })
          .catch(function(e) {
            self.errorBox = true
            self.errorMessage = "API could not be reached. Using fake data."
            console.log(e)
          });
        
      },
      async getItemDetail ( item ) {
        const self = this
        if (!axios) {
          return
        }
        await axios.get(
          self.api_uniqueprojects_url + item.prefix + '/' + item.sequence + '/?permission=true'
        )
          .then(data => self.selected = data.data)
          .catch(function(e) {
            self.errorBox = true
            self.errorMessage = `API could not be reached. Data for ${item.nickname} was not retrieved.`
            console.log(e)
          })
      },
      editItem (item) {

        this.getItemDetail(item)
          .then(() => this.editing = true)
          .then(() => this.detail = false)

      },
      async viewDetail (item) {
        var selection = window.getSelection();
        if(selection.toString().length === 0) {
          this.getItemDetail(item)
            .then(() => this.rowItem = item)
            .then(() => this.detail = true)
            .then(() => this.editing = false)
        }
      },
    }
  }
</script>

<style>
  .no-padding, th {
    padding-left: 10px!important;
    padding-right: 5px!important;
  }
</style>