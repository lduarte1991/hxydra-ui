<template>
  <v-app>
    <NavMenu
      current-page="choice"
      :has-write-perms="write_perms"
      page-title="Configure Lists" 
    />
    <v-main>
      <KondoChoice />
    </v-main>
  </v-app>
</template>

<script>
import KondoChoice from '../../components/Choice';
import NavMenu from '../../components/NavMenu';
import getPermissionsFromCookie from '../../resources/permissions';

export default {
  name: 'App',

  components: {
    KondoChoice,
    NavMenu
  },

  data: () => ({
    write_perms: getPermissionsFromCookie()
  }),
};
</script>
