const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open')
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`)
  })
