<template>
  <div class="filter-box">
    <div class="filter-title">
      <span>
        Filtros
      </span>
    </div>
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
        :required="!selected"
      >
      </v-select>
    </div>

    <div class="date-box">
      <label class="date-label">Data: </label>
      <input type="date" class="date" />
    </div>

    <button
      type="submit"
      class="filter-button"
      v-scroll-to="'#event-container'"
    >
      Filtrar
    </button>
  </div>
</template>

<script>
import Vue from "vue";
import vSelect from "vue-select";
const VueScrollTo = require("vue-scrollto");

Vue.use(VueScrollTo);
Vue.component("v-select", vSelect);

export default {
  el: "event-filter",
  methods: {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;700&display=swap");

.filter-box {
  height: 60vh;
  width: 100%;
  flex-direction: column;
  margin-top: -2.3em;
  padding-top: 30px;

  align-items: center;
  justify-content: center;
  align-content: center;
  display: flex;
  background-color: #9932cc;
}

.filter-title {
  font: 700 3rem Archivo;
  color: #fff;

  margin: 0 auto;
}

.category-box {
  width: 90%;
  height: 5em;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #888;
  border-radius: 0.8rem;
  background-color: #fff;

  margin-top: 2.5em;
  padding-top: 20px;
}
.category-box .select-category {
  width: 80%;

  padding-left: 10px;
  padding-right: 10px;
}

.date-box {
  width: 90%;
  height: 5em;
  display: flex;

  align-items: center;
  justify-content: center;
  align-content: space-between;

  flex-direction: row;
  padding: 0 1.6rem;
  background-color: #fff;

  margin-top: 1em;
  border-radius: 0.8rem;
  border: 1px solid #888;
}

.date-box .date {
  background-color: blueviolet;
  color: #fff;
  border-radius: 0.8em;
  margin-left: -40px;
  padding: 2px 10px;
}

.date-box .date-label {
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
  margin-top: 2rem;
  margin-bottom: 0em;
}

.filter-button:hover {
  background-color: #04bf58;
}
</style>
