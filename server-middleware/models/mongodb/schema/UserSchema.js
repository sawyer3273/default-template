const { Schema, model, Types } = require('mongoose')
const Model = new Schema({
    name: String,
    phone: String,
    email: {type: String, unique : true, required : true, dropDups: true}, 
    password: { type: String, select: false },
    role: { type: String, default: 'user' },
    is_active: Boolean,
}, {
    collection: 'users',
    timestamps: true
})
Model.index({ email: 1 })
module.exports = Model