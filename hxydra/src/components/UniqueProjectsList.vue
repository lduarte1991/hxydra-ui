<template>
  <v-container>
    <div class="text-center">
      <v-snackbar
        v-model="result_snackbar"
        :multi-line="true"
        :color="result_color"
        centered
      >
        {{ result_text }}

        <template #action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="result_snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <v-dialog
      v-model="detail"
      width="80%"
      style="background: white"
    >
      <v-card v-if="selected">
        <v-card-title>
          {{ selected.prefix }} + {{ selected.sequence }} Projects
          <v-spacer />
          <v-btn
            class="ma-2"
            @click="detail = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-data-table
          :headers="projectheaders"
          :items="selected.projects"
        >
          <template #[`item.video_archived`]="{ item }">
            <span v-if="!editing">
              <v-icon
                v-if="item.video_archived"
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
            </span>
            <span v-else>
              <v-checkbox
                v-model="item.video_archived"
                @change="archiveChanged(item)"
                :disabled="!('video_archived' in item.writeable)"
              />
            </span>
          </template>
        </v-data-table>
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
                    v-if="write_perms.update"
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
  import getPermissionsFromCookie from '../resources/permissions';

  export default {
    name: 'UniqueProjectsList',
    components: {
    },
    data: () => ({
      search: '',
      result_snackbar: false,
      result_text: "",
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
        align: 'center',
        width: '10%',
        cellClass: 'no-padding'
      },],
      projectheaders: [{
        text: 'Prefix',
        sortable: true,
        value: 'prefix',
        cellClass: 'no-padding'
      }, {
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
      }, {
        text: 'Videos Archived',
        sortable: false,
        value: 'video_archived',
        cellClass: 'no-padding'
      },],
      api_projects_url: process.env.VUE_APP_KONDO_API_URL,
      api_uniqueprojects_url: process.env.VUE_APP_KONDO_API_URL + 'projectps/',
      uniqueprojects: [],
      write_perms: getPermissionsFromCookie(),
      detail: false,
      editing: false,
      selected: undefined,
      result_color: "white",
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
          .then(() => {
            console.log(this.selected)
            this.editing = true
            this.detail = false
          })
          .then(() => this.editing = true)
          .then(() => this.detail = true)

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
      async archiveChanged (item, selection) {
        const self = this
        console.log(item.video_archived)
        if (!axios) {
          return
        }
        await axios.patch(
          self.api_projects_url + "project/" + item.nickname + '/', {
            video_archived: item.video_archived,
            prefix: item.prefix,
            sequence: item.sequence,
            version: item.version,
            run: item.run,
            common_name: item.common_name
          }
        )
          .then(() => {
            self.result_snackbar = true
            self.result_text = "Video Archived set to " + item.video_archived + " for course with nickname " + item.nickname + "."
            self.result_color = "green"
          }, () => {
            self.result_snackbar = true
            self.result_text = "Something went wrong when trying to change video archive. Contact tech team."
            self.result_color = "red"
          })
      }
    }
  }
</script>

<style>
  .no-padding, th {
    padding-left: 10px!important;
    padding-right: 5px!important;
  }
</style>