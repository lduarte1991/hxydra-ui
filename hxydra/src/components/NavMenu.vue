<template>
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
      </v-btn><span class="text-h7">{{ pageTitle }}</span>
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
          :disabled="currentPage == 'projects'"
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
          href="/kondo_uniqueprojects"
          color="#483682 accent"
          :disabled="currentPage == 'unique'"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            mdi-snowflake
          </v-icon>
        </v-btn>
      </template>
      <span>Unique Projects</span>
    </v-tooltip>
    <v-tooltip
      v-if="hasWritePerms.create || hasWritePerms.admin"
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
          :disabled="currentPage == 'create'"
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
          :disabled="currentPage == 'reports'"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            mdi-chart-box-outline
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
          href="/kondo_customreport/"
          color="#483682 accent"
          :disabled="currentPage == 'customreport'"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            mdi-chart-box-plus-outline
          </v-icon>
        </v-btn>
      </template>
      <span>Custom Report</span>
    </v-tooltip>
    <v-tooltip 
      v-if="hasWritePerms.admin"
      bottom
    >
      <template #activator="{on, attrs}">
        <v-btn
          class="mx-1"
          fab
          dark
          small
          href="/kondo_choice/"
          color="#483682 accent"
          :disabled="currentPage == 'choice'"
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
</template>
<script>
  export default {
  name: 'NavMenu',
  props: {
    currentPage: {
      default: "",
      type: String
    },
    hasWritePerms: {
      default () {
        return {
          admin: false,
          read: true,
          update: false,
          create: false,
          delete: false
        }
      },
      type: Object
    },
    pageTitle: {
      default: "",
      type: String
    }
  },
  data: () => ({
  }),
  }
</script>