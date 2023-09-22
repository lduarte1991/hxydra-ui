<template>
  <v-app>
    <NavMenu
      current-page="create"
      :has-write-perms="write_perms"
      page-title="Create New Project"
    />
    <v-main>
      <CreateForm />
    </v-main>
  </v-app>
</template>

<script>
import CreateForm from '../../components/CreateForm';
import NavMenu from '../../components/NavMenu';
import getPermissionsFromCookie from '../../resources/permissions';

export default {
  name: 'App',
  
  components: {
    CreateForm,
    NavMenu
  },

  data: () => ({
    write_perms: getPermissionsFromCookie()
  }),
};
</script>
