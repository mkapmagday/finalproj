<template>
  <body>
    <div id="quiz-container">
      <h5 style="float: right">Score: {{ score }}/{{ questions.length }}</h5>
      <br />
      <section v-if="!squiz">
        <v-card-text class="startquizcard">
          <v-btn class="btn" depressed outlined color="teal" @click="startQuiz"
            >Start</v-btn
          >
        </v-card-text>
      </section>
      <section v-else>
        <section v-if="!quizCompleted">
          <h3>
            Question: {{ currentnumberQuestion }} / {{ questions.length }}
          </h3>
          <div>
            <h1 v-html="loading ? 'Loading...' : currentQuestion.question"></h1>
            <form v-if="currentQuestion">
              <button
                v-for="answer in currentQuestion.answers"
                :index="currentQuestion.key"
                :key="answer"
                v-html="answer"
                @click.prevent="handleButtonClick"
              ></button>
            </form>
          </div>
        </section>
        <section v-else>
          <h1 id="quizresult">Quiz Result:</h1>
          <v-card-text v-if="!pass">
            <h1 id="quizfailed">{{ result }}</h1>
            <p id="quizfailed">{{ score }}/{{ questions.length }}</p>
          </v-card-text>
          <v-card-text v-else>
            <h1 id="quizpassed">{{ result }}</h1>
            <p id="quizpassed">{{ score }}/{{ questions.length }}</p>
          </v-card-text>
          <v-btn
            class="btn"
            depressed
            outlined
            color="error"
            @click="reloadPage"
            >Try Again</v-btn
          >
        </section>
      </section>
      <section>
        <div class="table-wrapper">
          <h1>USER SCOREBOARD</h1>

          <table class="fl-table">
            <thead>
              <tr>
                <th>EMAIL</th>
                <th>SCORE</th>
                <th>RESULT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quiz in quizData" v-bind:key="quiz.email">
                <td>{{ quiz.email }}</td>
                <td>{{ quiz.score }}</td>
                <td>{{ quiz.result }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
     
    
  </body>
</template>
     
<script>
import { getAuth } from "firebase/auth";
import { doc, query, setDoc, Timestamp } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { orderBy } from "firebase/firestore";

import { ref } from "vue";
import { db } from "@/firebase";

const auth = getAuth();
const user = auth.currentUser;

export default {
  name: "Quiz",
  // data() function stores state variables
  data() {
    return {
      questions: [],
      quizData: [],
      loading: true,
      index: 0,
      score: 0,
      currentnumberQuestion: 1,
      quizCompleted: false,
      result: null,
      passingScore: "",
      pass: false,
      squiz: false,
    };
  },
  computed: {
    currentQuestion() {
      if (this.questions !== []) {
        return this.questions[this.index];
      }
      return null;
    },
  },
  // Custom methods of the Vue Component
  methods: {
    reloadPage() {
      window.location.reload();
    },
    async fetchQuestions() {
      this.loading = true;
      let response = await fetch("https://opentdb.com/api.php?amount=5");
      let jsonResponse = await response.json();
      let index = 0; // index is used to identify single answer
      let data = jsonResponse.results.map((question) => {
        // put answers on question into single array
        question.answers = [
          question.correct_answer,
          ...question.incorrect_answers,
        ];
        // Shuffle question.answers array
        for (let i = question.answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [question.answers[i], question.answers[j]] = [
            question.answers[j],
            question.answers[i],
          ];
        }
        // add rightAnswer and key property to each question
        question.rightAnswer = null;
        question.key = index;
        index++;
        return question;
      });
      this.questions = data;
      this.loading = false;
    },
    startQuiz() {
      this.squiz = true;
      return squiz;
    },
    handleButtonClick: function (event) {
      /* Find index to identiy question object in data */
      let index = event.target.getAttribute("index");
      let pollutedUserAnswer = event.target.innerHTML; // innerHTML is polluted with decoded HTML entities e.g ' from &#039;
      /* Clear from pollution with ' */
      let userAnswer = pollutedUserAnswer.replace(/'/, "&#039;");
      /* Set userAnswer on question object in data */
      this.questions[index].userAnswer = userAnswer;
      /* Set class "clicked" on button with userAnswer -> for CSS Styles; Disable other sibling buttons */
      event.target.classList.add("clicked");
      let allButtons = document.querySelectorAll(`[index="${index}"]`);
      for (let i = 0; i < allButtons.length; i++) {
        if (allButtons[i] === event.target) continue;
        allButtons[i].setAttribute("disabled", "");
      }
      /* Invoke checkAnswer to check Answer */
      this.checkAnswer(event, index);
    },
    checkAnswer: function (event, index) {
      let question = this.questions[index];
      if (question.userAnswer) {
        if (this.index < this.questions.length - 1) {
          setTimeout(
            function () {
              this.index += 1;
              this.currentnumberQuestion += 1;
            }.bind(this),
            1000
          );
        }
        if (question.userAnswer === question.correct_answer) {
          /* Set class on Button if user answered right, to celebrate right answer with animation joyfulButton */
          event.target.classList.add("rightAnswer");
          /* Set rightAnswer on question to true, computed property can track a streak out of 10 questions */
          this.questions[index].rightAnswer = true;
          this.score++;
        } else {
          /* Mark users answer as wrong answer */
          event.target.classList.add("wrongAnswer");
          this.questions[index].rightAnswer = false;
          /* Show right Answer */
          let correctAnswer = this.questions[index].correct_answer;
          let allButtons = document.querySelectorAll(`[index="${index}"]`);
          allButtons.forEach(function (button) {
            if (button.innerHTML === correctAnswer) {
              button.classList.add("showRightAnswer");
            }
          });
        }
        if (this.currentnumberQuestion < this.questions.length) {
        } else {
          if ((this.quizCompleted = true)) {
            this.passingScore = 0.5 * this.questions.length;
            if (this.score >= this.passingScore) {
              this.result = "Passed";
              this.pass = true;
            } else {
              this.result = "Failed";
            }
          }
          const docData = {
            email: auth.currentUser.email,
            score: this.score,
            result: this.result,
          };
          console.log(auth.currentUser.uid);
          console.log(this.result);
          setDoc(doc(db, "quiz", auth.currentUser.uid), docData);
          this.quizCompleted = true;
          scores: this.score;
        }
      }
    },
    async fetchLeaderBoards() {
      const arrange = collection(db,"quiz");
      const arrangeScore = query(arrange,orderBy("score","desc"));
      const querySnapshot = await getDocs(arrangeScore);
      //const querySnapshot = await getDocs(collection(db, "quiz"));

      querySnapshot.forEach((doc) => {
        //console.log(doc.data())
        this.quizData.push(doc.data());
        //console.log(doc.data(orderBy("score")));
      });
    },
  },
  // Code inside mounted() runs after the Component has mounted
  mounted() {
    this.fetchQuestions(), this.fetchLeaderBoards();
  },
};
</script>
     
<style scoped>
#quiz-container {
  margin: 1rem auto;
  padding: 1rem;
  max-width: 750px;
  background:lightsalmon;
}

h1 {
  font-size: 1.3rem;
  padding: 0.7rem;
}

.divider {
  margin: 0.5rem 0;
  border-radius: 2px;
  box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.3);
}

