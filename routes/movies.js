const express = require("express");
const { Genre } = require("../models/genre");
const { Movie } = require("./../models/movie");
const validateMovie = require("../validators/movie");
const validateId = require("../middleware/validateId");
const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    return res.send(await Movie.find());
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validateId, async function (req, res, next) {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Invalid movie id.");
    }
    return res.send(movie);
  } catch (error) {
    next(error);
  }
});

router.post("/", async function (req, res, next) {
  try {
    let errors = validateMovie(req.body);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const genre = await Genre.findById(req.body.genre);
    if (!genre) {
      return res.status(404).send("Invalid genre");
    }

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    await movie.save();

    return res.send(movie);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateId, async function (req, res, next) {
  try {
    const errors = validateMovie(req.body);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Invalid movie id.");
    }

    const genre = await Genre.findById(req.body.genre);
    if (!genre) {
      return res.status(404).send("Invalid genre.");
    }

    movie.title = req.body.title;
    movie.genre._id = genre._id;
    movie.genre.name = genre.name;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    movie.save();

    return res.send(movie);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validateId, async function (req, res, next) {
  try {
    let movie = await Movie.findOneAndRemove(req.params.id);
    if (!movie) {
      return res.status(404).send("Invalid movie id.");
    }
    return res.send(movie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
