module.exports = {
	"url": process.env.DATABASE_URL,
  "type": "postgres",
  "synchronize": true,
  "entities": [
    "build/entity/*.js"
  ],
	"extra": {
		"ssl": true
	}
}