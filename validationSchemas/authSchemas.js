const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
exports.register = [
  body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.").isAlpha().withMessage("First name should have Alphabets only."),
  body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.").
    isAlpha().withMessage("First name should have Alphabets only."),
  body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
    .isEmail().withMessage("Email must be a valid email address."),
  body("password").isLength({ min: 8, max: 30 }).withMessage("Password must be 8 to 30.").trim().withMessage("Password must be 8-30 characters"),
  // Sanitize fields.
  sanitizeBody("firstName").escape(),
  sanitizeBody("lastName").escape(),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape()
]

exports.login = [
  body("email").isLength({ min: 3, max: 30 }).trim().withMessage("Email must be specified beteen 3 to 30."),
  body("password").isLength({ min: 8, max: 30 }).trim().withMessage("Password must specified between 8 to 30"),
  // Sanitize fields.
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape()
]
