import bcrypt from 'bcrypt'

const securePassword=async(password)=>{
    try {
        const hashed=await bcrypt.hash(password,10);
        return hashed
    } catch (error) {
        
    }
}
export default securePassword