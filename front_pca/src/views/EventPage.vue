<template>
  <div id="app" class="mx-auto">
    <v-app id="inspire">
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
        <v-container class="fill-height mx-auto" fluid>

              <v-card class="" max-width="100%">
                <v-img class="white--text align-end" src="../assets/meca.jpg">
                </v-img>
                <v-card-title>{{event.eventName}}</v-card-title>

                <v-card-subtitle class="pb-0 text-left">{{event.eventAdress}},{{event.eventDistrict}},{{event.eventCity}}</v-card-subtitle>

                <v-card-text>
                  <v-chip-group column>
                    <v-chip color="primary" text-color="white"><v-icon left>mdi-calendar-check</v-icon> {{ event.eventDate }}</v-chip>
                    <v-chip color="green" text-color="white"><v-icon left>mdi-alarm-check</v-icon>Inicio: {{ event.eventBeginTime }}</v-chip>
                    <!-- <v-chip color="primary" text-color="white"><v-icon left>mdi-account-circle</v-icon> {{ event.participants }} participantes</v-chip> -->
                    <!-- <row> -->
                    <!-- <v-chip color="red" text-color="white"><v-icon left>mdi-alarm-check</v-icon>Fim: {{ event.eventEndTime }}</v-chip> -->
                    <!-- </row> -->
                  </v-chip-group>
                </v-card-text> 

                <v-divider class="mx-4"></v-divider>

                <v-card-text class="text--primary text-left">
                  <div class="my-4">{{event.eventDescription}}</div>
                </v-card-text>

                <v-card-actions class="justify-center">
                  <v-btn  color="deep-purple" text :to="{name: 'invite',params: { id: this.$route.params.id }}">Ir para Registro</v-btn>
                </v-card-actions>
              </v-card>

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
import { mapActions, mapState } from "vuex";
import Event from "@/repositories/Event";

export default {
  props: {
    source: String
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
      y: '',
      showModal: false,
      event: {}
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
            console.log(data);
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
              this.text = "Evento excluído";
              this.y = 'bottom'
              this.snackbar = true;
              this.getUserEvents();
            }
          })
          .catch(error => console.log("error", error));
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
        this.y = 'top'
        this.snackbar = true;
      } else {
        this.color = "error";
        this.text = "Url do evento copiada";
        this.y = 'top'
        this.snackbar = true;
      }
    }
  },
  created() {
    // this.getUserEvents();
  },
  mounted() {
    const newEvent = this.$route.params.id;
    Event.getroom(newEvent).then(response => {
      response
        .json()
        .then(data => {
          this.event = data[0]
          // console.log(data);
        })
        .catch(error => console.log("error", error));
    });
  }
};
</script>
