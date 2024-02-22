const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Authorization token not found.',
        success: false,
      });
    }
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: 'Auth Fialed',
          success: false,
        });
      } else {
        if (new Date() > new Date(decode.exp * 1000)) {
          return res.status(200).send({
            message: 'Token has expired',
            success: false,
          });
        } else {
          req.body.userId = decode.id;
          next();
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Auth Failed',
      success: false,
    });
  }
};
