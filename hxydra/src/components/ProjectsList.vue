<template>
  <v-container>
    <v-snackbar
      v-model="errorBox"
      top
      elevation="10"
      color="error"
    >
      {{ errorMessage }}
      <template #action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="errorBox = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="editing"
      width="80%"
      style="background: white"
      persistent
    >
      <v-card>
        <EditForm
          :course="selected"
          @closeEdit="closeEdit"
        />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="detail"
      width="80%"
      style="background: white"
    >
      <v-card v-if="selected">
        <v-toolbar
          dense
          style="position: sticky; top: 0; z-index: 99999"
        >
          <v-btn
            class="ma-2"
            @click="detail = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="write_perm"
            class="mr-3"
            @click="createNewSequence(rowItem)"
          >
            New Sequence
          </v-btn>
          <v-btn
            v-if="write_perm"
            class="mr-3"
            @click="createNewVersion(rowItem)"
          >
            New Version
          </v-btn>
          <v-btn
            v-if="write_perm"
            class="mr-3"
            @click="createNewRerun(rowItem)"
          >
            New Run
          </v-btn>
          <v-btn
            v-if="write_perm"
            @click="deleteItem(rowItem)"
          >
            <v-icon
              small
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </v-toolbar>
        <DetailView :course="selected" />
      </v-card>
    </v-dialog>
    <v-card
      v-if="newProject"
      shaped
      dark
      class="mb-5 success"
      style="position: sticky; top: 70px; z-index:99999"
    >
      <v-card-title>
        New Project '{{ newProject.title }}' was added. &nbsp; <a @click="search=newProject.nickname">View it here</a>
        <v-spacer />
        <v-btn @click="newProject=undefined">
          Close
        </v-btn>
      </v-card-title>
    </v-card>
    <v-card>
      <v-card-title>
        Projects
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="projects"
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
          <tr @click="viewDetail(item)" style="cursor:pointer">
            <td>
              {{ item['nickname'] }}
            </td>
            <td>
              {{ item['title'] }}
            </td>
            <td>
              {{ launchDateDisplay(item) }}
            </td>
            <td>
              {{ endDateDisplay(item) }}
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
    <!-- <v-dialog
      v-model="debugDialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          fixed
          bottom
          right
          color="green"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-bug</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          Debug API
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field label="Project List API URL" v-model="api_projects_url" @input="getProjects"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="debugDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-container>
</template>

