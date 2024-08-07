class MainModel {
  constructor(model, additionalModel = false) {
      this.model = model;
      this.additionalModel = additionalModel;
  }
  get(params) {
    return new Promise((resolve, reject) => {        
      this.model.find(params)
      .exec((err, result) => {
        if (err) {
            reject(err)
            return
        }
        resolve(result)
      })
    })
  }
  getPages(params, fields = null) {
    let size = params.size ? parseInt(params.size) : 10000
    let page = params.page ? parseInt(params.page) : 1
    let query = params.query ? params.query : params
    
    return new Promise((resolve, reject) => {   
      this.model.find(query, fields).sort(params && params.sort ? params.sort : { 'createdAt': -1 })
      .limit(size)
      .skip(size * (page - 1))
      .exec((err, result) => {
        if (err) {
            reject(err)
            return
        }
        resolve(result)
      })
    })
  }
  getCount(params) {
    let query = params.query
    if (!params.query) {
      query = params
    }
    return new Promise((resolve, reject) => {
      this.model.countDocuments(query)
        .exec((err, result) => {
          if (err) {
          
            reject(err)
            return
          }
          resolve(result)
        })
    })
  }
  get_w_select(params, select) {
    return new Promise((resolve, reject) => {            
      this.model.find(params).select(select)
      .exec((err, result) => {
        if (err) {
            
            reject(err)
            return
        }
        resolve(result)
      })
    })
  }
  get_w_sort(params, select, sort) {
    return new Promise((resolve, reject) => {            
      this.model.find(params).select(select).sort(sort)
      .exec((err, result) => {
        if (err) {
            
            reject(err)
            return
        }
        resolve(result)
      })
    })
  } 
  add(params) {
		return new Promise((resolve, reject) => {
			let modules = new this.model(params)
			modules.save((err) => {
				if (err) {
          let message = JSON.stringify(err)
          if (message.includes('duplicate key error collection')) {
            var characters = 'ABCDEFGHIJKLMNOPQRTUVWXYZ0123456789';
            let isErr = false
            /* create with random char
            if (message.includes('index: id_1 dup key')) {
              isErr = true
              params.id = params.id + characters.charAt(Math.floor(Math.random() * characters.length))
            }
            */
            if (isErr) {
              resolve(this.add(params))
            }
          }
					reject(err)
				} else {
					resolve(modules)
				}
			})
		})
  }
  update(params) {
		return new Promise((resolve, reject) => {
			this.model.updateMany(params.selector, {'$set': params.data}, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
    })
  }
  push(params) {
		return new Promise((resolve, reject) => {
			this.model.updateMany(params.selector, {'$push': params.data}, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
    })
  }
  pull(params) {
		return new Promise((resolve, reject) => {
			this.model.updateMany(params.selector, {'$pull': params.data}, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
    })
  }
  updateWithoutTime(params) {
		return new Promise((resolve, reject) => {
			this.model.updateOne(params.selector, {'$set': params.data}, { timestamps: false }, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
    })
  }
  updateMany(params) {
		return new Promise((resolve, reject) => {
			this.model.updateMany(params.selector, {'$set': params.data}, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
    })
  }
  delete(id) {
    return new Promise((resolve, reject) => {
      this.model.findByIdAndRemove({ _id: id }, function(err, result){
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  deleteManyByParams(params) {
    return new Promise((resolve, reject) => {
      this.model.deleteMany(params, function(err, result){
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  deleteByParams(params) {
    return new Promise((resolve, reject) => {
      this.model.deleteOne(params, function(err, result){
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  updateBulk(params) {
		return new Promise((resolve, reject) => {
			this.model.bulkWrite(params, async (err, result) => {
          if (err) {
              reject(err)
          } else {
            resolve(result)
          }
      })
    })
  }
  getSum(params, field) {
    return new Promise((resolve, reject) => {   
      this.model.aggregate([
      {
        "$match": params
      },  
      {
        $group: { _id: null, total: { $sum: field } } 
      }]).exec((err, result) => {
        if (err) {
            reject(err)
            return
        }
        resolve(result.length ? result[0].total: 0)
      })
    })
  }
  getWithoutSort(params, fields = null) {
    return new Promise((resolve, reject) => {            
      this.model.find(params, fields)
      .exec((err, result) => {
        if (err) {
            
            reject(err)
            return
        }
        resolve(result)
      })
    })
  }
}
module.exports = MainModel