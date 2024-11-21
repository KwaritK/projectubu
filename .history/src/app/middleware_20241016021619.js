const checkBanStatus = (req, res, next) => {
    if (req.user && req.user.isBanned) {
      return res.status(403).json({ message: 'Your account is banned. Please contact support.' });
    }
    next();
  };
  