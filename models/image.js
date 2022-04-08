const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
	pname : {type: String},
	imageurl : [{ type: String}]
})


const ImageModel = mongoose.model('ImageModel', ImageSchema)

module.exports = ImageModel 