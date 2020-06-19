<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <CreateRoom :visible="showModal" @close="showModal=false" />
        <!-- <GuestCheck :visible="showModal" @close="showModal=false" /> -->
        <v-app-bar app color="deep-purple" dark>
          <v-toolbar-title>Eventos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="mx-3" fab dark small color="white" @click="createRoom">
            <v-icon dark color="deep-purple">mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu left bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="this.logOut">Sair</v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
        <v-content>
          <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
              <v-col class="text-center">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-3" fab dark small color="white" @click="guestcheck">
                      <v-icon dark color="deep-purple">mdi-plus</v-icon>
                    </v-btn>
                    <v-btn :href="source" icon large target="_blank" v-on="on">
                      <v-icon large>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-content>
        <v-footer color="deep-purple" app></v-footer>
      </v-app>
    </v-app>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import CreateRoom from "../components/CreateRoom.vue";
// import GuestCheck from "../components/GuestCheck.vue";
export default {
  props: {
    source: String
  },
  components: {
    CreateRoom,
   
  },
  data() {
    return {
      showModal: false
    };
  },
  methods: {
    ...mapActions(["logOut"]),
    createRoom() {
      this.showModal = true;
    },
    // guestcheck() {
    //   this.showModal = true;
    // }
  },
  mounted() {}
};
</script>
