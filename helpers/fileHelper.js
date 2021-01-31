
const imagePath = require('../constant/imageDirectory');
const mkdirp = require('mkdirp');
const fs = require('fs');
const utils = require('../helpers/utility')

const uploadFiles = async (file, fileDirConst, idName) => {
	return new Promise((resolve, reject) => {
		try {


			const uploadLocation = imagePath.imageDirectory[fileDirConst];

			console.log('helper', uploadLocation)
			const currentTS = Date.now();
			const imgExtenstion = utils.getLastPart(file.name, '.');
			const fileName = idName + "_" + currentTS + '.' + imgExtenstion;


			mkdirp(uploadLocation).then((resp) => {
				file.mv(uploadLocation + fileName, function (err) {
					if (err) {
						console.log(err);
						reject(err);

					} else {
						let result = {
							'success': true,
							'fileName': fileName

						}
						resolve(result);
					}
				});
			}).catch((err) => {
				reject(err);
			});


		} catch (err) {
			console.log("UPLOAD FILE ERROR", err);
			reject(err);
		}
	});
}

module.exports = {
	uploadFiles
}
