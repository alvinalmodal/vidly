const validateGenre = require('../../validators/genre');

describe('validateGenre',() => {
    it('should return errors if invalid genre was provided.', () => {
        const genre = {name:''};
        const result = validateGenre(genre);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return 0 array values if valid genre was provided.', () => {
        const genre = {name:'genre'};
        const result = validateGenre(genre);
        expect(result.length).toBe(0);
    });
});