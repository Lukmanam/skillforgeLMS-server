

const instructorAuthMiddleware = (req,res,next) => {
    try {
        const token = req.header('autherization');
        console.log(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

}

export default instructorAuthMiddleware
