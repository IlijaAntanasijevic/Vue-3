<script>

import Header from './components/Fixed/Header.vue'
import Footer from "./components/Fixed/Footer.vue"

export default {
  components: {
    Header,
    Footer
  }
}

</script>

<template>
<div id="app">
  <Header/>
  <router-view></router-view>
  <Footer/>
</div>
</template>

<style scoped>


</style>
