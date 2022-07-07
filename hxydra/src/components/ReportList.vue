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
    <v-card
      elevation="0"
    >
      <v-card-title>
        Report List <v-spacer /> <v-switch
          v-if="show_cache_ui"
          v-model="freshest"
          :label="cachedLabel"
        />
      </v-card-title>
      <v-card-text>If links don't download when clicking: Right click + Download/Save As<br><span v-if="show_cache_ui">Cached Version is faster, but may be outdated. Latest version may take a few minutes.</span></v-card-text>
      <v-container>
        <v-row
          v-for="(item, i) in reports"
          :key="i"
        >
          <v-col
            cols="12"
            sm="4"
          >
            <h3>{{ item.description }}</h3>
          </v-col>
          <v-col
            cols="4"
            sm="3"
            align="center"
          >
            <v-btn
              @click="downloadUrl(api_domain + item.url + '?format=csv' + (item.description == 'Finance Report For All Projects' ? '&sortkey=nick' : '') + '&freshest=' + freshest, item.description + '.csv')"
            >
              <v-icon>mdi-download</v-icon> CSV
            </v-btn>
            <p
              v-if="item.last_updated && !freshest && show_cache_ui"
              class="text-caption"
            >
              Last Updated:<br> {{ new Date(item.last_updated.csv).toLocaleString() }}
            </p>
          </v-col>
          <v-col
            cols="4"
            sm="3"
            align="center"
          >
            <v-btn
              @click="downloadUrl(api_domain + item.url + '?format=json'+ (item.description == 'Finance Report For All Projects' ? '&sortkey=nick' : '') +'&freshest=' + freshest, item.description + '.json')"
            >
              <v-icon>mdi-download</v-icon> JSON
            </v-btn>
            <p
              v-if="item.last_updated && !freshest && show_cache_ui"
              class="text-caption"
            >
              Last Updated:<br> {{ new Date(item.last_updated.json).toLocaleString() }}
            </p>
          </v-col>
          <v-col
            cols="4"
            sm="2"
            align="center"
          >
            <v-btn
              :href="'/kondo_reportview/?url=' + item.url + '&title=' + item.description + (item.description == 'Finance Report For All Projects' ? '&sortkey=nick' : '') + '&freshest=' + freshest"
            >
              <v-icon class="mr-2">
                mdi-eye
              </v-icon> View
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- <v-card
      class="mt-10"
      elevation="10"
    >
      <v-card-title class="justify-center">
        {{ selected_report_title }}
      </v-card-title>
        <v-container v-if="loading">
          <v-row>
            <v-col align="center">
              <v-icon class="spin">mdi-reload</v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="center">
              {{ loadProgress }} %
            </v-col>
          </v-row>
        </v-container>
        <v-data-table
          v-if="tableData.length > 0"
          :headers="tableHeaders"
          :items="tableData"
          :items-per-page="25"
          class="elevation-1"
          :search="search"
          :custom-filter="filter"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
              prepend-inner-icon="mdi-magnify"
              outlined
            ></v-text-field>
          </template>
        </v-data-table>
    </v-card> -->
  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'ReportList',
    components: {
    },
    data: () => ({
      reports: [],
      api_domain: process.env.VUE_APP_KONDO_DOMAIN,
      api_url: process.env.VUE_APP_KONDO_API_URL + 'report/',
      show_cache_ui: process.env.VUE_APP_SHOW_CACHE_UI,
      progressValue: 0,
      errorBox: false,
      errorMessage: '',
      downloadBox: false,
      progressMessage: '',
      loadProgress: 0,
      freshest: false,
      tableHeaders: [],
      tableData: [],
      loading: false,
      selected_report_title: "Select Report Above to View Online",
      search: '',
      test_reports: [{
        name: 'Courses Launching in 14 Days',
        link: 'https://google.com'
      }, {
        name: 'Courses Launching in 30 Days',
        link: 'https://google.com'
      }, {
        name: 'Courses Launching in 60 Days',
        link: 'https://google.com'
      }]
    }),
    computed: {
      cachedLabel() {
        return this.freshest ? 'Requesting Latest Version' : 'Requesting Cached Version'
      }
    },
    mounted() {
      this.getReports();
    },
    methods: {
      async getReports () {
        const self = this
        if (!axios) {
          return
        }
        await axios.get(
          self.api_url
        )
          .then(data => {
            self.reports = data.data
          })
          .catch(function(e) {
            self.errorBox = true
            self.errorMessage = "API could not be reached. Using fake data."
            console.log(e)
            self.reports = self.test_reports
          });
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
      // async viewOnline(urlLink, selected_report) {
      //   this.selected_report_title = selected_report.description
      //   this.loading = true
      //   this.loadProgress = "Making Request. It may say 0% for a few minutes... - 0"
      //   this.tableData = []
      //   this.tableHeaders = []
      //   if (!axios) {
      //     return
      //   }

      //   await axios.get(
      //     urlLink,
      //     {
      //       onDownloadProgress: progressEvent => {
      //         const total = progressEvent.total
      //         const current = progressEvent.loaded

      //         let percentCompleted = Math.floor(current / total * 100)
      //         this.loadProgress = percentCompleted
      //       }
      //     }
      //   ).then(res => {
      //     let data_found = res.data
      //     this.tableHeaders = []
      //     if(data_found.length > 0) {
      //       let sample_val = data_found[0]
      //       for (const key in sample_val) {
      //         if (Object.hasOwnProperty.call(sample_val, key)) {
      //           this.tableHeaders.push({
      //             text: key.replace('_', ' ').toUpperCase(),
      //             sortable: true,
      //             value: key,
      //             width: "150px"
      //           })
      //         }
      //       }
      //     }
      //     this.tableData = data_found
      //     this.loading = false
      //   })
      // },
      filter (value, search) {
        if (value && search) {
          if (typeof(value) !== "undefined") {
            return value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) > -1
          }
        }
        return false
      }
    }
  }
</script>

<style>
  .spin {
    animation-name: spin;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  @keyframes spin {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
  }
</style>