<template>
  <v-card
    class="mb-10"
  >
    <v-snackbar
      v-model="downloadBox"
      centered
      timeout="-1"
      color="deep-purple accent-4"
      elevation="24"
    >
      {{ progressMessage }}
      <template #action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="downloadBox = false"
        >
          Close
        </v-btn>
      </template>
      <v-progress-linear
        color="white"
        :buffer-value="progressValue"
        stream
      />
    </v-snackbar>
    <v-card-title>Updates Report Builder</v-card-title>
    <v-row
      row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-6"
      >
        <v-menu
          v-model="startDatePop"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="startDateDisplay"
              clearable
              v-on="on"
              @click:clear="start_date = ''"
              @change="startDateTxtUpdate"
            >
              <template slot="label">
                <v-icon>mdi-calendar-month</v-icon> Start Date
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="start_date"
            no-title
            @change="startDatePop = false"
          />
        </v-menu>
      </v-col>
      <v-col
        class="col-6"
      >
        <v-menu
          v-model="endDatePop"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="endDateDisplay"
              clearable
              v-on="on"
              @click:clear="end_date = ''"
              @change="endDateTxtUpdate"
            >
              <template slot="label">
                <v-icon>mdi-calendar-month</v-icon> End Date
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="end_date"
            no-title
            @change="endDatePop = false"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-12"
      >
        <v-checkbox
          v-model="useSparse"
          label="Use Sparse (display only updated values)"
        />
      </v-col>
    </v-row>
    <v-row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-12"
      >
        <h3>Columns to Include</h3>
      </v-col>
      <v-col
        class="col-12"
      >
        <p>
          <a @click="selectAll">Check All</a> / <a @click="unselectAll">Uncheck All</a>
        </p>
      </v-col>
      <v-col
        v-for="h in header_options"
        :key="h"
        class="col-4"
      >
        <v-checkbox
          v-model="selected"
          :label="h"
          :value="h"
        />
      </v-col>
    </v-row>
    <v-row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-12"
      >
        <p
          v-if="selected.length == 0"
          class="error pa-3 white--text rounded"
          dark
          align="center"
        >
          At least one column must be included to create updates report.
        </p>
      </v-col>
    </v-row>
    <v-row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-6"
        align="center"
      >
        <v-btn
          class="mb-5"
          :disabled="selected.length == 0"
          @click="makeReport('csv')"
        >
          Download CSV Updates Report
        </v-btn>
      </v-col>
      <v-col
        class="col-6"
        align="center"
      >
        <v-btn
          class="mb-5"
          :disabled="selected.length == 0"
          @click="makeReport('json')"
        >
          Download JSON Updates Report
        </v-btn>
      </v-col>
      <v-col
        class="col-12"
        align="center"
      >
        <v-btn
          class="mb-5"
          :href="'/kondo_reportview/?url=' + encodeURIComponent(viewOnlineURL(useSparse)) + '&title=Updates%20Report'"
          :disabled="selected.length == 0"
        >
          <v-icon class="mr-2">
            mdi-eye
          </v-icon> View Online
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'UpdatesReportBuilder',
    props: {},
    data: () => ({
      startDatePop: false,
      endDatePop: false,

      // form items
      start_date: '',
      end_date: '',
      header: '',
      header_options: [],
      selected: ["nickname"],
      useSparse: false,

      //download stuff
      progressValue: 0,
      errorBox: false,
      errorMessage: '',
      downloadBox: false,
      progressMessage: '',
      loadProgress: 0,

      //api urls
      api_header_url: process.env.VUE_APP_KONDO_API_URL + 'reportheader/flex_updates_sparse/',
    }),
    computed: {
      startDateDisplay() {
        return this.getDate(this.start_date)
      },
      endDateDisplay() {
        return this.getDate(this.end_date)
      }
    },
    mounted() {
      this.getHeaders();
    },
    methods: {
      async getHeaders() {
        const self = this
        if (!axios) {
          return
        }
        await axios.get(
          self.api_header_url
        ).then((response) => {
          self.header_options = response.data
        });
      },
      viewOnlineURL(useSparse = false) {
        const baseUrl = useSparse ? '/kondo/v1/report/flex_updates_sparse/?' : '/kondo/v1/report/flex_updates/?'
        let params = {
          format: "json",
          start_date: this.start_date != null ? this.start_date : '',
          end_date: this.end_date != null ? this.end_date : '',
          header: this.selected.join(',')
        }
        return baseUrl + this.serialize(params)
      },
      async makeReport(format) {
        const baseUrl = this.useSparse
          ? process.env.VUE_APP_KONDO_API_URL + 'report/flex_updates_sparse/'
          : process.env.VUE_APP_KONDO_API_URL + 'report/flex_updates/'

        let params = {
          format: format,
          start_date: this.start_date != null ? this.start_date : '',
          end_date: this.end_date != null ? this.end_date : '',
          header: this.selected.join(',')
        }
        this.downloadUrl(baseUrl, params)
      },
      async downloadUrl(url, params) {
        // should trigger message "Requesting report. Wait a moment..."
        this.downloadBox = true
        this.progressMessage = 'Requesting report. This may take a few minutes...'
        this.progressValue = 0
        if (!axios) {
          return
        }

        await axios.get(
          url,
          {
            params: params,
            onDownloadProgress: progressEvent => {
              const total = progressEvent.total
              const current = progressEvent.loaded

              let percentCompleted = Math.floor(current / total * 100)
              this.progressValue = percentCompleted
              this.progressMessage = "Downloading Report (" + percentCompleted + "%)"
            }
          }
        ).then(res => {
          this.progressMessage = "Report Downloaded"
          console.log(res)
          let filename_str = res.headers['content-disposition']
          const re = /filename="(.*)"/
          let filename = filename_str.match(re)[1];
          let a = document.createElement('a')
          var objurl = URL.createObjectURL(new Blob([res.data]));
          if (filename.indexOf('.json') != -1) {
            objurl = URL.createObjectURL(new Blob([JSON.stringify(res.data)], {type:'application/json'}));
          }
          a.href = objurl;
          a.download = filename;
          a.click();
        }).catch(e => {
          this.errorBox = true
          this.errorMessage = "API could not be reached. Could not download report."
          console.log(e)
        })
      },
      getDate(d_str) {
        if (typeof(d_str) == 'undefined' || d_str === '' || d_str === null) {
          return ''
        }
        return new Date(d_str).toISOString().substring(0,10)
      },
      startDateTxtUpdate(e) {
        this.start_date = e
      },
      endDateTxtUpdate(e) {
        this.end_date = e
      },
      serialize(obj) {
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      selectAll() {
        this.selected = [];
        this.header_options.forEach(h => this.selected.push(h));
      },
      unselectAll() {
        this.selected = [];
      }
    },
  }
</script>
<style scoped>
  .v-input.v-input--is-focused .v-icon {
    color: #1976d2!important;
    caret-color: #1976d2!important;
  }
</style>
