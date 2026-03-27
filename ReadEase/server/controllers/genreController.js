const Genre = require('../models/Genre');

exports.getGenres = async (req, res) => {
    try {
        const genres = await Genre.find().populate('parentGenre');
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGenre = async (req, res) => {
    const { name, parentGenre, description } = req.body;
    try {
        const genre = new Genre({ name, parentGenre, description });
        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getGenreHierarchy = async (req, res) => {
    try {
        const genres = await Genre.find().lean();
        const genreMap = {};
        genres.forEach(g => {
            genreMap[g._id] = { ...g, children: [] };
        });
        const rootGenres = [];
        genres.forEach(g => {
            if (g.parentGenre) {
                genreMap[g.parentGenre].children.push(genreMap[g._id]);
            } else {
                rootGenres.push(genreMap[g._id]);
            }
        });
        res.json(rootGenres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
