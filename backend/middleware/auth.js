import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    // 1. Get the authorization header
    const { authorization } = req.headers;

    // 2. Check if the header exists and is correctly formatted
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required or malformed"
        });
    }

    try {
        // 3. Extract the token from the "Bearer <token>" string
        const token = authorization.split(' ')[1];

        // 4. Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach user info to req.user, not req.body
        req.user = {
            id: token_decode.id
        };
        
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }
};

export default authUser;