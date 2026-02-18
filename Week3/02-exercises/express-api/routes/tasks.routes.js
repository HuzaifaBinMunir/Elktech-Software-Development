const express = require("express");
const controller = require("../controllers/tasks.controller");

const router = express.Router();

router.get("/", controller.getAllTasks);
router.post("/user/:userId", controller.createTaskForUser);
router.patch("/:id", controller.updateTaskById);
router.delete("/:id", controller.deleteTaskById);

module.exports = router;
