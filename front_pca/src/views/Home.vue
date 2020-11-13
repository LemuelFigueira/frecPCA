<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <CreateRoom
          v-on:eventCreated="eventEmit"
          :visible="showModal"
          @close="showModal = false"
        />
        <GuestCheck
          v-on:eventCreated="eventEmit"
          :roomId="roomIdValidation"
          :visible="showModalValidation"
          @close="showModalValidation = false"
        />

        <v-app-bar class="home-header" app color="#bb22dd">
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
          <EventFilter class="event-filter" />

          <v-container class="fill-height" id="event-container" fluid>
            <v-row align="center" justify="center">
              <v-col
                cols="12"
                md="12"
                xs="12"
                lg="12"
                v-for="(something, index) in this.items"
                :key="index"
              >
                <v-card class="mx-auto" max-width="400">
                  <v-img class="white--text align-end" src="../assets/meca.jpg">
                    <v-card-title>{{ something.eventName }}</v-card-title>
                  </v-img>

                  <v-card-subtitle class="pb-0 text-left"
                    >{{ something.eventAdress }},{{
                      something.eventDistrict
                    }},{{ something.eventCity }}</v-card-subtitle
                  >

                  <v-card-text class="text--primary text-left">
                    <div class="my-4">{{ something.eventDescription }}</div>
                  </v-card-text>

                  <v-divider class="mx-4"></v-divider>

                  <v-card-text>
                    <v-chip-group column>
                      <v-chip color="primary" text-color="white"
                        ><v-icon left>mdi-calendar-check</v-icon>
                        {{ something.eventDate }}</v-chip
                      >
                      <v-chip color="primary" text-color="white"
                        ><v-icon left>mdi-account-circle</v-icon>
                        {{ something.participants }} participantes</v-chip
                      >
                      <row>
                        <v-chip color="green" text-color="white"
                          ><v-icon left>mdi-alarm-check</v-icon>Inicio:
                          {{ something.eventBeginTime }}</v-chip
                        >
                        <v-chip color="red" text-color="white"
                          ><v-icon left>mdi-alarm-check</v-icon>Fim:
                          {{ something.eventEndTime }}</v-chip
                        >
                      </row>
                    </v-chip-group>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      color="deep-purple"
                      @click="copyUrl(something.roomId)"
                      text
                      ><v-icon size="30">mdi-share-variant</v-icon></v-btn
                    >
                    <v-btn
                      color="deep-purple"
                      @click="validateEvent(something.roomId)"
                      text
                      ><v-icon size="30">mdi-account-check</v-icon></v-btn
                    >
                    <v-btn
                      color="deep-purple"
                      @click="deleteEvent(something.roomId)"
                      text
                      ><v-icon size="30">mdi-trash-can-outline</v-icon></v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-snackbar
            v-model="snackbar"
            :bottom="y === 'bottom'"
            :color="color"
            :left="x === 'left'"
            :multi-line="mode === 'multi-line'"
            :right="x === 'right'"
            :timeout="timeout"
            :top="y === 'top'"
            :vertical="mode === 'vertical'"
          >
            {{ text }}
            <template>
              <v-btn text @click="snackbar = false">Fechar</v-btn>
            </template>
          </v-snackbar>
        </v-content>
        <v-footer color="#bb22dd" width="100vw" app></v-footer>
      </v-app>
    </v-app>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import CreateRoom from "../components/CreateRoom.vue";
import Event from "@/repositories/Event";
import GuestCheck from "../components/GuestCheck.vue";
import EventFilter from "../components/EventeFilter.vue";

export default {
  props: {
    source: String,
  },
  components: {
    CreateRoom,
    GuestCheck,
    EventFilter,
  },
  data() {
    return {
      showModalValidation: false,
      roomIdValidation: "",
      color: "",
      mode: "",
      snackbar: false,
      text: "",
      timeout: 4000,
      created: false,
      x: null,
      y: "",
      showModal: false,
      items: [],
    };
  },
  computed: {
    ...mapState(["userId"]),
  },
  methods: {
    ...mapActions(["logOut"]),
    createRoom() {
      this.showModal = true;
    },
    eventEmit() {
      let user = {
        userId: this.userId,
      };
      this.getUserEvents(user);
    },

    getUserEvents() {
      let user = {
        userId: this.userId,
      };
      Event.getRooms(user).then((response) => {
        response
          .json()
          .then((data) => {
            console.log(data);
            this.items = data;
          })
          .catch((error) => console.log("error", error));
      });
    },

    deleteEvent(roomId) {
      let event = {
        roomId: roomId,
        userId: this.userId,
      };

      Event.deleteEvent(event).then((response) => {
        response
          .json()
          .then(() => {
            if (response.status === 200) {
              this.color = "success";
              this.text = "Evento excluído";
              this.y = "bottom";
              this.snackbar = true;
              this.getUserEvents();
            }
          })
          .catch((error) => console.log("error", error));
      });
    },
    validateEvent(roomId) {
      this.roomIdValidation = roomId;
      this.$store.dispatch("currentEventValidate", roomId);
      this.showModalValidation = true;
    },
    copyUrl(roomId) {
      let baseUrl = `https://vuejs-teste.s3-sa-east-1.amazonaws.com/index.html#/invite/${roomId}`;
      let result = this.$clipboard(baseUrl);
      if (result) {
        this.color = "success";
        this.text = "Url do evento copiada";
        this.y = "top";
        this.snackbar = true;
      } else {
        this.color = "error";
        this.text = "Url do evento copiada";
        this.y = "top";
        this.snackbar = true;
      }
    },
  },
  created() {
    this.getUserEvents();
  },
  mounted() {},
};
</script>

<style scoped>
div #app {
  background-color: #000;
  width: 100vw !important;

  margin: 0 0;
}

.home-header {
  width: 100vw !important;
  color: #fff;
  background-color: #bb22dd;
}

.event-filter {
  height: 60vh;
  vertical-align: baseline;
}

#event-container {
  margin-top: -6em;
}
</style>
