const express = require('express')
const mongoose = require('mongoose')
const ImageModel = require('./models/image')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


mongoose.connect('mongodb://localhost/test')


app.get('/api/getimages', async (req, res) => {
	const record = await ImageModel.findOne({pname : req.params.pname})
	console.log(record)
	res.json(record)
})

app.post('/api/storeimageurl', async (req, res) => {
	const record = req.body
	const response = new ImageModel(record)
	response.save()
	res.json({ status: 'ok' })
})


app.listen(3000, '127.0.0.1', () => {
	console.log('Server up')
})
