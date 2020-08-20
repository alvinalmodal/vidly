const validateRole = require('../../validators/role');

describe('validateRole',() => {
    it('should return errors if invalid role was provided.', () => {
        const role = {name:''};
        const result = validateRole(role);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return 0 array value if valid role was provided.', () => {
        const role = {name:'role'};
        const result = validateRole(role);
        expect(result.length).toBe(0);
    });
});