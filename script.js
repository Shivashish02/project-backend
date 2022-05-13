const express = require('express')
const mongoose = require('mongoose')
const ImageModel = require('./models/image')
const cors = require('cors');
/*app.use(cors({
    origin: 'https://www.section.io'
}));*/

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


mongoose.connect('mongodb://localhost/test')




app.get('/api/getimages/:pname', async (req, res) => {
	const record = await ImageModel.findOne({ pname: req.params.pname })
	console.log(record)
	if(record==null){
		res.json(record)
	}
	else{
		res.json(record.imageurl)
	}
	
})

app.post('/api/storeimageurl', async (req, res) => {
	const record = await ImageModel.findOne({ pname: req.body.pname })
	if (record != null) {
		ImageModel.findOneAndUpdate(
			{ pname: req.body.pname },
			{ $push: { imageurl: req.body.imageurl[0] } },
			function (error, success) {
				if (error) {
					console.log(error);
				} else {
					console.log(success);
				}
			});
	}
	else {
		const record = req.body
		const response = new ImageModel(record)
		response.save()
	}
	res.json({ status: 'ok' })
})


app.listen(4000, '127.0.0.1', () => {
	console.log('Server up')
})
