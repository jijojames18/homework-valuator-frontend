<template>
  <div id="app">
    <div v-if="isLoading" class="spinner">
      <b-spinner class="b-spinner"></b-spinner>
    </div>
    <div v-else-if="userMessage">
      <b-container fluid="md" class="container background-container">
        <b-row class="justify-content-md-left">
          <b-col col lg="12">
            {{ userMessage }}
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else>
      <b-form @submit="submitResponse" me>
        <b-container fluid="md" class="container background-container">
          <b-row class="justify-content-md-left">
            <b-col col lg="12" v-html="getMessage('instructions')"></b-col>
          </b-row>
        </b-container>
        <b-container fluid="md" class="container background-container">
          <b-row class="justify-content-md-left">
            <b-col col lg="4">
              <label for="input-user-id">{{ getMessage("rollNumber") }}</label>
            </b-col>
          </b-row>
          <b-row class="justify-content-md-left">
            <b-col col lg="6">
              <b-form-input
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
          class="container background-container"
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
            <b-col col lg="6">
              <b-form-textarea
                v-if="response_type === 'textarea'"
                :id="`input-question-${question_id}`"
                v-model="response[question_id]"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              <b-form-file
                v-else-if="response_type === 'file'"
                v-model="response[question_id]"
                class="mt-3"
                plain
              ></b-form-file>
              <b-form-input
                v-else
                :id="`input-question-${question_id}`"
                v-model="response[question_id]"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>
        <b-container fluid="md" class="container">
          <b-row class="justify-content-md-left">
            <b-col col lg="1" class="button-col">
              <b-button type="submit" variant="primary">{{
                getMessage("buttons.submit")
              }}</b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container fluid="md" class="container">
          <b-row class="justify-content-md-left">
            <b-col col lg="12">
              <flip-countdown :deadline="testEndTime"></flip-countdown>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FlipCountdown from "vue2-flip-countdown";

export default {
  name: "app",
  components: {
    FlipCountdown
  },
  data() {
    return {
      isLoading: false,
      testId: 0,
      userId: "",
      userMessage: "",
      questions: [],
      response: {},
      testEndTime: new Date(Date.now()).toString()
    };
  },
  mounted() {
    const testId = this.$route.params.userId;
    if (testId) {
      this.testId = testId;
      this.fetchData();
    } else {
      this.userMessage = this.getMessage("errorMessages.incorrectTest");
    }
  },
  methods: {
    getMessage(id) {
      return this.$t(id) || "";
    },
    resetResponse() {
      let i = 0;
      while (i < this.questions.length) {
        const key = this.questions[i]["question_id"];
        this.$set(this.response, key, "");
        i++;
      }
    },
    fetchData() {
      this.isLoading = true;
      axios
        .get(`/questions/${this.testId}`)
        .then(response => {
          if (
            response &&
            response.data &&
            response.data.questions &&
            response.data.questions.length
          ) {
            this.questions = response.data.questions;
            this.testEndTime = response.data.test.test_end_time;
            this.resetResponse();
            this.isLoading = false;
          }
        })
        .catch(error => {
          this.isLoading = false;
          console.error(error);
          this.userMessage = this.getMessage("errorMessages.internalError");
        });
    },
    fetchExistingResponse() {
      axios
        .get(`/answers/${this.testId}/${this.userId}`)
        .then(response => {
          if (response && response.data.length) {
            const data = response.data;
            let i = 0;
            while (i < data.length) {
              this.response[data[i]["question_id"]] = data[i]["answer"];
              i++;
            }
          } else {
            this.resetResponse();
          }
        })
        .catch(error => {
          this.resetResponse();
          console.error(error);
          this.userMessage = this.getMessage("errorMessages.testNotFound");
        });
    },
    submitResponse(evt) {
      evt.preventDefault();
      this.isLoading = true;
      let answers = Object.keys(this.response).map(key => {
        return {
          answer: this.response[key],
          question_id: key
        };
      });

      let formData = new FormData();
      formData.append("answers", JSON.stringify(answers));
      axios.post(`/answers/${this.testId}/${this.userId}`, formData).then(
        response => {
          this.isLoading = false;
          this.finished = true;
          const status = response && response.data && response.data.result;
          switch (status) {
            case -1:
              this.userMessage = this.getMessage("errorMessages.incorrectTest");
              break;
            case -2:
              this.userMessage = this.getMessage(
                "errorMessages.testDeadlinePassed"
              );
              break;
            case 0:
            default:
              this.userMessage = this.getMessage("testFinishedSuccessfuly");
          }
        },
        error => {
          this.isLoading = false;
          console.error(error);
          this.userMessage = this.getMessage(
            "errorMessages.internalErrorWhileSubmiting"
          );
        }
      );
    }
  }
};
</script>

<style lang="scss">
@import "app.scss";
</style>
