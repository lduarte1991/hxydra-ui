<template>
  <v-container>
    <v-card>
      <v-card-title>
        Unique Projects
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
      ></v-data-table>
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
        width: '10%'
      },{
        text: 'Sequence',
        sortable: true,
        value: 'sequence',
        width: '5%'
      },{
        text: 'Title',
        sortable: true,
        value: 'title',
        width: '75%'
      },{
        text: 'Actions',
        sortable: false,
        align: 'center',
        width: '10%'
      },],
      api_uniqueprojects_url: process.env.VUE_APP_KONDO_API_URL + 'projectps/',
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
          self.api_uniqueprojects_url
        )
          .then(data => {
            self.projects = data.data
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