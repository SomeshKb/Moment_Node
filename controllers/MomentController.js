const MomentModel = require("../models/MomentModel");
const { validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const momentSchemas = require('../validationSchemas/momentSchemas');
const mongoose = require('mongoose')
const fileHelper = require('../helpers/fileHelper')

exports.create = [
	momentSchemas.create,
	// Process request after validation and sanitization.
	async (req, res) => {
		try {

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {

				let filesResult = await fileHelper.uploadFiles(req.files.attachFiles, 'MOMENT_IMAGE', 'MOMENT');

				if (filesResult && filesResult.success) {
					filesResult['filePath'] = req.protocol + '://' + req.get('host') + '/uploads/moments/' + filesResult.fileName;
				} else {
					throw Error('Error while uploading files')
				}

				// Multipart formdata doesn't support array data thus need to parse then as string
				if (req.body.tags && !Array.isArray(req.body.tags)) {
					req.body['tags'] = JSON.parse(req.body.tags);
				}
				// Create user object with escaped and trimmed data
				var moment = new MomentModel(
					{
						title: req.body.title,
						tags: req.body.tags,
						description: req.body.description,
						user: req.user._id,
						filePath: filesResult['filePath']
					}
				);

				moment.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let momentData = {
						_id: moment._id,
						title: moment.title,
						tags: moment.tags,
						description: moment.description,
						filePath: moment.filePath
					};
					return apiResponse.successResponseWithData(res, "Moment Added Successfully", momentData);
				});

			}
		} catch (err) {
			//throw error in json response with status 500.
			console.log(err)
			return apiResponse.ErrorResponse(res, err);
		}
	}];



exports.MomentList = [
	momentSchemas.list,
	async (req, res) => {
		try {

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}

			let limit = req.query.limit
			let page = req.query.page

			MomentModel.find({ user: mongoose.Types.ObjectId(req.user._id) }).limit(limit * 1)
				.skip((page - 1) * limit).then(async (Moments) => {
					const count = await MomentModel.countDocuments();

					let momentData = {
						totalCount: count,
						Data: Moments
					}

					if (Moments.length > 0) {
						return apiResponse.successResponseWithData(res, "Operation success", momentData);
					} else {
						return apiResponse.successResponseWithData(res, "Operation success", []);
					}
				});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.MomentDetail = [
 (req, res) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.notFoundResponse(res, "Moment not exists with this id");
		}
		try {
			MomentModel.findOne({ _id: req.params.id }).then((foundMoment) => {
				if (foundMoment !== null) {
					if (foundMoment.user.toString() !== req.user._id) {
						return apiResponse.notFoundResponse(res, "Moment not exists with this id");
					}
					let MomentData = new MomentModel(foundMoment);
					return apiResponse.successResponseWithData(res, "Operation success", MomentData);
				} else {
					return apiResponse.notFoundResponse(res, "Moment not exists with this id");
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


exports.update = [
	momentSchemas.update,
	async (req, res) => {
		try {

			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {

					MomentModel.findById(req.params.id, async function (err, foundMoment) {

						if (foundMoment === null) {
							return apiResponse.notFoundResponse(res, "Moment not exists with this id");
						} else {

							//Check authorized user
							if (foundMoment.user.toString() !== req.user._id) {
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {

								let momentBody = req.body;

								if (req.files && req.files.attachFiles) {
									let filesResult = await fileHelper.uploadFiles(req.files.attachFiles, 'MOMENT_IMAGE', 'MOMENT');
									if (filesResult && filesResult.success) {
										filesResult['filePath'] = req.protocol + '://' + req.get('host') + '/uploads/moments/' + filesResult.fileName;
										momentBody['filePath'] = filesResult['filePath'];
									} else {
										throw Error('Error while uploading files')
									}
								}

								if (req.body.tags && !Array.isArray(req.body.tags)) {
									momentBody['tags'] = JSON.parse(req.body.tags);
								}


								//update Moment.
								MomentModel.findByIdAndUpdate(req.params.id, momentBody, {}, function (err, result) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										return apiResponse.successResponseWithData(res, "Moment update Success.", {});
									}
								});

							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


exports.MomentDelete = [
	(req, res) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			MomentModel.findById(req.params.id, function (err, foundMoment) {
				if (foundMoment === null) {
					return apiResponse.notFoundResponse(res, "Moment not exists with this id");
				} else {
					//Check authorized user
					if (foundMoment.user.toString() !== req.user._id) {
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {
						//delete Moment.
						MomentModel.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								return apiResponse.successResponse(res, "Moment delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
