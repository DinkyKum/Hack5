const mongoose = require("mongoose")
const {Schema}=mongoose;
const validator = require("validator");
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');

const traderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not a valid Email Id");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong Password");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/256/149/149071.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Enter a valid URL");
            }
        },
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isNumeric(value) || value.length !== 12) {
                throw new Error("Enter a valid 12-digit Aadhar Number");
            }
        },
    },
    address: {
        type: String,
        trim: true,
    },
});

traderSchema.methods.getJWT= async function(){
    const token= await jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;
}

traderSchema.methods.validatePassword= async function(passwordInputByTrader){
    const isPasswordValid= await bcrypt.compare(passwordInputByTrader, this.password);
    return(isPasswordValid);
}

module.exports = mongoose.model("Trader", traderSchema);
