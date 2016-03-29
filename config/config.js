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

	},

	"staging": {
		mode: "staging",

	},

	"production": {
		mode: "production",
	}
}

module.exports = function(mode) {
	// Set env
	config.env = env[mode || process.argv[2] || "development"] || env.development
	return config
}