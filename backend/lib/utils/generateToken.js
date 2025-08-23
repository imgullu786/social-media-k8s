import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId : userId}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME});

    const cookieOptions = {
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000, // convert days to milliseconds
        httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
        secure: process.env.NODE_ENV === 'production' ? true : false,
    };

    res.cookie('jwt', token, cookieOptions);
}