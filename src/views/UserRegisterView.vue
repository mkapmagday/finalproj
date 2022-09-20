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
                <h3>Create an Account</h3>
            </v-card-title>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            <v-card-item>
                <p><input type="text" placeholder="Email" v-model="email" /></p>
                <p>&nbsp;</p>
                <p><input type="password" placeholder="Password" v-model="password" /></p>
            </v-card-item>
                <p>&nbsp;</p>
                <v-btn @click="register">Register</v-btn>
                <p>&nbsp;</p>
            <p><button class="sign-in" @click="signIn">already registered? Click Here</button></p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter} from 'vue-router' 

const email = ref('')
const password = ref('')
const router = useRouter();


const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data)=>{
        console.log("registered");
    })
}
const signIn = () => {
    router.push('/sign-in')
}
 
</script>
<style scoped>
    .sign-in {
      color: blue;
    }
    .sign-in:hover {
      color: black;
    }
    .v-card {
      padding: 40px;
      border-radius: 10px;
      width: max-content;
    }
    </style>