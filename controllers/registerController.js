const userModel = require("../model/User");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password is required" }); // bad request

  //check for duplicate username
  const duplicate = await userModel.findOne({ username: user }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ Message: `Username ${user} Already exists!` }); // conflict

  try {
    // encrypt password
    const hashedPassword = await bcrypt.hash(pwd, 10);
    // storing new user info
    const result = await userModel.create({
      username: user,
      password: hashedPassword,
    });
    console.log(result);
    res.status(201).json({ message: `User ${user} was created` }); //update
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
