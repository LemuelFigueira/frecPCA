<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      fullscreen
      width="unset"
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn color="deep-purple" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="deep-purple">
          <v-btn icon dark @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Criar Evento</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="submit">Criar!</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-col cols="12" md="10" xs="10" lg="10">
            <v-file-input
              label="Imagem do evento"
              accept="image/png, image/jpeg, image/bmp, image/jpeg"
              :rules="rules"
              v-model="roomPic"
              filled
              prepend-icon="mdi-camera"
            ></v-file-input>
            <p v-if="invalidImage">{{invalidImage}}</p>
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="beginTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="beginTime"
                  label="Início do evento"
                  prepend-icon="access_time"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                color="green lighten-1"
                :error-messages="participantsErrors"
                v-if="menu1"
                v-model="beginTime"
                full-width
                @click:minute="$refs.menu1.save(beginTime)"
              ></v-time-picker>
            </v-menu>
            <p v-if="errorMessagebeginTime">{{errorMessagebeginTime}}</p>
            <form>
              <v-menu
                ref="menu"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="endTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endTime"
                    label="Fim do evento"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  color="red lighten-1"
                  :error-messages="participantsErrors"
                  v-if="menu2"
                  v-model="endTime"
                  full-width
                  @click:minute="$refs.menu.save(endTime)"
                ></v-time-picker>
              </v-menu>
              <p v-if="errorMessageEndTime">{{errorMessageEndTime}}</p>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="50"
                label="Nome"
                required
              ></v-text-field>
              <v-text-field
                label="Descrição"
                v-model="description"
                :error-messages="descriptionErrors"
                :counter="100"
              ></v-text-field>
              <v-text-field label="Endereço" v-model="adress" :error-messages="adressErrors"></v-text-field>
              <v-text-field label="Cidade" v-model="city" :error-messages="cityErrors"></v-text-field>
              <v-text-field label="Bairro" v-model="district" :error-messages="districtErrors"></v-text-field>

              <v-select
                v-model="numberParticipants"
                :error-messages="participantsErrors"
                :items="quantidade"
                filled
                required
                :menu-props="{ maxHeight:'200' }"
                hint="Quantidade de participantes"
                persistent-hint
              ></v-select>
            </form>
          </v-col>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Event from "@/repositories/Event";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState } from "vuex";
// import VueTimepicker from "vue2-timepicker";
// import "vue2-timepicker/dist/VueTimepicker.css";
export default {
  validations: {
    name: { required, maxLength: maxLength(50) },
    description: { required, maxLength: maxLength(100) },
    adress: { required },
    district: { required },
    city: { required },
    numberParticipants: { required }
  },
  data() {
    return {
      beginTime: null,
      menu1: false,
      modal1: false,
      endTime: null,
      menu2: false,
      modal2: false,
      invalidImage: null,
      errorMessagebeginTime: null,
      errorMessageEndTime: null,
      quantidade: [10, 50, 100, 300, 500, 1000],
      name: "",
      adress: "",
      city: "",
      district: "",
      roomPic: null,
      description: "",
      numberParticipants: "",
      dialog: false,
      rules: [
        value =>
          !value ||
          value.size < 5000000 ||
          "A foto do evento deve ser menor que 5 MB"
      ],

      notifications: false,
      sound: true,
      widgets: false
    };
  },
  props: {
    visible: Boolean
  },
  methods: {
    async submit() {
      this.$v.$touch();
      const result = await this.$v.$anyError;

      let fileType = this.roomPic ? this.roomPic.type.split("/")[0] : "";
      let picture = this.roomPic ? this.roomPic : 'no picture'
      

      if (
        !result &&
        (fileType === "image" || fileType === "") &&
        this.beginTime &&
        this.endTime
      ) {
        if (fileType === "") {
          this.invalidImage = "";
        }
        var event = new FormData();
        event.append("eventBeginTime", this.beginTime);
        event.append("eventEndTime", this.endTime);
        event.append("eventDistrict", this.district);
        event.append("eventCity", this.city);
        event.append("eventAdress", this.adress);
        event.append("roomPicture",  picture);
        event.append("userId",  this.userId);
        event.append("eventName",  this.name);
        event.append("eventParticipants", this.numberParticipants);
        event.append("eventDescription", this.description);
        

        Event.createRoom(event).then(response => {
          response
            .json()
            .then(data => {
              console.log(data);
            })
            .catch(error => console.log("error", error));
        });
      } else {
        if (fileType) {
          if (fileType !== "image") {
            this.invalidImage = "Selecione uma imagem válida";
          } else {
            this.invalidImage = "";
          }
        }
        if (!this.beginTime) {
          this.errorMessagebeginTime = "Defina o horário de inicio do evento";
        } else {
          this.errorMessagebeginTime = "";
        }
        if (!this.endTime) {
          this.errorMessageEndTime =
            "Defina o horário de encerramento do evento";
        } else {
          this.errorMessageEndTime = "";
        }
      }
    }
  },
  computed: {
    ...mapState(["userId"]),

    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Nome do evento deve ter no máximo 50 caracteres ");
      !this.$v.name.required && errors.push("Defina o nome do evento");
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.city.$dirty) return errors;

      !this.$v.city.required && errors.push("Defina a cidade do evento");
      return errors;
    },
    adressErrors() {
      const errors = [];
      if (!this.$v.adress.$dirty) return errors;

      !this.$v.adress.required && errors.push("Defina o endereço do evento");
      return errors;
    },
    districtErrors() {
      const errors = [];
      if (!this.$v.district.$dirty) return errors;

      !this.$v.district.required && errors.push("Defina o bairro do evento");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength &&
        errors.push("Descrição do evento deve ter no máximo 100 caracteres ");
      !this.$v.description.required &&
        errors.push("Crie uma descrição para o evento");
      return errors;
    },
    participantsErrors() {
      const errors = [];
      if (!this.$v.numberParticipants.$dirty) return errors;
      !this.$v.numberParticipants.required &&
        errors.push("Selecione a quantidade de participantes");
      return errors;
    }
  }
};
</script>
<style scoped>
.v-application p {
  font-size: 12px;
  line-height: px;
  text-align: left;
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
</style>
