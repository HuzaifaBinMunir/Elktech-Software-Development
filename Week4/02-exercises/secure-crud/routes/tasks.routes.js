const router = require("express").Router();

const controller = require("../controllers/tasks.controller");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createTaskSchema, updateTaskSchema } = require("../validation/task.validation");

// Protect all task routes
router.use(auth);

router.get("/", controller.getAllTasks);

// Create task for specific user
router.post(
  "/user/:userId",
  validate(createTaskSchema),
  controller.createTaskForUser
);

router.put(
  "/:id",
  validate(updateTaskSchema),
  controller.updateTaskById
);

router.delete("/:id", controller.deleteTaskById);

module.exports = router;
