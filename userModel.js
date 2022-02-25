const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId : {
        type: String
    },
    name: {
        type: String
    },
    referrer_id: {
        type: String
    },
    referral_count: {
        type: String
    },
    ref_link:{
        type: String
    }
    ,
    twitter: {
        type: String
    },
    instagram: {
        type: String
    },
    ejin: {
        type: String
    },
    teddies_username: {
        type: String
    }
},
{versionKey: false}

)

module.exports = mongoose.model('user',userSchema)