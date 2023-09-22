<template>
  <v-app>
    <NavMenu
      current-page="choice"
      has-write-permissions="write_perms"
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
    KondoChoice,
    NavMenu
  },

  data: () => ({
    write_perm: perms
  }),
};
</script>
