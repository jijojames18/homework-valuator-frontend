<template>
  <div id="app">
    <div v-if="isLoading" class="spinner">
      <b-spinner class="b-spinner"></b-spinner>
    </div>
    <div v-else>
      {{ questions }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { BSpinner } from "bootstrap-vue";

export default {
  name: "app",
  components: {
    BSpinner
  },
  data() {
    return {
      isLoading: false,
      testId: 0,
      userId: false,
      error: false,
      questions: [],
      response: []
    };
  },
  mounted() {
    const testId = this.$route.params.userId;
    if (testId) {
      this.testId = testId;
      this.fetchData();
    } else {
      this.error = "Incorrect page";
    }
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      axios
        .get(`/questions/${this.testId}`)
        .then(response => {
          if (response && response.data.length) {
            this.questions = response.data;
            this.isLoading = false;
          }
        })
        .catch(error => {
          this.isLoading = false;
          console.error(error);
          this.error = "Internal error";
        });
    },
    fetchExistingResponse() {
      axios
        .get(`/answers/${this.testId}/${this.userId}`)
        .then(response => {
          if (response && response.data.length) {
            this.response = response.data;
          }
        })
        .catch(error => {
          console.error(error);
          this.error = "Internal error";
        });
    },
    submitResponse() {}
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .spinner {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;

    .b-spinner {
      position: absolute;
      top: 50%;
      width: 100px;
      height: 100px;
    }
  }
}
</style>
