import express from 'express';
import Genre from './genreModel';
import { getGenres } from '../tmdb-api';

const router = express.Router(); 

router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.status(200).json(genres);
});

router.get('/tmdb', async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
});
export default router;