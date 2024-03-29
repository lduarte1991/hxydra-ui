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
    <v-card-title>Report Builder</v-card-title>
    <v-row
      row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-4"
      >
        <v-menu
          v-model="launchBeforeDatePop"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="launchBeforeDisplay"
              clearable
              v-on="on"
              @click:clear="launch_before = ''"
              @change="launchBeforeTxtUpdate"
            >
              <template slot="label">
                <v-icon>mdi-calendar-month</v-icon> Launched Before
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="launch_before"
            no-title
            @change="launchBeforeDatePop = false"
          />
        </v-menu>
      </v-col>
      <v-col
        class="col-4"
      >
        <v-menu
          v-model="launchAfterDatePop"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="launchAfterDisplay"
              clearable
              v-on="on"
              @click:clear="launch_after = ''"
              @change="launchAfterTxtUpdate"
            >
              <template slot="label">
                <v-icon>mdi-calendar-month</v-icon> Launched After
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="launch_after"
            no-title
            @change="launchAfterDatePop = false"
          />
        </v-menu>
      </v-col>
      <v-col
        class="col-3"
      >
        <v-checkbox
          v-model="include_launch_after_none"
          label="Include NULL launch date"
        />
      </v-col>
    </v-row>
    <v-row
      row
      wrap
      class="mx-5"
    >
      <v-col
        class="col-4"
      >
        <v-menu
          v-model="endBeforeDatePop"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="endBeforeDisplay"
              clearable
              v-on="on"
              @click:clear="end_before = ''"
              @change="endBeforeTxtUpdate"
            >
              <template slot="label">
                <v-icon>mdi-calendar-month</v-icon> End Before
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="end_before"
            no-title
            @change="endBeforeDatePop = false"
          />
        </v-menu>
      </v-col>
      <v-col
        class="col-4"
      >
        <v-menu
          v-model="endAfterDatePop"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="endAfterDisplay"
              clearable
              v-on="on"
              @click:clear="end_after = ''"
              @change="endAfterTxtUpdate"
            >
              <template slot="label">
                <v-icon>mdi-calendar-month</v-icon> End After
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="end_after"
            no-title
            @change="endAfterDatePop = false"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row
      row
      wrap
      class="mx-5"
    >
      <v-col>
        <v-checkbox
          v-model="exclude_video_archived"
          label="Report should exclude projects whose videos have been archived."
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
          At least one column must be included to create custom report.
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
          Download CSV Custom Report
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
          Download JSON Custom Report
        </v-btn>
      </v-col>
      <v-col
        class="col-12"
        align="center"
      >
        <v-btn
          class="mb-5"
          :href="'/kondo_reportview/?url=' + encodeURIComponent(viewOnlineURL) + '&title=Custom%20Report&freshest=true'"
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
    name: 'ReportBuilder',
    props: {},
    data: () => ({
      launchBeforeDatePop: false,
      launchAfterDatePop: false,
      endBeforeDatePop: false,
      endAfterDatePop: false,

      // form items
      launch_before: '',
      launch_after: '',
      end_before: '',
      end_after: '',
      include_launch_after_none: false,
      exclude_video_archived: false,
      header: '',
      header_options: [],
      selected: ["nickname"],

      //download stuff
      progressValue: 0,
      errorBox: false,
      errorMessage: '',
      downloadBox: false,
      progressMessage: '',
      loadProgress: 0,

      //api urls
      api_report_url: process.env.VUE_APP_KONDO_API_URL + 'report/',
      api_header_url: process.env.VUE_APP_KONDO_API_URL + 'reportheader/flex/',
      api_flex_url: process.env.VUE_APP_KONDO_API_URL + 'report/flex/',
    }),
    computed: {
      launchBeforeDisplay() {
        return this.getDate(this.launch_before)
      },
      launchAfterDisplay() {
        return this.getDate(this.launch_after)
      },
      endBeforeDisplay() {
        return this.getDate(this.end_before)
      },
      endAfterDisplay() {
        return this.getDate(this.end_after)
      },
      viewOnlineURL() {
        let params = {
          format: "json",
          launch_before: this.launch_before != null ? this.launch_before : '',
          launch_after: this.launch_after != null ? this.launch_after : '',
          include_launch_after_none: this.include_launch_after_none,
          end_before: this.end_before != null ? this.end_before : '',
          end_after: this.end_after != null ? this.end_after : '',
          exclude_video_archived: this.exclude_video_archived,
          header: this.selected.join(',')
        }
        return "/kondo/v1/report/flex/?" + this.serialize(params);
      },
      customReportURLJSON() {
        let params = {
          format: "json",
          launch_before: this.launch_before != null ? this.launch_before : '',
          launch_after: this.launch_after != null ? this.launch_after : '',
          include_launch_after_none: this.include_launch_after_none,
          end_before: this.end_before != null ? this.end_before : '',
          end_after: this.end_after != null ? this.end_after : '',
          exclude_video_archived: this.exclude_video_archived,
          header: this.selected.join(',')
        }
        return this.api_flex_url + "?" + this.serialize(params); 
      },
      customReportURLCSV() {
        let params = {
          format: "csv",
          launch_before: this.launch_before != null ? this.launch_before : '',
          launch_after: this.launch_after != null ? this.launch_after : '',
          include_launch_after_none: this.include_launch_after_none,
          end_before: this.end_before != null ? this.end_before : '',
          end_after: this.end_after != null ? this.end_after : '',
          exclude_video_archived: this.exclude_video_archived,
          header: this.selected.join(',')
        }
        return this.api_flex_url + "?" + this.serialize(params); 
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
      async makeReport(format) {
        if (format == "csv") {
          this.downloadUrl(this.customReportURLCSV)
        } else {
          this.downloadUrl(this.customReportURLJSON)
        }
        
      },
      async downloadUrl(url) {
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
      launchBeforeTxtUpdate(e) {
        this.launch_before = e
      },
      launchAfterTxtUpdate(e) {
        this.launch_after = e
      },
      endBeforeTxtUpdate(e) {
        this.end_before = e
      },
      endAfterTxtUpdate(e) {
        this.end_after = e
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