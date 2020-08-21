const validateCustomer = require('../../validators/customer');

describe('customer',() => {
    it('should return error if invalid customer is provided', () => {
        const customer = {
            name:'',
            isGold:'',
            phone:''
        };
        const result = validateCustomer(customer);
        expect(result.length).toBeGreaterThan(0);
    });
});