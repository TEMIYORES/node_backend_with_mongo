const userModel = require("../model/User");

const jwt = require("jsonwebtoken");

const handlerefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // unauthorized

  const refreshToken = cookies.jwt;

  const foundUser = await userModel.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    if (foundUser.username !== decoded.username) return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { userInfo: { roles: roles, username: decoded.username } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handlerefreshToken };
