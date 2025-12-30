import { sequelize } from "../src/config/Database.js";
import movie from "../src/models/Movie.js";
import theater from "../src/models/theater.js";
import showtime from "../src/models/showtime.js";

async function seedAll() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        await movie.bulkCreate([
            {
                title: "The Last Horizon",
                duration: 125,
                genre: "Action / Adventure",
                releaseDate: "2024-11-15",
                photo: "https://i.pinimg.com/1200x/fa/bc/29/fabc298271e9d3b13c6742d6cb55441a.jpg"
            },
            {
                title: "Dune: Part Two",
                duration: 166,
                genre: "Sci-Fi / Adventure",
                releaseDate: "2024-03-01",
                photo: "https://i.pinimg.com/736x/b7/95/44/b795447414c34b18eddc91fdea0fffef.jpg"
            },
            {
                title: "Spider-Man: No Way Home",
                duration: 148,
                genre: "Action / Superhero",
                releaseDate: "2021-12-17",
                photo: "https://i.pinimg.com/1200x/98/3c/54/983c5467549ac2c4e644c499b353fbd4.jpg"
            },
            {
                title: "Operation Sindoor",
                duration: 95,
                genre: "Drama / Thriller",
                releaseDate: "2022-11-02",
                photo: "https://i.pinimg.com/736x/7f/0b/08/7f0b08ef27069ef2a1f988afc782b8af.jpg"
            },
            {
                title: "Avengers: Endgame",
                duration: 181,
                genre: "Action",
                releaseDate: "2019-04-26",
                photo: "https://i.pinimg.com/1200x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.jpg"
            }
        ]);
        await theater.bulkCreate([
            { title: "Grand Cinema", name: "Tanger Center", capacity: 250 },
            { title: "Star Theater", name: "Marina Blvd", capacity: 180 },
            { title: "Cinema Palace", name: "Old Medina", capacity: 300 },
            { title: "Galaxy Screens", name: "City Mall", capacity: 220 },
            { title: "Sunset Cinema", name: "Beach Road", capacity: 150 }
        ]);

        await showtime.bulkCreate([
            { startTime: "2025-12-26T18:00:00Z", price: 60, totalSeats: 250, MovieId: 1, theaterId: 1, bookedSeats: 100 },
            { startTime: "2025-12-26T20:30:00Z", price: 70, totalSeats: 180, MovieId: 2, theaterId: 2, bookedSeats: 100 },
            { startTime: "2025-12-27T17:00:00Z", price: 55, totalSeats: 300, MovieId: 3, theaterId: 3, bookedSeats: 100 },
            { startTime: "2025-12-27T19:45:00Z", price: 65, totalSeats: 220, MovieId: 4, theaterId: 4, bookedSeats: 100 },
            { startTime: "2025-12-28T16:30:00Z", price: 50, totalSeats: 150, MovieId: 5, theaterId: 5, bookedSeats: 100 }
        ]);

        console.log("Seeding completed!");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedAll();