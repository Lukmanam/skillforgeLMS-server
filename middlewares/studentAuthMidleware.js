

const studentAuthMidleware = (req,res,next) => {
 try {
    
    const token=req.header('autherization');
    console.log(token,"in student auth middleware");
    if(!token){
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    next();
 } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
 }
}

export default studentAuthMidleware
