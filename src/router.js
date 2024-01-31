import { createRouter, createWebHistory } from 'vue-router';

import Home from "./components/Pages/Home.vue"
import Movies from "./components/Pages/Movies.vue"
import PopularMovies from "./components/Pages/PopularMovies.vue"
import SingleMovie from "./components/Pages/SingleMovie.vue"
import TvShows from "./components/Pages/TvShows.vue"
import Singin from "./components/Pages/SingIn.vue"

const routes = [
  {path: "/", component: Home},
  {path: "/home", component: Home},
  {path: "/movies", component: Movies},
  {path: "/popularmovies", component: PopularMovies},
  {path: "/movie/:id", name: "movie", component: SingleMovie},
  {path: "/tvShows", component: TvShows},
  {path: "/singin", component: Singin}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;