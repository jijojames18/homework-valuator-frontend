<template>
  <div id="app">
    <div v-if="isLoading" class="spinner">
      <b-spinner class="b-spinner"></b-spinner>
    </div>
    <div v-else>
      <b-form>
        <b-container fluid="md" class="container question-container">
          <b-row class="justify-content-md-left">
            <b-col col lg="4">
              <label for="input-user-id">Phone Number</label>
            </b-col>
          </b-row>
          <b-row class="justify-content-md-left">
            <b-col col lg="6">
              <b-form-input
                @change="fetchExistingResponse"
                id="input-userId"
                v-model="userId"
                type="text"
                required
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>
        <b-container
          fluid="md"
          class="container question-container"
          :key="index"
          v-for="({ question, question_id, response_type }, index) in questions"
        >
          <b-row class="justify-content-md-left">
            <b-col col lg="6" class="label-column">
              <label :for="`input-question-${question_id}`"
                >{{ question }}
              </label>
            </b-col>
          </b-row>
          <b-row class="justify-content-md-left">
            <b-col col lg="12">
              <b-form-textarea
                id="`input-question-${question_id}`"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-container>
        <b-container fluid="md" class="container">
          <b-row class="justify-content-md-left">
            <b-col col lg="1" class="button-col">
              <b-button type="submit" variant="primary">Submit</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
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
      userId: "",
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
          } else {
            this.response = {};
          }
        })
        .catch(error => {
          this.response = {};
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

  .container {
    &.question-container {
      background-color: #f0f0f0;
      border: 1px solid #dadce0;
      border-radius: 8px;
    }

    margin-top: 14px;
    max-width: 850px;

    .row {
      margin: 14px 0;
      .col {
        text-align: left;
      }
    }

    .button-col {
      margin: 0px;
      padding: 0px;
    }
  }

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
