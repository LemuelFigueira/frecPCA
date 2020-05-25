<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Live Survey</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field label="Login" v-model="username" name="login" type="text" />

                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Senha"
                    name="password"
                    type="password"
                  />
                </v-form>
                {{notAuthenticated}}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="auth">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

import { mapActions, mapState } from "vuex";

export default {
  props: {
    source: String
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapState(["surveyId", "notAuthenticated"])
  },
  methods: {
    ...mapActions(["login"]),
    auth() {
      let username = this.username;
      let password = this.password;
      this.login({ username, password })
    }
  }
};


