<template>
  <div id="app">
    <v-app>
      <v-app-bar app fixed color="deep-purple" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Eventos</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn
          v-if="isAuthenticated"
          light
          small
          color="white"
          class="mr-5"
          @click="createRoom"
          >Criar evento</v-btn
        >

        <v-btn
          v-if="!isAuthenticated"
          light
          small
          color="white"
          class="mr-5"
          to="/login"
          >Logar</v-btn
        >
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary app class="text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Menu Evento</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list nav dense>
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <router-link to="/main" style="text-decoration: none; color: inherit;">
              <v-list-item>
                <v-list-item-title>Lista de Eventos</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-divider></v-divider>

            <router-link to="/home" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="isAuthenticated">
                <v-list-item-title>Meus eventos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/registerevent" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="isAuthenticated">
                <v-list-item-title>Eventos Inscritos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="!isAuthenticated">
                <v-list-item-title>Logar</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="!isAuthenticated">
                <v-list-item-title>Cadastrar</v-list-item-title>
              </v-list-item>
            </router-link>

            <v-list-item v-if="isAuthenticated">
              <v-list-item-title @click="sair()">
                <v-icon small>mdi-exit-to-app</v-icon>Sair
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-content>
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
                  <v-card-title>{{ something.eventName }}</v-card-title>
                </v-img>

                <v-card-subtitle class="pb-0 text-left"
                  >{{ something.eventAdress }},{{ something.eventDistrict }},{{
                    something.eventCity
                  }}</v-card-subtitle
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
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import CreateRoom from "../components/CreateRoom.vue";
import Event from "@/repositories/Event";
import Participant from "@/repositories/Participant";
import GuestCheck from "../components/GuestCheck.vue";
export default {
  props: {
    source: String,
  },
  components: {
    CreateRoom,
    GuestCheck,
  },
  data() {
    return {
      drawer: false,
      group: null,
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
      userRegister: [],
      items: [],
      salas: []
      
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    ...mapActions(["logOut"]),
    createRoom() {
      this.showModal = true;
    },
    sair() {
      this.logOut();
      this.drawer = false;
    },
    eventEmit() {
      let user = {
        userId: this.userId,
      };
      this.getUserEvents(user);
    },
    getAllRegisterEvents(){
      
    },
    getAllParticipantRooms() {
      let user = {
        participantId: this.userId,
      };
      Participant.getAllParticipantRooms(user).then((response) => {
        response
          .json()
          .then((data) => {
            data.find((object) =>  {
              this.userRegister.push(object.roomId)
            })
            Event.getAllRooms().then((response) => {
              response
                .json()
                .then((data) => {
                  data.find((object) => {
                    if(this.userRegister.includes(object.roomId)){
                      this.items.push(object)
                    }
                  })
                  console.log("KRL", this.items)
                })
                .catch((error) => console.log("error", error));
            });
          })
          .catch((error) => console.log("error", error));
      });
    },
    getAllEvents() {
      Event.getAllRooms().then((response) => {
        response
          .json()
          .then((data) => {
            console.log(data);
            // this.filterEvent(data);
            this.salas = data;
          })
          .catch((error) => console.log("error", error));
      });
    },
  },
  created() {
    this.getAllParticipantRooms();
    this.getAllRegisterEvents();
    // this.getAllEvents();
  },
  mounted() {},
};
</script>
