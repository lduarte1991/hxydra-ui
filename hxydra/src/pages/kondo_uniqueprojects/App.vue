<template>
  <v-app>
    <NavMenu
      current-page="unique"
      :has-write-perms="write_perms"
      page-title="Unique Projects"
    />
    <v-main>
      <UniqueProjectsList />
    </v-main>
  </v-app>
</template>

<script>
import UniqueProjectsList from '../../components/UniqueProjectsList';
import NavMenu from '../../components/NavMenu.vue';
import getPermissionsFromCookie from '../../resources/permissions';

export default {
  name: 'App',

  components: {
    UniqueProjectsList,
    NavMenu
  },

  data: () => ({
    write_perms: getPermissionsFromCookie()
  }),
};
</script>
