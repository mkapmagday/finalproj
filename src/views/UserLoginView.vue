
<template>
  <v-container fluid pa-0>
    <v-row align="center" justify="center" style= dense>
      <v-col
        cols="12"
        lg="6"
        md="6"
        class="
          grey
          lighten-2
          fill-height
          d-flex
          flex-column
          justify-center
          align-center
        "
      >
        <v-card>
          <v-card-title>
            <h3>Login to Your Account</h3>
          </v-card-title>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <v-card-item>
            <p>
              <input
                type="text"
                class="mdi-user"
                placeholder="Email"
                v-model="email"
              />
            </p>
            <p>&nbsp;</p>

            <p>
              <input
                type="password"
                placeholder="Password"
                v-model="password"
              />
            </p>
          </v-card-item>
          <p>&nbsp;</p>
          <v-btn @click="signIn">Submit</v-btn>
          <p>&nbsp;</p>
          <p class="register" @click="register">
            Not yet registered? Click Here
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  <script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const signIn = () => {
  // we also renamed this method
  signInWithEmailAndPassword(getAuth(), email.value, password.value) // THIS LINE CHANGED
    .then((data) => {
      console.log("Successfully logged in!");
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};

const register = () => {
  router.push("/register");
};
</script>
<style scoped>
.register {
  color: blue;
}
.register:hover {
  color: black;
}
.v-card {
  padding: 40px;
  border-radius: 10px;
  width: max-content;
}
</style>