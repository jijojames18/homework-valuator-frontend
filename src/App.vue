<template>
  <div id="app">
    {{ questions }}
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
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
      console.log(process.env);
      axios
        .get(`/questions/${this.testId}`)
        .then(response => {
          if (response && response.data.length) {
            this.questions = response.data;
          }
        })
        .catch(error => {
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
}
</style>
