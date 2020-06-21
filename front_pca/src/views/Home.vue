<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <CreateRoom v-on:eventCreated="eventEmit" :visible="showModal" @close="showModal=false" />
        <GuestCheck v-on:eventCreated="eventEmit" :roomId="roomIdValidation" :visible="showModalValidation" @close="showModalValidation=false" />
   
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
                    <v-card-title>{{something.eventName}}</v-card-title>
                  </v-img>

                  <v-card-subtitle class="pb-0">{{something.eventDescription}}</v-card-subtitle>

                  <v-card-text class="text--primary">
                    <p style="white-space: pre-line;">Começa às: {{something.eventBeginTime}}</p>
                    <p style="white-space: pre-line;">Termina às: {{something.eventEndTime}}</p>
                    <p
                      style="white-space: pre-line;"
                    >Endereço: {{something.eventAdress}} - {{something.eventDistrict}} - {{something.eventCity}}</p>
                    <p style="white-space: pre-line;">Participantes: {{something.participants}}</p>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn x-small color="orange" text>Copiar Url</v-btn>
                    <v-btn x-small color="orange" @click="validateEvent(something.roomId)" text>Validar</v-btn>
                    <v-btn
                      x-small
                      color="orange"
                      @click="deleteEvent(something.roomId)"
                      text
                    >Excluir Evento</v-btn>
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
        <v-footer color="deep-purple" app></v-footer>
      </v-app>
    </v-app>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import CreateRoom from "../components/CreateRoom.vue";
import Event from "@/repositories/Event";
import GuestCheck from "../components/GuestCheck.vue";
export default {
  props: {
    source: String
  },
  components: {
    CreateRoom,
    GuestCheck
  },
  data() {
    return {
      showModalValidation:false,
      roomIdValidation:'',
      color: "",
      mode: "",
      snackbar: false,
      text: "",
      timeout: 4000,
      created: false,
      x: null,
      y: "bottom",
      showModal: false,
      items: []
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    ...mapActions(["logOut"]),
    createRoom() {
      this.showModal = true;
    },
    eventEmit() {
      let user = {
        userId: this.userId
      };
      this.getUserEvents(user);
    },

    getUserEvents() {
      let user = {
        userId: this.userId
      };
      Event.getRooms(user).then(response => {
        response
          .json()
          .then(data => {
            console.log(data)
            this.items = data;
          })
          .catch(error => console.log("error", error));
      });
    },

    deleteEvent(roomId) {
      let event = {
        roomId: roomId,
        userId: this.userId
      };

      Event.deleteEvent(event).then(response => {
        response
          .json()
          .then(() => {
            if (response.status === 200) {
              this.color = "success";
              this.text = "Evento excluído"
              this.snackbar = true
              this.getUserEvents();
            }
          })
          .catch(error => console.log("error", error));
      });
    },
    validateEvent(roomId) {
      this.roomIdValidation = roomId
      this.$store.dispatch('currentEventValidate',roomId)
      this.showModalValidation = true
    
    }
  },
  created() {
    this.getUserEvents();
  },
  mounted() {}
};
</script>
