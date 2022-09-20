<template>
  <v-app>
   <v-main>
      <NavBar />
      <router-view/>
   </v-main>
  </v-app>
</template>

<script setup>
  import NavBar from './components/NavBar.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.v-main {
  background: tan;
}
.v-toolbar__content, .v-toolbar__extension, .v-toolbar__content {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    position: relative;
    transition: inherit;
    width: 100%;
    background-color:rgb(210, 160, 120) ;
}
element.style, .v-navigation-drawer {
  background-color: tan;
}

</style>
