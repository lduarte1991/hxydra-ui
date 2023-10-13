<template>
  <v-app>
    <NavMenu
      current-page="projects"
      :has-write-perms="write_perms"
      page-title=""
    />
    <v-main>
      <ProjectsList />
    </v-main>
  </v-app>
</template>

<script>
import ProjectsList from '../../components/ProjectsList';
import NavMenu from '../../components/NavMenu';
import getPermissionsFromCookie from '../../resources/permissions';

export default {
  name: 'App',

  components: {
    ProjectsList,
    NavMenu
  },

  data: () => ({
    write_perms: getPermissionsFromCookie()
  }),
};
</script>
