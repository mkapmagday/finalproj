<template>
  <nav>
    <v-toolbar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span class="font-weight-light">Vuetify </span>
        <span>Demo</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- dropdown menu -->
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn color="black" v-bind="props"> Activity List </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            router
            :to="item.path"
            :prepend-icon="item.icon"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn @click="signIn" v-if="!isLoggedIn">Log-In</v-btn>
      <v-btn color="error" @click="logout" v-if="isLoggedIn"> Sign Out </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        router
        :to="item.path"
        :prepend-icon="item.icon"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
  </nav>
</template>
  
<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "@/router";

const drawer = ref(false);

const items = ref([
  { title: "Home", icon: "mdi-home", path: "/" },
  { title: "QuizApp", icon: "mdi-vuetify", path: "/QuizApp" },

]);

function toggleDrawer() {
  return (drawer.value = !drawer.value);
}



const auth = getAuth();
const isLoggedIn = ref(true);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("USER IS LOGGED IN");
    isLoggedIn.value = true;
    // ...
  } else {
    console.log("USER IS LOGGED OUT");
    isLoggedIn.value = false;
  }
});
const signIn = () => {
  router.push("/sign-in");
};
const logout = () => {
  signOut(auth)
    .then(() => {
      router.push('/sign-in')
    })
    .catch((error) => {
      // An error happened.
    });
    
};
</script>
<style scoped>
.v-toolbar__content, .v-toolbar__extension, .v-toolbar__content {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    position: relative;
    transition: inherit;
    width: 100%;
    background-color: tan;
}
</style>