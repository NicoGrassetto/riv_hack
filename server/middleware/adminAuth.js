// Middleware to check if user is an admin
// NOTE: You need to add an 'isAdmin' field to your User model to use this

const adminAuth = (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // Check if user has admin privileges
    // IMPORTANT: Add 'isAdmin: Boolean' field to your User schema
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin privileges required for this action' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error verifying admin status' 
    });
  }
};

module.exports = adminAuth;
