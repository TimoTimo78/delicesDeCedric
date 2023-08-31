const mongoose = require('mongoose');

const DB = 'marketplace'
const URI = `mongodb+srv://usertest:test123@cluster1.eprk7sg.mongodb.net/${DB}?retryWrites=true&w=majority`

const MongoDBClient = {
    initialize: () => {
        try {
            const client = mongoose.connect(URI, 
                { 
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                })
            client.then(() => console.log(`🎉 🎉 successfully connected to DB: ${DB}`))
        } catch(e) {
            throw Error(e)
        }
    }
}

module.exports = MongoDBClient