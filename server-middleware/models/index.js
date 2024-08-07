const path = require('path')
const { database, databaseDefault } = require('../config').load()

class ConnectionManager {

	constructor (connection_driver, config_name) {
		this.driver 	= connection_driver
		this.type 		= config_name
		this.config 	= database[config_name]
		this.connection = []
	}

	connect (config) {
		if (config.active) {
			return this.driver(config)
		} else {
			console.warn(`app:database Selected ${this.type} database (${config.name}) is not activated on configuration !`)
			return null
		}
	}

	getConnection (number) {
		if (!number) {
			number = 0
		}
		if (this.connection[number]) {
			return this.connection[number]
		} else {
			if (this.config.hasOwnProperty(number)) {
				this.connection[number] = this.connect(this.config[number])
				return this.connection[number]
			} else {
				console.warn(`app:database Database ${this.type} number ${number} is not exist on configuration !`)
				return null
			}
		}
	}
}

const model = (name, type) => {
	return require('./' + (type || databaseDefault) + '/' + name)
}

const connectAllDatabase = () => {
	let conn = {}
	for (let type in database) {
		conn[type] = []
		for (var i = 0; i < database[type].length; i++) {
			conn[type].push(require('./' + type).getConnection(i))
		}
	}
	return conn
}

module.exports = {
	ConnectionManager,
	model,
	connectAllDatabase
}