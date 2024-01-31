import './assets/css/style.css'
import "bootstrap"
//import "bootstrap/dist/css/bootstrap.min.css"
import { createApp} from 'vue'
import App from './App.vue'
import router from './router'; // Import the router
import axios from 'axios';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
//import { ref, onMounted, onBeforeUnmount } from 'vue';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


//const baseURL = "https://api.themoviedb.org/3/";
axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzE5OGU2NjgxNDBmODhlOWQ5NjMxNDZkNThjZDllMSIsInN1YiI6IjY1YjAwMTEyODQ4ZWI5MDBjYTRmMWZjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EU-hyin0Hz2Lz6Kwxv8h-TdS3C3RVSoCyuHh4MMqkZw';

axios.defaults.headers.get['Content-Type'] = 'application/json';5

const axiosInstance = axios.create();
// const vuetifyInstance = new Vuetify({});
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App).use(router).use(vuetify);

app.component('Carousel',Carousel)
app.component('Slide',Slide)
app.component('Navigation',Navigation)

/*
app.component('ref',ref)
app.component('onMounted',onMounted)
app.component('onBeforeUnmount',onBeforeUnmount)
*/


app.config.globalProperties.$baseImagePath = "https://image.tmdb.org/t/p/w500/";
app.config.globalProperties.$axios = axiosInstance;
// Vue.config.productionTip = false
app.mount("#app");