<script>
  import EditForm from './EditForm'
  import DetailView from './DetailView'
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
    name: 'ProjectsList',
    components: {
      EditForm,
      DetailView
    },
    data: () => ({
      search: '',
      editing: false,
      selected: undefined,
      detail: undefined,
      rowItem: undefined,
      errorMessage: "",
      errorBox: false,
      write_perm: perms,
      debugDialog: false,
      newProject: undefined,
      headers: [{
        text: 'Nickname',
        sortable: true,
        value: 'nickname',
        width: '10%'
      },{
        text: 'Project Title',
        sortable: true,
        value: 'title',
        width: '50%'
      },{
        text: 'Launch Date',
        sortable: true,
        value: 'launch_date',
        width: '15%'
      },{
        text: 'End Date',
        sortable: true,
        value: 'end_date',
        width: '15%'
      }, {
        text: 'Actions',
        sortable: false,
        align: 'center',
        width: '10%'
      }, {
        text: 'fuzzy date',
        align: ' d-none',
        value: 'fuzzy_launch_date'
      }],
      api_projects_url: process.env.VUE_APP_KONDO_API_URL + 'project/',
      api_copy_project_url: process.env.VUE_APP_KONDO_API_URL + 'copy/',
      projects: [],
    }),
    mounted() {
      this.getProjects();
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
      async getProjects () {
        const self = this
        if (!axios) {
          return
        }
        await axios.get(
          self.api_projects_url
        )
          .then(data => {
            self.projects = data.data

            // from https://stackoverflow.com/questions/35914069/how-can-i-get-query-parameters-from-a-url-in-vue-js
            let uri = window.location.href.split('?');
            if(uri.length == 2) {
              let vars = uri[1].split('&');
              let getVars = {};
              let tmp = '';
              vars.forEach(function(v) {
                tmp = v.split('=');
                if(tmp.length == 2)
                  getVars[tmp[0]] = tmp[1];
              });

              if ('course_created' in getVars) {
                let found_course = self.projects.filter(v => v.nickname == getVars['course_created'])
                if (found_course.length == 1) {
                  self.newProject = found_course[0]
                }
              }
            }

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
          self.api_projects_url + item.nickname
          + '/'
        )
          .then(data => this.selected = data.data)
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
      async deleteItem (item) {
        if (!confirm("Are you sure you want to delete?")) {
          return
        }
        const self = this;
        if (!axios) {
          return
        }
        await axios.delete(
          self.api_projects_url + item.nickname
          + '/'
        )
          .then(() => self.projects = self.projects.filter(e => e.nickname !== item.nickname))
          .then(() => self.detail = false)
          .then(() => self.selected = undefined)
          .catch(function(e) {
            self.errorBox = true
            self.errorMessage = `API could not be reached. Data for ${item.nickname} was not deleted.`
            console.log(e)
          })
      },
      async createNewSequence (item) {
        if (!confirm("Are you sure you want to create a new sequence?")) {
          return
        }
        const self = this;
        if (!axios) {
          return
        }
        await axios.post(
          self.api_copy_project_url + 'sequence/' + item.nickname + '/'
        )
          .then((data) => self.selected = data.data)
          .then(() => self.editing = true)
          .then(() => self.detail = false)
          .catch(function(e) {
            if (e.response.data.message[0].indexOf('not most recent') > -1) {
              // show pop up
              if(confirm("Project is not most recent instance. Are you sure you want to create new sequence from this older instance?")) {
                axios.post(
                  self.api_copy_project_url + 'sequence/' + item.nickname + '/?yis=true'
                )
                  .then((data) => self.selected = data.data)
                  .then(() => self.editing = true)
                  .then(() => self.detail = false)
              }
            } else {
              console.log(e)
            }
          })
      },
      async createNewVersion (item) {
        if (!confirm("Are you sure you want to create a new version?")) {
          return
        }
        const self = this;
        if (!axios) {
          return
        }
        await axios.post(
          self.api_copy_project_url + 'version/' + item.nickname + '/'
        )
          .then((data) => this.selected = data.data)
          .then(() => this.editing = true)
          .then(() => this.detail = false)
          .catch(function(e) {
            if (e.response.data.message[0].indexOf('not most recent') > -1) {
              // show pop up
              if(confirm("Project is not most recent instance. Are you sure you want to create new version from this older instance?")) {
                axios.post(
                  self.api_copy_project_url + 'version/' + item.nickname + '/?yis=true'
                )
                  .then((data) => self.selected = data.data)
                  .then(() => self.editing = true)
                  .then(() => self.detail = false)
              }
            } else {
              console.log(e)
            }
          })
      },
      async createNewRerun (item) {
        if (!confirm("Are you sure you want to create a new rerun?")) {
          return
        }
        const self = this;
        if (!axios) {
          return
        }
        await axios.post(
          self.api_copy_project_url + 'run/' + item.nickname + '/'
        )
          .then((data) => this.selected = data.data)
          .then(() => this.editing = true)
          .then(() => this.detail = false)
          .catch(function(e) {
            if (e.response.data.message[0].indexOf('not most recent') > -1) {
              // show pop up
              if(confirm("Project is not most recent run. Are you sure you want to create new run from this older instance?")) {
                axios.post(
                  self.api_copy_project_url + 'run/' + item.nickname + '/?yis=true'
                )
                  .then((data) => self.selected = data.data)
                  .then(() => self.editing = true)
                  .then(() => self.detail = false)
              }
            } else {
              console.log(e)
            }
          })
      },
      closeEdit (e) {
        this.editing = false
        if (e) {
          let indexFound = this.projects.findIndex(obj => obj.nickname === e.nickname)
          if (indexFound == -1) {
            this.projects.push(e)
            this.projects.sort((firstItem, secondItem) => firstItem.nickname < secondItem.nickname ? -1 : 1)
            this.newProject = e
          } else {
            this.$set(this.projects, indexFound, e)
          }
        }
      },
      launchDateDisplay( item ) {
        let res = item['fuzzy_launch_date']
        if ('launch_date' in item) {
          let d = item['launch_date']
          if (d) {
            res = new Date(item['launch_date']).toISOString().substring(0,10)
          }
        } else if (!item['is_fuzzy_launch_date']) {
          res = 'Unset'
        }
        return res
      },
      endDateDisplay( item ) {
        let res = ''
        if ('end_date' in item) {
          let d = item['end_date']
          if (d) {
            res = new Date(item['end_date']).toISOString().substring(0,10)
          }
        }
        return res
      },
    }
  }
</script>