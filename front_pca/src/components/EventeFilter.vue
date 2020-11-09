<template>
  <div class="filter-box">
    <div class="category-box">
      <v-select
        class="select-category"
        label="Selecione uma categoria"
        :items="[
          'Tecnologia',
          'Cultura e Lazer',
          'Esporte',
          'E-sport',
          'Show ao vivo',
          'Beleza e Moda',
        ]"
      >
      </v-select>
    </div>

    <!-- ### TODO : CHANGE TIME TO DATE >>>>>>> -->

    <div class="time-box">
      <label class="time-label">Horário</label>
      <vuetify-time-select class="time"> </vuetify-time-select>
    </div>

    <button class="filter-button">
      Filtrar
    </button>
  </div>
</template>

<script>
import Vue from "vue";
import vSelect from "vue-select";
import VuetifyTimeSelect from "vuetify-time-select";

Vue.component("vuetify-time-select", VuetifyTimeSelect);
Vue.component("v-select", vSelect);

export default {
  methods: {},
};
</script>

<style scoped>
.filter-box {
  width: 100%;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  align-content: center;
  display: flex;
}

.category-box {
  width: 90%;
  height: 5em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #888;
  border-radius: 10px;
}
.category-box .select-category {
  width: 80%;

  padding-left: 10px;
  padding-right: 10px;
}

.time-box {
  width: 90%;
  height: 5em;
  display: flex;

  align-items: center;
  justify-content: center;
  align-content: space-between;

  flex-direction: row;
  outline: 0;
  padding: 0 1.6rem;
  background-color: #fff;

  margin-top: 1em;

  border-radius: 10px;
  border: 1px solid #888;
}

.time-box .time-label {
  font-size: 1.5em;

  margin-right: 50px;
}

.filter-button {
  width: 90%;
  height: 4rem;
  background-color: #04d361;
  color: #fff;
  border: 0;
  border-radius: 0.8rem;
  cursor: pointer;
  font: 700 1.6rem Archivo;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.2s;
  margin-top: 3.2rem;
}

.filter-button:hover {
  background-color: #04bf58;
}
</style>
