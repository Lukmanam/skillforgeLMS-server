import Instructor from '../models/instructorModel.js'
import securePassword from '../utilities/securePassword.js';
import sendMailOtp from '../utilities/otpControl.js';

let otpId;
export const registerInstructor = async (req, res) => {

    try {
        const { name, email, phone, password } = req.body;
        const emailexist = await Instructor.findOne({ email: email })
        const hashedPassword=await securePassword(password)
        if (emailexist) {
            return res
                .status(401)
                .json({ message: "Already Registered on this email" })
        }
        else {
            const instructor = new Instructor({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword
            })
            const instructorData = await instructor.save();
            otpId=await sendMailOtp(instructor.name, instructor.email,instructor._id)
            console.log(instructorData, "this is instructor data");
            return res
                .status(201)
                .json({message: `otp Has been send to ${email}`,instructor:instructorData,otpId:otpId })
        }



    } catch (error) {
        console.log(error);
    }
}



