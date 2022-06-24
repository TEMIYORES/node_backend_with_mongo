const userModel = require("../model/User");

const handleLogout = async (req, res) => {
  //handle the accessToken on the front end

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  // is refreshToken in DB?
  const foundUser = await userModel.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, SameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, SameSite: "None", secure: true });
  return res.sendStatus(204);
};
module.exports = { handleLogout };
