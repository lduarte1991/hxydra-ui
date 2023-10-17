<template>
  <v-app>
    <NavMenu
      current-page="customreport"
      :has-write-perms="write_perms"
      page-title="Custom Report Builder"
    />
    <v-main>
      <v-container>
        <v-card
          class="pa-5 mb-10"
        >
          <div>Use the Report Builder below to build your own custom report. If you see yourself constantly making the same report over and over, please contact Vicky to see if it can be made into a pre-built report in the Report List page.</div>
        </v-card>
        <ReportBuilder />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import NavMenu from '../../components/NavMenu';
  import ReportBuilder from '../../components/ReportBuilder';
  import getPermissionsFromCookie from '../../resources/permissions';

  export default {
    name: 'App',
    
    components: {
      NavMenu,
      ReportBuilder
    },

    data: () => ({
      write_perms: getPermissionsFromCookie()
    }),
  };
</script>
  