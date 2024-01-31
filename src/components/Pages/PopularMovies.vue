<script>
export default {
  name: "PopularMovies",
  data() {
    return {
      data: null,
      dataGenres: [], 
      defaultPage: 1,
      moreMovies: [],
      showButton: true,
      selectedGenre: 0,
      filteredMovies: []
    };
  },
  methods: {
    async fetchData() {
      const responseGenres = await this.$axios.get("genre/movie/list?language=en");
      this.dataGenres = responseGenres.data.genres;
      const response = await this.$axios.get('movie/popular?language=en-US&page=' + this.defaultPage);
      this.data = response.data.results;
      //console.log(this.data);
      //console.log(this.dataGenres);
    },
    getGenre(id) {
      let tmp = "";
      this.dataGenres.forEach((el) => {
        if (el.id == id) {
          tmp = el.name;
        }
      });
      return tmp;
    },
    displayAverageVote(averageVote) {
      if (averageVote != undefined) {
        averageVote = averageVote.toString();
        return averageVote.substring(0, 3);
      }
      return "?";
    },
    showRelaseYear(date) {
      if (date != undefined) {
        return date.substring(0, 4);
      }
      return "";
    },
    async showMore(selectedGenre = 0) {
      // LOAD MORE - NE RADI, SALJE UNDEFINED HTTP REQUEST
      selectedGenre = this.selectedGenre == 0 ? 0 : this.selectedGenre;
      console.log(selectedGenre);
      this.defaultPage++;
      if (this.defaultPage < 500 && selectedGenre == 0) {
        const response = await this.$axios.get('movie/popular?language=en-US&page=' + this.defaultPage);
        response.data.results.forEach((x) => {
          this.moreMovies.push(x);
        });
      } 
      else if (this.defaultPage < 500){
        const response = await this.$axios.get('movie/popular?language=en-US&page=' + this.defaultPage);
        response.data.results.forEach(x => {
           console.log(this.defaultPage);
           this.filterMovies(selectedGenre,true)
        })
      }

      else {
        this.showButton = true;
      }
    },
    showSingleMovie(id) {
      this.$router.push({ name: "movie", params: { id: id } });
    },
    async filterMovies(selectedID,loadMore = false){
    //ID 28 = Action
    //ID 12 = Adventure
    //console.log(this.data);
    //console.log(selectedID);
     this.data.forEach(x => {
      let totalGenres = 0;
        //x.genre_ids.slice(0,2)
        x.genre_ids.forEach(y => {
        totalGenres++
          if(y == selectedID && totalGenres < 2 && this.filteredMovies.length < 20){
            this.filteredMovies.push(x)
          }
        })
      })
      
      if(this.filteredMovies.length < 20){
        this.defaultPage++;
        await this.fetchData()
        await this.filterMovies(selectedID)
      }
      if(loadMore){
        this.moreMovies.push(this.filteredMovies)
      }
      //console.log(this.filteredMovies);
    }
  },
  async mounted() {
    await this.fetchData();
  },
  watch: {
    async selectedGenre(selectedID,oldID){
      if(selectedID == 0){
        this.defaultPage = 1;
        this.filteredMovies = []
        await this.fetchData();
      }
      else if(selectedID != oldID){
      this.defaultPage = 1;
      this.filteredMovies = []
      await this.fetchData();
      await this.filterMovies(selectedID)
      }
  
    }
  }
};
</script>

<template>
<!-- catalog -->
<div class="catalog catalog--page">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="catalog__nav">
          <div class="catalog__select-wrap">
            <select class="catalog__select" name="genres" v-model="selectedGenre">
              <option value="0">All genres </option>
              <option v-for="genre in dataGenres" :key="genre.id" :value="genre.id">{{genre.name}}</option> 
            </select> 
             <!-- <v-select
              label="Select"
              :items="dataGenres"
              item-text="name"
              item-value="id"
              v-model="selectedGenre"
            ></v-select>    -->
          </div>

        </div>

        <div class="row row--grid">
          <!-- Display default movies -->
          <div v-for="movie in data" :key="movie" class="singleCard" >
            <div v-if="selectedGenre == 0"  class="card" @click="showSingleMovie(movie.id)" >
              <div class="card__cover" >
                <img :src="this.$baseImagePath + movie.poster_path" :alt="movie.title">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <button class="card__add" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z"/>
              </svg>
            </button>
              <span class="card__rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z"/>
              </svg> 
                {{ displayAverageVote(movie.vote_average) }}
              </span>
              <h3 class="card__title">{{movie.title}}</h3>
              <ul class="card__list">
                <li v-for="(genre,index) in movie.genre_ids" :key="index"> <span v-if="index < 2">{{ getGenre(genre) }}</span> </li>
                <li>{{showRelaseYear(movie.release_date)}}</li>
              </ul>
            </div>
          </div>
          <!-- Display filtered movies -->
          <div v-for="movie in filteredMovies" :key="movie" class="singleCard" >
            <div v-if="selectedGenre != 0"  class="card" @click="showSingleMovie(movie.id)" >
              <div class="card__cover" >
                <img :src="this.$baseImagePath + movie.poster_path" :alt="movie.title">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <button class="card__add" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z"/>
              </svg>
            </button>
              <span class="card__rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z"/>
              </svg> 
                {{ displayAverageVote(movie.vote_average) }}
              </span>
              <h3 class="card__title">{{movie.title}}</h3>
              <ul class="card__list">
                <li v-for="(genre,index) in movie.genre_ids" :key="index"> <span v-if="index < 2">{{ getGenre(genre) }}</span> </li>
                <li>{{showRelaseYear(movie.release_date)}}</li>
              </ul>
            </div>
          </div>
          
          
          <div v-for="movie in moreMovies" :key="movie" class="singleCard" >
            <div class="card" @click="showSingleMovie(movie.id)">
              <div class="card__cover">
                <img :src="this.$baseImagePath + movie.poster_path" :alt="movie.title">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <button class="card__add" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z"/>
              </svg>
            </button>
              <span class="card__rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z"/>
              </svg> 
                {{ displayAverageVote(movie.vote_average) }}
              </span>
              <h3 class="card__title"><a href="details.html">{{movie.title}}</a></h3>
              <ul class="card__list">
                <li v-for="(genre,index) in movie.genre_ids" :key="index"> <span v-if="index < 2">{{ getGenre(genre) }}</span> </li>
                <li>{{showRelaseYear(movie.release_date)}}</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>		

    <div class="row">
      <div class="col-12">
        <span class="catalog__more" v-show="showButton" @click="showMore()">Load more</span>
      </div>
    </div>
  </div>
</div>
<!-- end catalog -->
</template>

<style scoped>
.singleCard {
  width: 20%;
}
.row--grid {
  display: flex;
  flex-wrap:wrap;
  justify-content: center;
  margin-top: 100px;
  position: relative;
  left: 50%;
  transform: translateX(-47%);
}

.card__title {
  margin: 15px 0px 10px 0px;
}
.card__title a {
  text-decoration: none;

}
.catalog__more {
  cursor: pointer;
}
.catalog__select {
  background-color: #151f30;
  color: white;
  width: 10%;
  height: 35px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 0px 10px;
}
.catalog__select option {
  font-size: 1rem;
}
</style>