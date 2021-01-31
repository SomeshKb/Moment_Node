const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const authSchema = require('../validationSchemas/authSchemas');
const jwtHelper = require('../helpers/jwtHelper')

exports.register = [
	authSchema.register,
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {

				UserModel.findOne({ email: req.body.email }).then(user => {
					if (user) {
						return apiResponse.ErrorResponse(res, 'Email Already Exists.');
					}
					else {
						//hash input password
						bcrypt.hash(req.body.password, 10, function (err, hash) {
							// Create User object with escaped and trimmed data
							var user = new UserModel(
								{
									firstName: req.body.firstName,
									lastName: req.body.lastName,
									email: req.body.email,
									password: hash,
								}
							);

							user.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								let userData = {
									_id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									email: user.email
								};
								return apiResponse.successResponseWithData(res, "Registration Success.", userData);
							});

						});
					}
				});


			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

exports.login = [
	authSchema.login,
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				UserModel.findOne({ email: req.body.email }).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password, user.password, function (err, same) {
							if (same) {
								let userData = {
									_id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									email: user.email,
								};
								userData['token'] = jwtHelper.authenticateToken(userData);

								return apiResponse.successResponseWithData(res, "Login Success.", userData);

							} else {
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					} else {
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];
