<template>
  <v-app>
    <v-app-bar
      app
      color="#483682"
      dark
    >
      <div class="d-flex align-center">
        <v-btn
          class="text-h4 font-weight-bold text-none"
          text
          href="/kondo_projects/"
        >
          Kondo
        </v-btn><span class="text-h7">Configure Lists</span>
      </div>

      <v-spacer />

      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-btn
            class="mx-1"
            fab
            dark
            small
            href="/kondo_projects"
            color="#483682 accent"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-home
            </v-icon>
          </v-btn>
        </template>
        <span>Project List</span>
      </v-tooltip>
      <v-tooltip
        v-if="write_perm"
        bottom
      >
        <template #activator="{on, attrs}">
          <v-btn
            
            class="mx-1"
            fab
            dark
            small
            href="/kondo_create"
            color="#483682 accent"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <span>Create New Project</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-btn
            class="mx-1"
            fab
            dark
            small
            href="/kondo_reportlist/"
            color="#483682 accent"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </template>
        <span>Download Reports</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-btn
            class="mx-1"
            fab
            dark
            small
            href="/kondo_choice/"
            color="#483682 accent"
            v-bind="attrs"
            disabled
            v-on="on"
          >
            <v-icon>
              mdi-cog
            </v-icon>
          </v-btn>
        </template>
        <span>Config Dropdown Lists</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <KondoChoice />
    </v-main>
  </v-app>
</template>

<script>
import KondoChoice from '../../components/Choice';
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
  },

  data: () => ({
    write_perm: perms
  }),
};
</script>
