const mongoose = require('.').getConnection()
const MainModel = require('./mainModel')
const User = mongoose.model('User', require('./schema/UserSchema'))

class ModelClass extends MainModel {
  
}

let model = new ModelClass(User)
module.exports = model