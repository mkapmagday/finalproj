<template>
  <nav v-if="isLoggedIn">
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
      <v-btn href="/sign-in" v-if="!isLoggedIn">Log-In</v-btn>
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
  { title: "AdminCrud", icon: "mdi-admin", path: "/AdminCrud" },

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

const logout = () => {
  signOut(auth)
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      // An error happened.
    });
    
};
</script>