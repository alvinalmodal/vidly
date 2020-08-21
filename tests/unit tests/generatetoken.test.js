require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`});
const generateToken = require('../../helpers/generatetoken');
const jwt = require('jsonwebtoken');

describe('generateToken', () => {
    it('should generate token when user object is passed', () => {
        const user = {
            _id:'1',
            name:'testuser',
            roles:[{_id:1,name:'administrator'},{_id:1,name:'reviewer'}]
        };
        const token = generateToken(user);
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // user.roles.forEach(value => {
        //     expect(decoded.roles.indexOf(value)).toBeGreaterThanOrEqual(0);
        // });
        expect(decoded._id).toBe(user._id);
        expect(decoded.name).toBe(user.name);
        
    });
});