const STORAGE_KEY = "movieWatchlist";

// Movies to pre-fill the app with the first time it runs,
// so the list isn't empty when you demo/test it.
const SEED_MOVIES = [
  { id: 1, title: "Spirited Away", genre: "Fantasy", year: 2001, status: "Completed", rating: 9 },
  { id: 2, title: "Parasite", genre: "Thriller", year: 2019, status: "Completed", rating: 10 },
  { id: 3, title: "Dune: Part Two", genre: "Sci-Fi", year: 2024, status: "Watching", rating: 8 },
  { id: 4, title: "Your Name", genre: "Romance", year: 2016, status: "Plan to Watch", rating: 0 }
];

function getMovies() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MOVIES));
    return [...SEED_MOVIES];
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Corrupted watchlist data, resetting.", err);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MOVIES));
    return [...SEED_MOVIES];
  }
}

// Overwrite the full list in localStorage.
function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// Add a new movie. Generates its own incrementing id.
function addMovie(movie) {
  const movies = getMovies();
  const nextId = movies.length ? Math.max(...movies.map(m => m.id)) + 1 : 1;
  movies.push({ id: nextId, ...movie });
  saveMovies(movies);
}

// Find one movie by id (ids come in as strings from the URL, so we coerce).
function getMovieById(id) {
  const movies = getMovies();
  return movies.find(m => m.id === Number(id));
}

// Update one movie by id with new field values.
function updateMovie(id, updates) {
  const movies = getMovies();
  const index = movies.findIndex(m => m.id === Number(id));
  if (index === -1) return false;
  movies[index] = { ...movies[index], ...updates };
  saveMovies(movies);
  return true;
}

// Delete one movie by id.
function deleteMovie(id) {
  const movies = getMovies().filter(m => m.id !== Number(id));
  saveMovies(movies);
}

// Small helper used by list/home pages to color-code status badges.
function statusClass(status) {
  if (status === "Completed") return "badge badge--done";
  if (status === "Watching") return "badge badge--watching";
  return "badge badge--plan";
}