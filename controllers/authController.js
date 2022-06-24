const userModel = require("../model/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password is required" }); // bad request

  // finding user
  const foundUser = await userModel.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401);

  // checking password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    //JWT
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { userInfo: { roles: roles, username: foundUser.username } },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // saving the refresh token with currentUser
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      SameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
