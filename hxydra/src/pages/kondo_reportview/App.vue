<template>
  <v-app>
    <NavMenu
      current-page=""
      :has-write-perms="write_perms"
      page-title="Report View"
    />

    <v-main>
      <ReportView />
    </v-main>
  </v-app>
</template>

<script>

import ReportView from '../../components/ReportView';
import NavMenu from '../../components/NavMenu.vue';
import getPermissionsFromCookie from '../../resources/permissions';

export default {
  name: 'ReportTableView',

  components: {
    ReportView,
    NavMenu
  },

  data: () => ({
    write_perms: getPermissionsFromCookie()
  }),
};
</script>
