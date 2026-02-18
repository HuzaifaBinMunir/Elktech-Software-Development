const express = require("express");
const controller = require("../controllers/users.controllers");

const router = express.Router();

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);

module.exports = router;
