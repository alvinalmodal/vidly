const validateRental = require('../validators/rental');

describe('validateRental',() => {
    it('should return errors if invalid rental was provided.', () => {
        const rental = {
            movies:'',
            customer:''
        };
        const result = validateRental(rental);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return 0 array values if valid rental was provided.', () => {
        const rental = {
            movies:[{_id:'5f3800135c28d43e64cddc7d'},{_id:'5f3800135c28d43e64cddc7d'}],
            customer:{_id:'5f3800135c28d43e64cddc7d'}
        };
        const result = validateRental(rental);
        expect(result.length).toBe(0);
    });
});