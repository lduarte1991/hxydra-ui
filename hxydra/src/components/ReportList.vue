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
    <v-card>
      <v-card-title>
        Report List
      </v-card-title>
      <v-list flat>
        <v-list-item
          v-for="(item, i) in reports"
          :key="i"
        >
          <a href="item.link">{{item.name}}</a>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'ReportList',
    components: {
    },
    data: () => ({
      reports: [],
      api_url: '',
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
    methods: {
      async getReports () {
        const self = this
        await this.$http.get(
          self.api_url
        )
          .then(data => {
            console.log(data)
            self.reports = data.data
          })
          .catch(function(e) {
            self.errorBox = true
            self.errorMessage = "API could not be reached. Using fake data."
            console.log(e)
            self.reports = self.test_reports
          });
      },
    },
    mounted() {
      this.getReports();
    }
  }
</script>