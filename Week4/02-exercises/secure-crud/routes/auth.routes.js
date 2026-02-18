const router = require("express").Router();

const { signup, login } = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { signupSchema, loginSchema } = require("../validation/auth.validation");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

module.exports = router;
