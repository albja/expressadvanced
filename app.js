require("dotenv").config();

const express = require("express");
const userHandlers = require("./userHandlers");
const { hashPassword,verifyPassword,verifyToken } = require("./auth.js");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
    res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

// the public routes


app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post(
    "/api/login",
    userHandlers.getUserByEmailWithPasswordAndPassToNext,
    verifyPassword
);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
// then the routes to protect

app.use(verifyToken);
app.post("/api/movies", verifyToken, movieHandlers.postMovie);

app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);



app.delete("/api/users/:id", userHandlers.deleteUser);

app.post("/api/users", hashPassword, userHandlers.postUser);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);

app.listen(port, (err) => {
    if (err) {
        console.error("Something bad happened");
    } else {
        console.log(`Server is listening on ${port}`);
    }
});
