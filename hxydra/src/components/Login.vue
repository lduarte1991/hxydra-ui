<template>
  <v-container>
    <v-row class="text-center">
      <v-col
        class="mb-4 mt-15"
        cols="12"
      >
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Kondo
        </h1>

        <p class="subheading font-weight-regular">
          webapp formerly known as theSystem
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="6"
        offset="3"
      >
        <v-form>
          <v-card class="elevation-12">
            <v-toolbar
              dark
              color="#483682"
            >
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        prepend-icon="mdi-account"
                        name="username"
                        label="username"
                        type="text"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        prepend-icon="mdi-lock"
                        name="password"
                        label="password"
                        type="password"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="#483682"
                href="/kondo_projects"
                dark
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'LoginPage',

    data: () => ({
    }),
  }
</script>
