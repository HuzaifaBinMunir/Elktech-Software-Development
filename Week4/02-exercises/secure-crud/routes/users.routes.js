const router = require("express").Router();

const controller = require("../controllers/users.controllers");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createUserSchema } = require("../validation/user.validation");

// Protect all /users routes (requires Authorization: Bearer <token>)
router.use(auth);

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);

// Validate request body using Joi schema
router.post("/", validate(createUserSchema), controller.createUser);

module.exports = router;
