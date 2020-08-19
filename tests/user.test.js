const {validateUser,validateUserRole,validateCredential} = require('../validators/user');

describe('validateUser',() => {
    it('should return errors if invalid user was provided.', () => {
        const credential = {
            name:'',
            email:'',
            password:''
        };
        const result = validateUser(credential);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return 0 array value if valid user was provided.', () => {
        const credential = {
            name:'test user',
            email:'test@test.com',
            password:'1231414'
        };
        const result = validateUser(credential);
        expect(result.length).toBe(0);
    });
});

describe('validateUserRole',() => {
    it('should return errors if invalid user role was provided.', () => {
        const userRole = {
            user:'',
            roles:[]
        };
        const result = validateUserRole(userRole);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
    it('should return 0 array value if valid user role was provided.', () => {
        const userRole = {
            user:'5f3800135c28d43e64cddc7d',
            roles:[{_id:'5f3800135c28d43e64cddc7d'},{_id:'5f3800135c28d43e64cddc7d'}]
        };
        const result = validateUserRole(userRole);
        expect(result.length).toBe(0);
    });
});

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