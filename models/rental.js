const mongoose = require('../startup/db')('rental');

const rentalSchema = new mongoose.Schema({
    movies:{
                type:[new mongoose.Schema({
                    _id:{type:String,required:true},
                    title:{type:String,required:true}
                })],
                validate: v => Array.isArray(v) && v.length > 0,
                message: 'Rental should have at least one movie.'
            },
    customer:{
        type:new mongoose.Schema({
            _id:{
                type:String,
                required:true
            },  
            isGold: {
                type:Boolean,
                default:false
            },
            name: {
                type:String, 
                required:true,
                minlength:2,
                maxlength:70
            },
            phone: {
                type:String,
                required:true,
                min:6,
                max:50
            }
        }),
        required:true
    },
    rentalDate:{type:Date,default:Date.now},
    returnDate:{type:Date},
    discount:{type:Number,default:0},
    totalRentalRate:{type:Number,default:0}
},{strict:true});

const Rental = mongoose.model('Rental',rentalSchema);

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;