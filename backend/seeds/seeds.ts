import { sequelize } from "../src/config/Database.js";
import movie from "../src/models/Movie.js";
import theater from "../src/models/theater.js";
import showtime from "../src/models/showtime.js";

async function seedAll() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });

        await movie.bulkCreate([
            {
                title: "The Last Horizon",
                duration: 125,
                genre: "Action / Adventure",
                releaseDate: "2024-11-15",
                photo: "https://i.pinimg.com/1200x/fa/bc/29/fabc298271e9d3b13c6742d6cb55441a.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=47, https://i.pravatar.cc/300?img=33, https://i.pravatar.cc/300?img=45, https://i.pravatar.cc/300?img=13, https://i.pravatar.cc/300?img=28",
            },
            {
                title: "Dune: Part Two",
                duration: 166,
                genre: "Sci-Fi / Adventure",
                releaseDate: "2024-03-01",
                photo: "https://i.pinimg.com/736x/b7/95/44/b795447414c34b18eddc91fdea0fffef.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=33, https://i.pravatar.cc/300?img=47, https://i.pravatar.cc/300?img=10, https://i.pravatar.cc/300?img=20, https://i.pravatar.cc/300?img=25, https://i.pravatar.cc/300?img=31"
            },
            {
                title: "Spider-Man: No Way Home",
                duration: 148,
                genre: "Action / Superhero",
                releaseDate: "2021-12-17",
                photo: "https://i.pinimg.com/1200x/98/3c/54/983c5467549ac2c4e644c499b353fbd4.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=45, https://i.pravatar.cc/300?img=23, https://i.pravatar.cc/300?img=14, https://i.pravatar.cc/300?img=32, https://i.pravatar.cc/300?img=27"
            },
            {
                title: "Operation Sindoor",
                duration: 95,
                genre: "Drama / Thriller",
                releaseDate: "2022-11-02",
                photo: "https://i.pinimg.com/736x/7f/0b/08/7f0b08ef27069ef2a1f988afc782b8af.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=15, https://i.pravatar.cc/300?img=42, https://i.pravatar.cc/300?img=18, https://i.pravatar.cc/300?img=36, https://i.pravatar.cc/300?img=29, https://i.pravatar.cc/300?img=41"
            },
            {
                title: "Avengers: Endgame",
                duration: 181,
                genre: "Action",
                releaseDate: "2019-04-26",
                photo: "https://i.pinimg.com/1200x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=11, https://i.pravatar.cc/300?img=26, https://i.pravatar.cc/300?img=44, https://i.pravatar.cc/300?img=19, https://i.pravatar.cc/300?img=34, https://i.pravatar.cc/300?img=48"
            },
            {
                title: "Jurassic World: Dominion",
                duration: 147,
                genre: "Action / Sci-Fi",
                releaseDate: "2022-06-10",
                photo: "https://i.pinimg.com/736x/9d/89/c2/9d89c26e7180d3ddde9a0797158334ca.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=17, https://i.pravatar.cc/300?img=39, https://i.pravatar.cc/300?img=22, https://i.pravatar.cc/300?img=35, https://i.pravatar.cc/300?img=30, https://i.pravatar.cc/300?img=43"
            },
            {
                title: "Black Panther: Wakanda Forever",
                duration: 161,
                genre: "Action / Adventure",
                releaseDate: "2022-11-11",
                photo: "https://i.pinimg.com/1200x/dd/08/c0/dd08c02c3a61dcb03995161648777d6a.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=16, https://i.pravatar.cc/300?img=38, https://i.pravatar.cc/300?img=24, https://i.pravatar.cc/300?img=40, https://i.pravatar.cc/300?img=21, https://i.pravatar.cc/300?img=37"
            },
            {
                title: "Avatar: The Way of Water",
                duration: 192,
                genre: "Sci-Fi / Adventure",
                releaseDate: "2022-12-16",
                photo: "https://i.pinimg.com/1200x/0a/b7/33/0ab733d9dc819cfa9ee0f4c427665e5a.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=13, https://i.pravatar.cc/300?img=46, https://i.pravatar.cc/300?img=28, https://i.pravatar.cc/300?img=50, https://i.pravatar.cc/300?img=49, https://i.pravatar.cc/300?img=51"
            },
            {
                title: "Thor: Love and Thunder",
                duration: 119,
                genre: "Action / Fantasy",
                releaseDate: "2022-07-08",
                photo: "https://i.pinimg.com/1200x/62/ea/f9/62eaf9ab61fe06441dca84b862a00d80.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=52, https://i.pravatar.cc/300?img=53, https://i.pravatar.cc/300?img=54, https://i.pravatar.cc/300?img=55, https://i.pravatar.cc/300?img=56, https://i.pravatar.cc/300?img=57"
            },
            {
                title: "The Batman",
                duration: 176,
                genre: "Action / Crime",
                releaseDate: "2022-03-04",
                photo: "https://i.pinimg.com/1200x/c4/2d/71/c42d7138491385342352d59c356aa757.jpg",
                description: "In a dystopian future where Earth's resources are nearly depleted, a team of elite astronauts embarks on humanity's most dangerous mission: to reach a distant planet that could be our last hope for survival. As they venture into the unknown depths of space, they discover that the greatest threats aren't just the cosmic dangers around them, but the secrets they carry within. A breathtaking sci-fi epic that explores the limits of human endurance, sacrifice, and the unbreakable will to survive against all odds.",
                artist: "https://i.pravatar.cc/300?img=58, https://i.pravatar.cc/300?img=59, https://i.pravatar.cc/300?img=60, https://i.pravatar.cc/300?img=61, https://i.pravatar.cc/300?img=62, https://i.pravatar.cc/300?img=63"
            }
        ]);
        await theater.bulkCreate([
            { title: "Grand Cinema", name: "Tanger Center", capacity: 250 },
            { title: "Star Theater", name: "Marina Blvd", capacity: 180 },
            { title: "Cinema Palace", name: "Old Medina", capacity: 300 },
            { title: "Galaxy Screens", name: "City Mall", capacity: 220 },
            { title: "Sunset Cinema", name: "Beach Road", capacity: 150 },
            { title: "Royal Cinema", name: "Place de France", capacity: 280 },
            { title: "Metroplex Theater", name: "Ibn Batouta Mall", capacity: 320 },
            { title: "CinéPark", name: "Route de Tétouan", capacity: 200 },
            { title: "Empire Screens", name: "Boulevard Pasteur", capacity: 260 },
            { title: "Atlantic Cinema", name: "Corniche Bay", capacity: 190 }
        ]);

        await showtime.bulkCreate([
            { startTime: "2025-12-26T18:00:00Z", price: 60, totalSeats: 250, MovieId: 1, theaterId: 1, bookedSeats: 100 },
            { startTime: "2025-12-26T20:30:00Z", price: 70, totalSeats: 180, MovieId: 2, theaterId: 2, bookedSeats: 100 },
            { startTime: "2025-12-27T17:00:00Z", price: 55, totalSeats: 300, MovieId: 3, theaterId: 3, bookedSeats: 100 },
            { startTime: "2025-12-27T19:45:00Z", price: 65, totalSeats: 220, MovieId: 4, theaterId: 4, bookedSeats: 100 },
            { startTime: "2025-12-28T16:30:00Z", price: 50, totalSeats: 150, MovieId: 5, theaterId: 5, bookedSeats: 100 },
            { startTime: "2025-12-28T18:15:00Z", price: 75, totalSeats: 280, MovieId: 6, theaterId: 6, bookedSeats: 120 },
            { startTime: "2025-12-29T20:00:00Z", price: 80, totalSeats: 320, MovieId: 7, theaterId: 7, bookedSeats: 150 },
            { startTime: "2025-12-29T17:30:00Z", price: 60, totalSeats: 200, MovieId: 8, theaterId: 8, bookedSeats: 90 },
            { startTime: "2025-12-30T19:00:00Z", price: 70, totalSeats: 260, MovieId: 9, theaterId: 9, bookedSeats: 110 },
            { startTime: "2025-12-30T21:15:00Z", price: 65, totalSeats: 190, MovieId: 10, theaterId: 10, bookedSeats: 85 }

        ]);

        console.log("Seeding completed!");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedAll();