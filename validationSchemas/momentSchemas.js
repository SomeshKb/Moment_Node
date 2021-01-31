const { body, validationResult, query } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const utils = require('../helpers/utility')

exports.create = [
  body("title").isLength({ min: 3, max: 30 }).trim().withMessage("Title must be specified between 3 to 30.").matches("^[A-Za-z0-9 _-]*[A-Za-z0-9][A-Za-z0-9 _-]*$").withMessage("Should be only Alphanumeric space - and _"),
  body("description").isLength({ min: 3, max: 50 }).trim().withMessage("Description must be specified between 3 to 50.").matches("^[A-Za-z0-9 _-]*[A-Za-z0-9][A-Za-z0-9 _-]*$").withMessage("Should be only Alphanumeric space - and _"),

  body('tags').custom((value, { req }) => {
    if (value && !Array.isArray(value)) {
      value = JSON.parse(req.body.tags);
    }
    if (!Array.isArray(value)) {
      throw new Error('Tags should be Array');
    } else if (value.length == 0 || value.length > 3) {
      throw new Error('Tags Arrays should have min 1 value and max 3 values');
    }
    return true;
  }),
  body('attachFiles').custom((value, { req }) => {

    if (!req.files) {
      throw new Error('No image found');
    }
    let fileType = utils.getLastPart(req.files.attachFiles.name, '.');
    const validFileType = ['png', 'jpg', 'jpeg'];

    if (!validFileType.includes(fileType)) {
      throw new Error('Invalid file type. Only png,jgp,jpeg accepted');
    }
    return true;
  }),

  // Sanitize fields.
  sanitizeBody("title").escape(),
  sanitizeBody("description").escape()
]




exports.update = [
  body("title").isLength({ min: 3, max: 30 }).trim().withMessage("Title must be specified between 3 to 30.").matches("^[A-Za-z0-9 _-]*[A-Za-z0-9][A-Za-z0-9 _-]*$").withMessage("Should be only Alphanumeric space - and _"),
  body("description").isLength({ min: 3, max: 50 }).trim().withMessage("Description must be specified between 3 to 50.").matches("^[A-Za-z0-9 _-]*[A-Za-z0-9][A-Za-z0-9 _-]*$").withMessage("Should be only Alphanumeric space - and _"),

  body('tags').custom((value, { req }) => {
    if (!value) {
      return true;
    }
    console.log(value)
    if (value && !Array.isArray(value)) {
      value = JSON.parse(req.body.tags);
    }
    if (!Array.isArray(value)) {
      throw new Error('Tags should be Array');
    } else if (value.length > 3) {
      throw new Error('Tags Arrays should have min 1 value and max 3 values');
    }
    return true;
  }),

  body('attachFiles').custom((value, { req }) => {

    if (!req.files) {
      return true;
    }
    let fileType = utils.getLastPart(req.files.attachFiles.name, '.');
    const validFileType = ['png', 'jgp', 'jpeg'];

    if (validFileType.includes(fileType)) {
      throw new Error('Invalid file type. Only png,jgp,jpeg accepted');
    }
    return true;
  }),

  // sanitizeBody("title").escape(),
  // sanitizeBody("tags").escape(),
  // sanitizeBody("description").escape()
]

exports.list = [
  query("limit").isNumeric().withMessage('limit should be numeric').custom((value, { req }) => {
    if (value < 1) {
      throw new Error('limit should be not be less than 1');
    }
    return true;
  }),
  query("page").isNumeric().withMessage('page should be numeric').custom((value, { req }) => {
    if (value < 1) {
      throw new Error('page should be not be less than 1');
    }
    return true;
  }),
]
