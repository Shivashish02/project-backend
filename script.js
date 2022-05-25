const express = require('express')
const mongoose = require('mongoose')
const ImageModel = require('./models/image')
const cors = require('cors');
const path = require('path');
const multer = require('multer');
/*app.use(cors({
	origin: 'https://www.section.io'
}));*/

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

mongoose.connect('mongodb://localhost/test')


const storage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, './uploads/');
	},

	filename: function (req, file, cb) {
		var ext = path.extname(file.originalname);
		var file2 = file;
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });

const Cloudinary = require("cloudinary");


// do cloudinary config then
Cloudinary.config({ 
	cloud_name: 'dkb684kot', 
	api_key: '533248977964628', 
	api_secret: '79_T6OloVV2H4_gJtYQc_ySvQ9A' 
  });

app.post('/api/storeimageurl1',upload.single('file'), (req, res, next) => {

	console.log("req.body in post dishes = ", req.body);
	console.log("req.file = ", req.file)

	Cloudinary.v2.uploader.upload(req.file.path,async function (err, result) {
		console.log(result.url)
		const record = await ImageModel.findOne({ pname: req.body.name })
		if (record != null) {
			ImageModel.findOneAndUpdate(
				{ pname: req.body.name },
				{ $push: { imageurl: result.url } },
				function (error, success) {
					if (error) {
						console.log(error);
					} else {
						console.log(success);
					}
				});
		}
		else {
			const response = new ImageModel()
			response.pname=req.body.name
			response.imageurl=[result.url]
			response.save()
		}
		res.json({ status: 'ok' })
	})

});

//app.post('/api/storeimageurl1', async (req, res) => {console.log("hello")})

app.get('/api/getimages/:pname', async (req, res) => {
	const record = await ImageModel.findOne({ pname: req.params.pname })
	console.log(record)
	if (record == null) {
		res.json(record)
	}
	else {
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
