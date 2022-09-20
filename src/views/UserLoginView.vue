<template>
    <h1>Login to Your Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="signIn">Submit</button></p>
  </template>
  <script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword  } from 'firebase/auth'
import { useRouter} from 'vue-router' 

const email = ref('')
const password = ref('')
const router = useRouter();


const signIn = () => { // we also renamed this method
    signInWithEmailAndPassword(getAuth(),email.value, password.value) // THIS LINE CHANGED
    .then((data) => {
          console.log('Successfully logged in!');
          router.push('/home')

    })
    .catch(error => {
      console.log(error.code)
      alert(error.message);
    });
}
</script>