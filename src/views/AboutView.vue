<template>
  <div class="about">

  </div>
</template>
<script>
  import router from '@/router';
  
  
  export default {
    name: "Quiz",
    data() {
      return {

      };
    },
    computed: {
      
    },
    // Custom methods of the Vue Component
    methods: {
      async redirect(){
        router.push('/QuizApp')
      }
    }
    ,
    // Code inside mounted() runs after the Component has mounted
    mounted() {
      this.redirect()
    },
  };
  </script>