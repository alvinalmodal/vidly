const validateCredential = require('../validators/token');


describe('validateCredential',() => {
    it('should return errors if invalid credential was provided.', () => {
        const credential = {
            email:'',
            password:''
        };
        const result = validateCredential(credential);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return 0 array value if valid credential was provided.', () => {
        const credential = {
            email:'test@email.com',
            password:'123141414'
        };
        const result = validateCredential(credential);
        expect(result.length).toBe(0);
    });
});