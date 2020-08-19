const validateMovie = require('../validators/movie');

describe('validateMovie',() => {
    it('should return an array if invalid movie was provided.', () => {
        const movie = {
            title:'',
            genre:'',
            numberInStock:'',
            dailyRentalRate:''
        }
        const result = validateMovie(movie);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return an empty array if valid movie was provided.', () => {
        const movie = {
            title:'Test',
            genre:'5f3800135c28d43e64cddc7d',
            numberInStock:1,
            dailyRentalRate:2
        }
        const result = validateMovie(movie);
        expect(result.length).toBe(0);
    });
});