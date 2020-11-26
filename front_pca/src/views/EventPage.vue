<template>
  <div id="app" class="mx-auto">
    <v-app id="inspire">
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
        <v-container>
          <div class="text-left">
            <v-btn small color="black" outlined class="my-2" to="/main"
              ><v-icon>mdi-arrow-left</v-icon>Voltar</v-btn
            >
          </div>
          <v-card class="" max-width="100%">
            <v-img class="white--text align-end" src="../assets/meca.jpg">
            </v-img>
            <v-card-title>{{ event.eventName }}</v-card-title>

            <v-card-subtitle class="pb-0 text-left"
              >{{ event.eventAdress }},{{ event.eventDistrict }},{{
                event.eventCity
              }}</v-card-subtitle
            >

            <v-card-text>
              <v-chip-group column>
                <v-chip color="primary" text-color="white" class="mx-auto"
                  ><v-icon left>mdi-calendar-check</v-icon>
                  {{ event.eventDate }}</v-chip
                >
                <!-- <v-chip color="primary" text-color="white"><v-icon left>mdi-account-circle</v-icon> {{ event.participants }} participantes</v-chip> -->
                <row class="mx-auto">
                  <v-chip color="green" text-color="white"
                    ><v-icon left>mdi-alarm-check</v-icon>Inicio:
                    {{ event.eventBeginTime }}</v-chip
                  >
                  <v-chip color="red" text-color="white"
                    ><v-icon left>mdi-alarm-check</v-icon>Fim:
                    {{ event.eventEndTime }}</v-chip
                  >
                </row>
              </v-chip-group>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-text class="text--primary text-left">
              <div class="my-4">{{ event.eventDescription }}</div>
            </v-card-text>

            <v-card-text v-if="event.freeEvent === 'false'" class="text--primary text-left">
              <div class="my-4">
                Preço do Evento: R$ {{ event.eventPrice }}
              </div>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn
                v-if="event.freeEvent === 'true'"
                color="deep-purple"
                text
                :to="{
                  name: 'registerfree',
                  params: { id: this.$route.params.id },
                }"
                >Ir para Registro</v-btn
              >
              <v-btn
                v-if="event.freeEvent === 'false' && isAuthenticated"
                color="deep-purple"
                text
                :to="{
                  name: 'registerpay',
                  params: { id: this.$route.params.id },
                }"
                >Ir para Registro</v-btn
              >
              <v-btn
                @click="showModal = true"
                v-if="event.freeEvent === 'false' && !isAuthenticated"
                color="deep-purple"
                text
                >Ir para RegistroKRAIO</v-btn
              >
            </v-card-actions>
          </v-card>
          <v-dialog
            v-model="showModal"
            
            transition="dialog-bottom-transition"
          >
            <LoginModal @close="showModal = false" />
          </v-dialog>
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
import Event from "@/repositories/Event";
import LoginModal from "@/components/loginModal.vue";

export default {
  components: {
    LoginModal,
  },
  props: {
    source: String,
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
      event: {},
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
      let baseUrl = `https://dev.d24tgjvftqomhk.amplifyapp.com/#/invite/${roomId}`;
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
    // this.getUserEvents();
  },
  mounted() {
    const newEvent = this.$route.params.id;
    Event.getroom(newEvent).then((response) => {
      response
        .json()
        .then((data) => {
          this.event = data[0];
          console.log(data);
        })
        .catch((error) => console.log("error", error));
    });
  },
};
</script>
