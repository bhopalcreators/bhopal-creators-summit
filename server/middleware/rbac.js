import { ROLE_PERMISSIONS } from '../models/User.js';

/**
 * requirePermission('content', 'update') checks whether req.user's role
 * grants that action either on the specific resource key or via the
 * wildcard '*' resource (super_admin / admin / viewer use the wildcard).
 */
export function requirePermission(resource, action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const permissions = ROLE_PERMISSIONS[req.user.role];
    if (!permissions) {
      return res.status(403).json({ success: false, message: 'Unknown role — access denied.' });
    }

    const allowedActions = permissions[resource] || permissions['*'];
    if (!allowedActions || !allowedActions.includes(action)) {
      return res.status(403).json({
        success: false,
        message: `Your role (${req.user.role}) does not have '${action}' access to '${resource}'.`,
      });
    }

    next();
  };
}

// Shortcut for routes that only certain named roles may access at all,
// regardless of the granular permission table (e.g. user management).
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have access to this action.' });
    }
    next();
  };
}
