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
        </v-btn><span class="text-h7">Create New Project</span>
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
      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-btn
            
            class="mx-1"
            fab
            dark
            small
            href="/kondo_create"
            color="#483682 accent"
            v-bind="attrs"
            disabled
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
      <CreateForm />
    </v-main>
  </v-app>
</template>

<script>
import CreateForm from '../../components/CreateForm';

export default {
  name: 'App',

  components: {
    CreateForm,
  },

  data: () => ({
    //
  }),
};
</script>
