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
            <form>
              <v-menu
                ref="menu"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="time"
                    label="Picker in menu"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="time"
                  full-width
                  @click:minute="$refs.menu.save(time)"
                ></v-time-picker>
              </v-menu>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="50"
                label="Nome"
                required
              ></v-text-field>
              <v-text-field
                label="Descrição"
                v-model="descripton"
                :error-messages="descriptionErrors"
                :counter="100"
              ></v-text-field>
              <v-text-field label="Endereço" v-model="adress" :error-messages="adressErrors"></v-text-field>
              <v-text-field label="Cidade" v-model="city" :error-messages="cityErrors"></v-text-field>
              <v-text-field label="Bairro" v-model="district" :error-messages="districtErrors"></v-text-field>

              <v-select
                v-model="quantidadeParticipantes"
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
import { required, maxLength } from "vuelidate/lib/validators";
// import VueTimepicker from "vue2-timepicker";
// import "vue2-timepicker/dist/VueTimepicker.css";
export default {
  validations: {
    name: { required, maxLength: maxLength(50) },
    descripton: { required, maxLength: maxLength(100) },
    adress: { required },
    district: { required },
    city: { required },
    quantidadeParticipantes: { required }
  },

  data() {
    return {
      time: null,
      menu2: false,
      modal2: false,
      errorMessage: "",
      quantidade: [10, 50, 100, 300, 500, 1000],
      name: "",
      adress: "",
      city: "",
      district: "",
      roomPic: null,
      descripton: "",
      quantidadeParticipantes: "",
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

      let fileType = this.roomPic.type.split("/");
      if (!result && fileType[0] === "image") {
        console.log(fileType[0]);
        console.log(this.roomPic);
        console.log(this.quantidadeParticipantes);
        console.log(this.name);
        console.log(this.descripton);
      } else if (fileType[0] !== "image") {
        console.log("erro");
      }
    }
  },
  computed: {
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
      if (!this.$v.name.$dirty) return errors;

      !this.$v.name.required && errors.push("Defina o endereço do evento");
      return errors;
    },
    districtErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;

      !this.$v.name.required && errors.push("Defina o bairro do evento");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.descripton.$dirty) return errors;
      !this.$v.descripton.maxLength &&
        errors.push("Descrição do evento deve ter no máximo 100 caracteres ");
      !this.$v.descripton.required &&
        errors.push("Crie uma descrição do evento");
      return errors;
    },
    participantsErrors() {
      const errors = [];
      if (!this.$v.quantidadeParticipantes.$dirty) return errors;
      !this.$v.quantidadeParticipantes.required &&
        errors.push("Selecione a quantidade de participantes");
      return errors;
    }
  }
};
</script>
