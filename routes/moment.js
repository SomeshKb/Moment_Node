var express = require("express");
const jwtAuth = require("../middlewares/authenticator")
const MomentController = require("../controllers/MomentController");

var router = express.Router();

router.get("/", jwtAuth.authenticateToken, MomentController.MomentList);
router.post("/create", jwtAuth.authenticateToken, MomentController.create);
router.put("/update/:id" ,jwtAuth.authenticateToken,MomentController.update);
router.get("/:id" ,jwtAuth.authenticateToken,MomentController.MomentDetail);
router.delete("/:id" ,jwtAuth.authenticateToken,MomentController.MomentDelete);


module.exports = router;