const employeeModel = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await employeeModel.find();
  if (!employees)
    return res.status(204).json({ message: "There are no employees" });
  res.status(200).json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First name and lastname is required!" });
  }
  try {
    const newEmployee = await employeeModel.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: `Employee id is required!`,
    });
  }
  const employee = await employeeModel.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res.status(400).json({
      message: `Employee with the employee id ${req.body.id} does not exist`,
    });
  }
  try {
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: `Employee Id required` });

  const employee = await employeeModel.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id ${req.body.id} not found!` });
  }

  const result = await employeeModel.deleteOne({ _id: req.body.id });
  console.log(result);
  res.status(201).json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: `Employee Id required` });

  const employee = await employeeModel.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id ${req.params.id} not found!` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
