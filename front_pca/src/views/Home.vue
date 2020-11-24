<template>
  <div id="app">
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
            <router-link to="/main">
              <v-list-item>
                <v-list-item-title>Lista de Eventos</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-divider></v-divider>

            <router-link to="/home">
              <v-list-item v-if="isAuthenticated">
                <v-list-item-title>Meus eventos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/registerevent">
              <v-list-item v-if="isAuthenticated">
                <v-list-item-title>Eventos Inscritos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login">
              <v-list-item v-if="!isAuthenticated">
                <v-list-item-title>Logar</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login">
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

        <v-container>
          <v-row no-gutters>
            <v-col xs="12" md="12" lg="4">
              <div>
                <v-select
                  label="Selecione uma categoria"
                  v-model="selectCategory"
                  class="select-category"
                  :items="categories"
                ></v-select>
              </div>
            </v-col>
            <div style="padding-top: 25px">
              <v-btn
                @click="searchEventByCategory"
                class="mx-2"
                icon
                dark
                small
                color="primary"
              >
                <v-icon dark>mdi-magnify</v-icon>
              </v-btn>
            </div>
          </v-row>
          <v-row>
            <v-col xs="12" md="12" lg="4">
              <div class="text-center" v-if="search">
                <v-btn rounded :color="categoryColor" dark>{{
                  category
                }}</v-btn>
                <v-btn icon dark small color="primary" @click="clearSearch">
                  <v-icon dark>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              xs="12"
              md="12"
              lg="4"
              v-for="(something, index) in this.items"
              :key="index"
            >
              <router-link
                :to="{
                  name: 'EventPage',
                  params: { id: something.roomId },
                  query: { room: something },
                }"
              >
                <v-card class="mx-auto" max-width="310">
                  <v-img
                    style="height: 130px"
                    class="white--text align-end"
                    src="../assets/meca.jpg"
                  ></v-img>

                  <v-card-title class="pb-5">
                    {{ something.eventName }}
                  </v-card-title>

                  <v-card-subtitle class="pt-1 pb-0 text-left">
                    {{ something.eventDate }} |
                    {{ something.eventBeginTime }}
                  </v-card-subtitle>

                  <v-card-subtitle class="text-left">
                    {{ something.eventDistrict }},
                    {{ something.eventCity }}
                  </v-card-subtitle>

                  <!-- <v-card-actions class="justify-center">
                    <v-btn color="deep-purple" @click="copyUrl(something.roomId)" text><v-icon size="30"  >mdi-share-variant</v-icon></v-btn>
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
                    ><v-icon size="30">mdi-trash-can-outline</v-icon></v-btn>
                  </v-card-actions>-->
                </v-card>
              </router-link>
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
      selectCategory: null,
      categoryColor: null,
      search: false,
      category: null,
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
      items: [],
      categories: [
        "Tecnologia",
        "Cultura e Lazer",
        "Esporte",
        "E-sport",
        "Show ao vivo",
        "Beleza e Moda",
      ],
      colors: ["lime", "teal", "purple", "black", "cyan", "indigo"],
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["isAuthenticated"]),
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    ...mapActions(["logOut"]),
    clearSearch() {
      this.search = false;
      this.selectCategory = false;
    },
    searchEventByCategory() {
      let index = this.categories.indexOf(this.selectCategory);
      let getColor = this.colors[index];
      this.categoryColor = getColor;
      this.search = true;
      this.category = this.selectCategory;
    },
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

    getAllEvents() {
      Event.getAllRooms().then((response) => {
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
    this.getAllEvents();
  },
  mounted() {},
};
</script>

<style scoped>
div #app {
  width: 100vw !important;
}

.home-header {
  width: 100vw !important;
  color: #fff;
  background-color: #bb22dd;
}

.filter-box {
  margin-top: 1em;
}

#event-container {
  margin-top: 0em;
}
</style>
