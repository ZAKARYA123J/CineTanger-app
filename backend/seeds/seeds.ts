import { sequelize } from "../src/config/Database.js"
import movie from "../src/models/Movie.js"

async function seedMovie() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: true }) // Use force: true to recreate table with correct types

        await movie.bulkCreate([
            {
                title: "The Last Horizon",
                duration: 125,
                genre: "Action / Adventure",
                releaseDate: "2024-11-15",
                photo: "https://i.pinimg.com/1200x/fa/bc/29/fabc298271e9d3b13c6742d6cb55441a.jpg"
            }, {
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
            }, {
                title: "Avengers: Endgame",
                duration: 181,
                genre: "Action",
                releaseDate: "2019-04-26",
                photo: "https://i.pinimg.com/1200x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.jpg"
            }
        ])
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}
seedMovie()