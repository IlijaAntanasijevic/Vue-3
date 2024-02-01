<script>
/*
PITANJA?
- Komponente na home, ne radi API. U konzoli se ispisuje

-Da li postoji drgi nacin za metode (Computed?) - AverageVote,showRelaseYear | Sve je u metodama :D

-pozivanje API-ja na HOME - fetchData,mounte,... da li postoji optimalniji nacin?

-Da li bi radio disableButton na PopularMovies,...

-Ne mogu Vuetify DropDown zbog ProxyArray,vrv

-Dolazi do kolizije kada API ne ucita sve podatke (ne zavrsi), a promeni se zanr... NE ZNAM DA RESIM!
*/

import { ref, onMounted, onBeforeUnmount } from 'vue';

//import PopularMovies from './HomeContent/PopularMovies.vue';


export default {
  components: {
    //PopularMovies,
},
data(){
  return {
    dataAPI: [],
    baseImagePath: 'https://image.tmdb.org/t/p/w500/',
    dataUpcoming: null,
    dataGenresMoviesAPI: null,
    dataGenresTvSeriesAPI: null,
    dataPopular: null,
    dataTopRated: null,
    dataPopularSeries: null
  }
},
methods: {
  async fetchData(){
    const responseUpcomingMovies = await this.$axios.get("movie/upcoming?language=en-US&page=1")
    this.dataAPI = responseUpcomingMovies;
    const responseGenres = await this.$axios.get("genre/movie/list?language=en")
    this.dataGenresMoviesAPI = responseGenres;
    const responsePopularMovies = await this.$axios.get("movie/popular?language=en-US&page=1")
    this.dataPopular = responsePopularMovies  
    const responseTopRated = await this.$axios.get("movie/top_rated?language=en-US&page=1")
    this.dataTopRated = responseTopRated
    const responsePopularTVSeries = await this.$axios.get("tv/popular?language=en-US&page=1")
    this.dataPopularSeries = responsePopularTVSeries
    const responseGenresTV = await this.$axios.get("genre/tv/list?language=en")
    this.dataGenresTvSeriesAPI = responseGenresTV
  },
  getGenre(id,type = 'movie'){
    let tmp = "";
    if(type === 'movie'){
        this.dataGenresMoviesAPI.data.genres.forEach(el => {
        if(el.id == id){
          tmp = el.name;
        }
      });
    }
    else {
      this.dataGenresTvSeriesAPI.data.genres.forEach(el => {
        if(el.id == id){
          tmp = el.name
        }
      })
    }
   
    return tmp
  },
  displayAverageVote(averageVote){
    if(averageVote != undefined ){
      averageVote = averageVote.toString();
      return averageVote.substring(0,3)
    }
    return "?";
  },
  showRelaseYear(date){
    if(date != undefined){
      return date.substring(0,4)
    }
    return ""
  },
  showSingleMovie(id) {
    this.$router.push({ name: "movie", params: { id: id } });
    },
},
async mounted(){
  await this.fetchData();
  this.dataUpcoming = this.dataAPI.data.results
  this.dataPopular = this.dataPopular.data.results
  this.dataTopRated = this.dataTopRated.data.results
  this.dataPopularSeries = this.dataPopularSeries.data.results
  // console.log(this.dataPopularSeries);
  
},
setup(){
    let homePerPage = ref(5);
    let movieListPerPage = ref(5);

    const updatePerPage = () => {
      // Update perPage based on your breakpoints or conditions
      if (window.innerWidth < 430){
        movieListPerPage.value = 1;
      }
      else if (window.innerWidth < 650){
        movieListPerPage.value = 2;
      }
      if (window.innerWidth < 650){
        homePerPage.value = 1;
       
      }
      else if (window.innerWidth < 950){
        homePerPage.value = 1.5;
        movieListPerPage.value = 3;
      }
      else if (window.innerWidth < 1200){
        homePerPage.value = 2;
        movieListPerPage.value = 4;
      }
      else if (window.innerWidth < 1500){
        homePerPage.value = 3;
      }
      else if (window.innerWidth < 1900){
        homePerPage.value = 3.5;
      }
      else {
        homePerPage.value = 4
      }

    };

    onMounted(() => {
      window.addEventListener('resize', updatePerPage);
      // Initial setup
      updatePerPage();
    });

    // Remove event listener when component is unmounted
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updatePerPage);
    });
    return {
      homePerPage,
      movieListPerPage
    }
  }
}
</script>