form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  font-size: 1.1rem;
  box-sizing: border-box;
  padding: 1rem;
  margin: 0.3rem;
  width: 47%;
  background-color: rgba(100, 100, 100, 0.3);
  border: none;
  border-radius: 0.4rem;
  box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.2);
}

button:hover:enabled {
  transform: scale(1.02);
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -1px rgba(0, 0, 0, 0.2);
}

button:focus {
  outline: none;
}

button:active:enabled {
  transform: scale(1.05);
}

@keyframes flashButton {
  0% {
    opacity: 1;
    transform: scale(1.01);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

button.clicked {
  pointer-events: none;
}

button.rightAnswer {
  animation: flashButton;
  animation-duration: 700ms;
  animation-delay: 200ms;
  animation-iteration-count: 3;
  animation-timing-function: ease-in-out;
  color: black;
  background: linear-gradient(
    210deg,
    rgba(0, 178, 72, 0.25),
    rgba(0, 178, 72, 0.5)
  );
}

button.wrongAnswer {
  color: black;
  background: linear-gradient(
    210deg,
    rgba(245, 0, 87, 0.25),
    rgba(245, 0, 87, 0.5)
  );
}

button.showRightAnswer {
  animation: flashButton;
  animation-duration: 700ms;
  animation-delay: 200ms;
  animation-iteration-count: 2;
  animation-timing-function: ease-in-out;
  color: black;
  background: linear-gradient(
    210deg,
    rgba(0, 178, 72, 0.25),
    rgba(0, 178, 72, 0.5)
  );
}
* {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
body {
  font-family: Helvetica;
  -webkit-font-smoothing: antialiased;
}
h2 {
  text-align: center;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: white;
  padding: 30px 0;
}

/* Table Styles */

.table-wrapper {
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

.fl-table {
  border-radius: 5px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;
}

.fl-table td,
.fl-table th {
  text-align: center;
  padding: 8px;
}

.fl-table td {
  border-right: 1px solid #f8f8f8;
  font-size: 12px;
}

.fl-table thead th {
  color: #ffffff;
  background: #4fc3a1;
}

.fl-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.fl-table tr:nth-child(even) {
  background: #f8f8f8;
}

/* Responsive */

@media (max-width: 767px) {
  .fl-table {
    display: block;
    width: 100%;
  }
  .table-wrapper:before {
    content: "Scroll horizontally >";
    display: block;
    text-align: right;
    font-size: 11px;
    color: white;
    padding: 0 0 10px;
  }
  .fl-table thead,
  .fl-table tbody,
  .fl-table thead th {
    display: block;
  }
  .fl-table thead th:last-child {
    border-bottom: none;
  }
  .fl-table thead {
    float: left;
  }
  .fl-table tbody {
    width: auto;
    position: relative;
    overflow-x: auto;
  }
  .fl-table td,
  .fl-table th {
    padding: 20px 0.625em 0.625em 0.625em;
    height: 60px;
    vertical-align: middle;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    width: 120px;
    font-size: 13px;
    text-overflow: ellipsis;
  }
  .fl-table thead th {
    text-align: left;
    border-bottom: 1px solid #f7f7f9;
  }
  .fl-table tbody tr {
    display: table-cell;
  }
  .fl-table tbody tr:nth-child(odd) {
    background: none;
  }
  .fl-table tr:nth-child(even) {
    background: transparent;
  }
  .fl-table tr td:nth-child(odd) {
    background: #f8f8f8;
    border-right: 1px solid #e6e4e4;
  }
  .fl-table tr td:nth-child(even) {
    border-right: 1px solid #e6e4e4;
  }
  .fl-table tbody td {
    display: block;
    text-align: center;
  }
  .v-main {
  background: tan;
  }
}
</style>