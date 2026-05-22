// The API Gateway (Java) validates the JWT and forwards
// x-user-id and x-user-role headers to this service.
const validateToken = (req, res, next) => {
    const userId   = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    const brigadeId = req.headers['x-user-brigade'];


    if (!userId) {
        return res.status(401).json({ error: 'Token required' });
    }

    req.user = { id: parseInt(userId), role: userRole , brigade_id: brigadeId ? parseInt(brigadeId) : null
    };
    next();
};

module.exports = { validateToken };