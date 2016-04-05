/* Config.js */


var config = {
	"twilio": {
		"number": "+18326484974",
		"account_sid": "ACdee6a83ef1fcb58a840870eef9eebd5a",
		"auth_token": "aee67fb6cef650cee4859a76b52eef24",
		"admin": "+17134126344"
	}
}

var env = {
	"development": {
		mode: "development",
		port: "3000"
	},

	"staging": {
		mode: "staging",
		port: process.env.PORT || '3000'
	},

	"production": {
		mode: "production",
		port: process.env.PORT
	}
}

module.exports = function(mode) {

	// Set env
	config.env = env[process.env.NODE_ENV || mode || process.argv[2] || "development"] || env.development
	
	// Set root url
	config.root_url = process.env.ROOT_URL || ('http://localhost:' + config.env.port)

	return config
}