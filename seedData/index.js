import userModel from '../api/users/userModel';
import users from './users';
import dotenv from 'dotenv';
import genreModel from '../api/genres/genreModel'
import genres from './genres'
import movieModel from '../api/movies/movieModel';
import movies from './movies.js';
import peopleModel from '../api/people/peopleModel';
import people from './people.js';

dotenv.config();

// deletes all user documents in collection and inserts test data
async function loadUsers() {
  console.log('load user Data');
  try {
    await userModel.deleteMany();
    await users.forEach(user => userModel.create(user));
    console.info(`${users.length} users were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load user Data: ${err}`);
  }
}

async function loadGenres() {
  console.log('load genres Data');
  try {
    await genreModel.deleteMany();
    await genreModel.collection.insertMany(genres);
    console.info(`${genres.length} genres were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load genre Data: ${err}`);
  }
}

// deletes all movies documents in collection and inserts test data
export async function loadMovies() {
  console.log('load movies data');
  try {
    await movieModel.deleteMany();
    await movieModel.collection.insertMany(movies);
    console.info(`${movies.length} Movies were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load movie Data: ${err}`);
  }
}

export async function loadPeople() {
  console.log('load people data');
  try {
    await peopleModel.deleteMany();
    await peopleModel.collection.insertMany(people);
    console.info(`${people.length} people were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load movie Data: ${err}`);
  }
}

if (process.env.SEED_DB === 'true') {
  loadUsers();
  loadGenres();
  loadMovies();
  loadPeople();//ADD THIS LINE
}