<template>
  <v-app>
    <NavMenu
      current-page="updates"
      :has-write-perms="write_perms"
      page-title="Updates Report"
    />
    <v-main>
      <v-container>
        <v-card
          class="pa-5 mb-10"
        >
          <div>Use the report builder below to generate a custom updates report. Filter by date range and select which fields you want to include in the report.</div>
        </v-card>
        <UpdatesReportBuilder />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import NavMenu from '../../components/NavMenu';
  import UpdatesReportBuilder from '../../components/UpdatesReportBuilder';
  import getPermissionsFromCookie from '../../resources/permissions';

  export default {
    name: 'App',
    
    components: {
      NavMenu,
      UpdatesReportBuilder
    },

    data: () => ({
      write_perms: getPermissionsFromCookie()
    }),
  };
</script>