<template>
 <div id="app">
   <!-- home -->
   <div class="home home--title">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="home__title"><b>New Movies</b></h1>
        </div>
      </div>
    </div>

    <div class="home__carousel" id="flixtv-hero">
      <Carousel :items-to-show="homePerPage" :wrap-around="true"> <!-- 3.25 -->
        <Slide v-for="movie in dataUpcoming" :key="movie">
          <div class="home__card" @click="showSingleMovie(movie.id)">
            <span >
              <img  :src="baseImagePath + movie.poster_path" :alt="movie.title">
              <!-- <img src="@/assets/img/home/1.jpg" alt=""> -->
            </span>
            <div>
              <h2>{{movie.title}}</h2>
              <ul>
                <li v-for="(genre,index) in movie.genre_ids" :key="index"> <span v-if="index < 3">{{ getGenre(genre) }}</span> </li>
                <li>{{showRelaseYear(movie.release_date)}}</li>
              </ul>
            </div>
            <button class="home__add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" />
              </svg>
            </button>
            <span class="home__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
              </svg> 
              {{ displayAverageVote(movie.vote_average) }}
            </span>
          </div>
        </Slide>
      </Carousel>
    </div>
  </div>
  <!-- end home -->

   <!-- popular -->
   <section class="section">
    <div class="container">
      <div class="row">
       
        <div class="col-12">
          
          <h2 class="section__title">
            <router-link to="popularmovies"> 
              <span>Popular </span> 
              <svg width="17" height="15" viewBox="0 0 17 15" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.75 7.72559L0.75 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9.7002 1.70124L15.7502 7.72524L9.7002 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            </router-link>
         
        </h2>
        </div>
        <div class="col-12">
          <div class="section__carousel-wrap">
            <div class="section__carousel owl-carousel" id="popular">
             <Carousel :items-to-show="movieListPerPage" :wrap-around="true">
              <Slide v-for="movie in dataPopular" :key="movie">
                <div class="card mx-3" @click="showSingleMovie(movie.id)">
                  <p class="card__cover">
                    <img :src="baseImagePath + movie.poster_path" :alt="movie.title">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" stroke-linecap="round" stroke-linejoin="round" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </p>
                  <button class="card__add" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" />
                    </svg>
                  </button>
                  <span class="card__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                    </svg> {{displayAverageVote(movie.vote_average)}} </span>
                  <h3 class="card__title"><p>{{movie.title}}</p></h3>
                  <ul class="card__list">
                    <li v-for="(genre,index) in movie.genre_ids" :key="index"> <span v-if="index < 2">{{ getGenre(genre) }}</span> </li>
                    <li>{{showRelaseYear(movie.release_date)}}</li>
                  </ul>
                </div>
              </Slide>
              <template #addons>
                <navigation>
                  <template #next>
                    <span class="section__nav  section__nav--next">  
                     <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.75 7.72559L0.75 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.7002 1.70124L15.7502 7.72524L9.7002 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </template>
                  <template #prev>
                    <span class="section__nav section__nav--prev">
                      <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.25 7.72559L16.25 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.2998 1.70124L1.2498 7.72524L7.2998 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </template>
                </navigation>
              </template>
             </Carousel>

            </div>

            
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- end popular -->
  <!-- Top Rated -->
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="section__title">
            <router-link to="popularmovies"> 
            <span>Top Rated </span>
            <svg width="17" height="15" viewBox="0 0 17 15" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.75 7.72559L0.75 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.7002 1.70124L15.7502 7.72524L9.7002 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>
          </h2>
        </div>
        <div class="col-12">
          <div class="section__carousel-wrap">
            <div class="section__carousel owl-carousel" id="popular">
             <Carousel :items-to-show="movieListPerPage" :wrap-around="true">
              <Slide v-for="movie in dataTopRated" :key="movie">
                <div class="card" @click="showSingleMovie(movie.id)">
                  <p class="card__cover">
                    <img :src="baseImagePath + movie.poster_path" :alt="movie.title">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z"
                        stroke-linecap="round" stroke-linejoin="round" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </p>
                  <button class="card__add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" />
                    </svg></button>
                  <span class="card__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                    </svg> {{displayAverageVote(movie.vote_average)}}</span>
                  <h3 class="card__title"><p>{{movie.title}}</p></h3>
                  <ul class="card__list">
                    <li v-for="(genre,index) in movie.genre_ids" :key="index"> <span v-if="index < 2">{{ getGenre(genre) }}</span> </li>
                    <li>{{showRelaseYear(movie.release_date)}}</li>
                  </ul>
                </div>
              </Slide>
              <template #addons>
                <navigation>
                  <template #next>
                    <span class="section__nav  section__nav--next">  
                     <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.75 7.72559L0.75 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.7002 1.70124L15.7502 7.72524L9.7002 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </template>
                  <template #prev>
                    <span class="section__nav section__nav--prev">
                      <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.25 7.72559L16.25 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.2998 1.70124L1.2498 7.72524L7.2998 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </template>
                </navigation>
              </template>
             </Carousel>

            </div>

            
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- end Top rated -->

  <!-- TV Series  -->
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="section__title">
            <router-link to="popularmovies">
            <span>Popular TV Series </span>
            <svg width="17" height="15" viewBox="0 0 17 15" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.75 7.72559L0.75 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9.7002 1.70124L15.7502 7.72524L9.7002 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
          </h2>
        </div>
        <div class="col-12">
          <div class="section__carousel-wrap">
            <div class="section__carousel owl-carousel" id="popular">
             <Carousel :items-to-show="movieListPerPage" :wrap-around="true">
              <Slide v-for="item in dataPopularSeries" :key="item">
                <div class="card" @click="showSingleMovie(item.id)">
                  <p  class="card__cover">
                    <img v-if="item.poster_path" :src="baseImagePath + item.poster_path" :alt="item.name">
                    <img v-else src="@/assets/img/NoImageAvailable.png">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z"
                        stroke-linecap="round" stroke-linejoin="round" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </p>
                  <button class="card__add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" />
                    </svg></button>
                  <span class="card__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                    </svg> {{displayAverageVote(item.vote_average)}}</span>
                  <h3 class="card__title"><p>{{item.name}}</p></h3>
                  <ul class="card__list">
                    <li v-for="(genre,index) in item.genre_ids" :key="index"> <span v-if="index < 2">{{ getGenre(genre,'TV') }}</span> </li>
                    <li>{{showRelaseYear(item.first_air_date)}}</li>
                  </ul>
                </div>
              </Slide>
              <template #addons>
                <navigation>
                  <template #next>
                    <span class="section__nav  section__nav--next">  
                     <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.75 7.72559L0.75 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.7002 1.70124L15.7502 7.72524L9.7002 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </template>
                  <template #prev>
                    <span class="section__nav section__nav--prev">
                      <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.25 7.72559L16.25 7.72559" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.2998 1.70124L1.2498 7.72524L7.2998 13.7502" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </template>
                </navigation>
              </template>
             </Carousel>

            </div>

            
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- end TV Series -->
 </div>
</template>

<style scoped>
.section__title {
  cursor: pointer;
  display: inline-block;
  
}
.section__title a {
  text-decoration: none
}
.section__title a:hover{
  color: #e0e0e0;
}
</style>