<template>
  <v-app>
    <NavMenu
      current-page="unique"
      has-write-permissions="write_perms"
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
  name: 'App',

  components: {
    UniqueProjectsList,
    NavMenu
  },

  data: () => ({
    write_perm: perms
  }),
};
</script>
