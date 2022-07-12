<template>
  <v-container
    fluid
    pl-10
    pr-10
  >
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
    <v-card>
      <v-card-title>
        Eagle <v-icon>mdi-eye</v-icon>&nbsp;&nbsp;Comments
      </v-card-title>
      <v-data-table
        :items="comments"
        :headers="tableHeaders"
        :items-per-page="50"
        :item-class="itemBackground"
        class="comments-1"
        :search="search"
        :custom-filter="filter"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          itemsPerPageOptions: [10, 20, 50, 100, -1]
        }
        "
        :loading="loading"
        loading-text="Retrieving Data..."
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
            prepend-inner-icon="mdi-magnify"
            outlined
          />
          <v-container>
            <v-row v-if="!usersearch">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="start_date"
                    label="Filter Start date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    class="mr-5"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="start_date"
                  :active-picker.sync="activePicker"
                  :max="end_date"
                  min="1950-01-01"
                />
              </v-menu>
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="end_date"
                    label="Fiter End date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    class="mr-5"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="end_date"
                  :active-picker.sync="activePicker2"
                  :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                  :min="start_date"
                />
              </v-menu>
              <v-btn
                color="#EBB352"
                dark
                @click="getComments"
              >
                Change Date Range
              </v-btn>
            </v-row>
            <v-row
              class="pb-10"
            >
              <v-btn
                @click="resetSearch"
              >
                Reset Search/Filter
              </v-btn>
              <v-spacer />
              <v-btn
                :color="onlyFlagged ? '#EBB352' : ''"
                @click="onlyFlagged = !onlyFlagged"
              >
                View Only Flagged
              </v-btn>
              <v-spacer />
              <v-btn
                :color="showAll? '#EBB352' : ''"
                @click="showAll = !showAll"
              >
                Include already Moderated Comments
              </v-btn>
            </v-row>
          </v-container>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="seeComment(item)"
          >
            mdi-eye
          </v-icon>
          <v-icon
            small
            @click="flagComment(item)"
          >
            mdi-flag
          </v-icon>
        </template>
        <template #[`item.comment_author`]="{ item }">
          <v-btn
            icon
            color="#EBB342"
            @click="getAllUser(item.comment_author)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>{{ item.comment_author }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
  import axios from 'axios'
  let perms = false

  // cookie has permissions setting from Django
  // this is purely for UI purposes, middleware
  // in backend handles a second layer of authorization
  try {
    const cookie = document.cookie
    if (typeof(cookie) !== "undefined") {
      let cookie_split = cookie.split(';').map(x => x.split('='))
      let perm_cookie_val = cookie_split.filter(y => y.length == 2 ? y[0].trim() == 'hx-perms' : false)
      
      // after the value of the cookie is retrieved, we check for
      // the value "eaglei-editor" which denote user has permissions
      if (perm_cookie_val.length > 0) {
        perms = perm_cookie_val[0][1].trim().indexOf('eaglei-editor') > -1
      }

      //TODO: try to get the current_moderator this same way?
    }
  } catch {
    perms = false
  }

  export default {
    name: 'EagleIModeration',
    components: {
    },
    data: () => ({
      search: '',
      errorMessage: "",
      errorBox: false,
      write_perm: perms,
      start_date: null,
      end_date: null,
      activePicker: null,
      activePicker2: null,
      usersearch: false,
      menu: null,
      menu2: null,
      loading: false,
      onlyFlagged: false,
      showAll: false,
      api_eaglei_url: process.env.VUE_APP_EAGLEI_API_URL,
      comments: [],
      current_moderator: '',
      tableHeaders: [{
        text: 'Actions',
        sortable: false,
        value: 'actions',
        width: '100px'
      }, {
        text: 'Comment',
        sortable: false,
        value: 'comment_text',
        width: '450px'
      }, {
        text: 'Original Response',
        sortable: false,
        value: 'response_text',
        width: '450px'
      }, {
        text: 'Comment Date Created',
        sortable: true,
        value: 'comment_date_created',
        width: '150px'
      },  {
        text: 'Program/Wave',
        sortable: true,
        value: 'program_wave',
        width: '200px'
      }, {
        text: 'Breadcrumbs',
        sortable: false,
        value: 'breadcrumbs',
        width: '250px'
      }, {
        text: 'Teaching Element',
        sortable: false,
        value: 'tei',
        width: '150px'
      }, {
        text: 'Comment Author',
        sortable: true,
        value: 'comment_author',
        width: '250px'
      }, {
        text: 'Original Response Author',
        sortable: false,
        value: 'response_text_author',
        width: '150px'
      }]
    }),
    mounted() {
      // this could be changed if bigger range is needed
      this.getTwoWeekRange();

      // triggers both the call to make the Snowflake Query
      // and the call to the db containing mod info
      this.getComments();
    },
    methods: {
      filter (value, search) {
        // need to make sure that search is case-insensitive
        if (value && search) {
          if (typeof(value) !== "undefined") {
            return value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) > -1
          }
        }
        return falsex
      },
      itemBackground (item) {
        // returns proper class (and therefore UI) per row
        // given the values of that row
        let itemclass = ""

        // seen/moderated rows should be hidden unless person
        // specifically asks to see already-moderated comments
        if (!this.showAll) {
          itemclass = item.seen ? 'item-row-seen hide1' : ''
        } else {
          itemclass = item.seen ? 'item-row-seen' : ''
        }

        // flagged should show regardless
        itemclass = item.flagged ? 'item-row-flagged' : itemclass
        
        // if a person only wants to see items that are flagged
        // everything else is hidden
        if (!item.flagged && this.onlyFlagged) {
          itemclass += ' hide1'
          itemclass = itemclass.trim()
        }
        return itemclass
      },
      seeComment (item) {
        // UI changes before update are made to db
        // TODO: change this once exceptions are handled
        item.seen = !item.seen
        item.flagged = false
        this.updateComment(item)
      },
      flagComment(item) {
        // UI changes before update are made to db
        // TODO: change this once exceptions are handled
        item.seen = false
        item.flagged = !item.flagged
        this.updateComment(item)
      },
      updateComment(item) {
        // next line for testing purposes
        if (!axios) {
          return
        }
        // everything is sent to db
        // need to figure out how to handle current_moderator
        // TODO: only if necessary, moderated_reason should be updated
        axios.post(this.api_eaglei_url + 'mod/', {
          'comment_id': item.comment_id,
          'flagged': item.flagged,
          'moderated': item.seen,
          'moderated_by': this.current_moderator,
          'moderated_date': new Date().toISOString().substring(0, 10),
          'moderated_reason': '',
          'comment_created_date': item.comment_date_created
        }).catch(e => {
          self.errorBox = true
          self.errorMessage = `API could not be reached.`
          console.log(e)
        })
      },
      getTwoWeekRange() {
        // gets the date range of the last two weeks
        // uses format YYYY-MM-DD
        let endD =  new Date()
        this.end_date = endD.toISOString().substring(0, 10)
        let startD = new Date(endD - 12096e5)
        this.start_date = startD.toISOString().substring(0, 10)
      },
      async resetSearch() {
        // makes sure that when reset is hit things change
        // back to their default
        this.getTwoWeekRange()
        await this.getComments()
        this.usersearch = false
      },
      async getAllUser(username) {
        // allows retrieval by username
        // usersearch triggers UI changes
        let user_param = "?start=null&end=null&username=" + username
        await this.getComments(user_param)
        this.usersearch = true
      },
      sync_view(data) {
        const self = this
        // no point in going through rest of the sync
        // if either/both data sets is/are empty
        if (data.length == 0 || self.comments.length == 0) {
          return
        }
        data.forEach(function(comm) {
          let foundInd = self.comments.findIndex(view_comm => view_comm.comment_id == comm.comment_id)
          if (foundInd > -1) {
            // since this runs regardless of what is changed
            // both flagged and seen get updated even if unchanged
            let foundObj = self.comments[foundInd]
            foundObj.flagged = comm.flagged
            foundObj.seen = comm.moderated
            // tells vue an update was made and should redraw UI
            if(foundInd < self.comments.length) {
              self.$set(self.comments, foundInd, foundObj)
            }
          }
        })
      },
      async getComments (param_replace) {
        const self = this
        // next line for testing purposes only
        if (!axios) {
          return
        }
        // while default search is parameters for start/end
        // the param_replace variable can contain changes that
        // overwrite this and allow expanding of this function
        let params = "?start=" + this.start_date + "&end=" + this.end_date
        if (param_replace && typeof(param_replace) == 'string'){
          params = param_replace
        }
        
        // critical to reset in order for proper thigns to be
        // drawn
        self.comments = [];
        self.loading = true;
        await axios.get(
          self.api_eaglei_url + params
        )
          .then(data => {
            let comments_data = data.data
            if(comments_data.length > 0) {
              comments_data.forEach( function(comment) {
                // the following can change for display purposes
                self.comments.push({
                  'comment_text': comment.comments_text,
                  'comment_author': comment.comments_author_email,
                  'comment_date_created': comment.comments_date_created,
                  'program_wave': comment.program_name + ' > ' + comment.wave_name,
                  'breadcrumbs': comment.module_name + ' > ' + comment.lesson_name + " > " + comment.concept_name,
                  'tei': comment.tei_name + ' [' + comment.tei_type + ']',
                  'response_text': comment.response_text,
                  'response_text_author': comment.email,
                  'seen': false,
                  'flagged': false,
                  'comment_id': comment.comments_id,
                })
              })

              // TODO: async this somehow...
              // calls internal db to get moderated attrs
              axios.get(self.api_eaglei_url + "mod/" + params).then(data => {
                self.sync_view(data.data)
              }).catch(e => {
                self.errorBox = true
                self.errorMessage = `API could not be reached.`
                console.log(e)
              })
            }
            self.loading = false;
          })
          .catch(function(e) {
            self.errorBox = true
            self.errorMessage = "API could not be reached. Using fake data."
            console.log(e)
          });
      },
    }
  }
</script>
<style>
  .item-row-seen, .item-row-seen:hover {
    background: #C8E6C9!important;
  }
  .item-row-flagged, .item-row-flagged:hover {
    background: #FFCDD2!important;
  }
  .hide1 {
    display: none!important;
    /*visibility: hidden !important;*/
  }
  .v-data-table__empty-wrapper {
    text-align: left!important;
  }
</style>