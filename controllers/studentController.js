import Student from '../models/studentModel.js';
import { sendMailOtp } from '../utilities/otpControl.js';
import securePassword from '../utilities/securePassword.js';


let otpId;
const studentSignup = async (req, res) => {
    try {
        console.log("hellooo");
        const { name, email, phone, password } = req.body
        const emailexist = await Student.findOne({ email: email })
        const hashedPassword = await securePassword(password)
        if (emailexist) {
            return res
                .status(401)
                .json({ message: "Ooops! Already registered with this mail" })
        }
        else {
            const student = new Student({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword
            })
            const studentData = await student.save();
            otpId = await sendMailOtp(student.name, student.email, student._id);
            console.log(otpId,"this is OTP DETAILS");

            return res.status(201).json({ message: `otp Has been send to ${email}`, student: studentData,otpId:otpId })
        }

    } catch (error) {
        console.log("this is error", error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export default studentSignup