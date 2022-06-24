const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ROLES_LISTS = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LISTS.Admin, ROLES_LISTS.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LISTS.Admin, ROLES_LISTS.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LISTS.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
