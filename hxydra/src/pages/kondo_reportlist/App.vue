<template>
  <v-app>
    <NavMenu
      current-page="reports"
      :has-write-perms="write_perms"
      page-title="Reports"
    />

    <v-main>
      <ReportList />
    </v-main>
  </v-app>
</template>

<script>

import ReportList from '../../components/ReportList';
import NavMenu from '../../components/NavMenu';
import getPermissionsFromCookie from '../../resources/permissions';

export default {
  name: 'ReportsList',

  components: {
    ReportList,
    NavMenu
  },

  data: () => ({
    write_perms: getPermissionsFromCookie()
  }),
};
</script>
