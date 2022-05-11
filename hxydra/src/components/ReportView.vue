<template>
  <v-container>

    <v-snackbar
      v-model="errorBox"
      top
      elevation="10"
      color="error"
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
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
    <v-card
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
    </v-card>
  </v-container>
</template>

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

<script>
  import axios from 'axios'
  export default {
    name: 'ReportView',
    components: {
    },
    data: () => ({
      reports: [],
      api_domain: process.env.VUE_APP_KONDO_DOMAIN,
      api_url: process.env.VUE_APP_KONDO_API_URL + 'report/',
      progressValue: 0,
      errorBox: false,
      errorMessage: '',
      downloadBox: false,
      progressMessage: '',
      loadProgress: 0,
      tableHeaders: [],
      tableData: [],
      loading: false,
      selected_report_title: "Select Report Above to View Online",
      search: '',
    }),
    methods: {
      async viewOnline(urlLink, selected_report) {
        this.selected_report_title = selected_report
        this.loading = true
        this.loadProgress = "Making Request. It may say 0% for a few minutes... - 0"
        this.tableData = []
        this.tableHeaders = []
        if (!axios) {
          return
        }

        await axios.get(
          urlLink,
          {
            onDownloadProgress: progressEvent => {
              const total = progressEvent.total
              const current = progressEvent.loaded

              let percentCompleted = Math.floor(current / total * 100)
              this.loadProgress = percentCompleted
            }
          }
        ).then(res => {
          let data_found = res.data
          this.tableHeaders = []
          if(data_found.length > 0) {
            let sample_val = data_found[0]
            for (const key in sample_val) {
              if (Object.hasOwnProperty.call(sample_val, key)) {
                this.tableHeaders.push({
                  text: key.replace('_', ' ').toUpperCase(),
                  sortable: true,
                  value: key,
                  width: "150px"
                })
              }
            }
          }
          this.tableData = data_found
          this.loading = false
        })
      },
      filter (value, search) {
        if (value && search) {
          if (typeof(value) !== "undefined") {
            return value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) > -1
          }
        }
        return false
      }
    },
    mounted() {
      // from stackoverflow
      // https://stackoverflow.com/questions/35914069/how-can-i-get-query-parameters-from-a-url-in-vue-js
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
        this.viewOnline(this.api_domain + getVars['url'] + '?format=json&freshest=' + getVars['freshest'], decodeURI(getVars['title']))
      }
    }
  }
</script>