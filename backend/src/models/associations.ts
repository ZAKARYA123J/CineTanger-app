import movie from "./Movie.js";
import showtime from "./showtime.js";
import theater from "./theater.js";

movie.hasMany(showtime, {
    foreignKey: 'MovieId',
    as: 'showtimes'
});

showtime.belongsTo(movie, {
    foreignKey: 'MovieId',
    as: 'movie'
});

showtime.belongsTo(theater, {
    foreignKey: 'theaterId',
    as: 'theater'
});

theater.hasMany(showtime, {
    foreignKey: 'theaterId',
    as: 'showtimes'
});

export { movie, showtime, theater };