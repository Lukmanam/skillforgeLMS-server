import Otp from '../models/otpModel.js'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'


 export const sendMailOtp = async (name, email, studentId) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, 
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        let otp = `${Math.floor(Math.random() * 9000)}`
        otp = otp.padStart(4, '0');
        const options = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "SkillForGe Email verification",
            html: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
            <div style="margin: 50px auto; width: 70%; padding: 20px 0">
              <div style="border-bottom: 1px solid #eee">
                <a href="" style="font-size: 1.4em; color: #49BBBD; text-decoration: none; font-weight: 600">
                SkillForGe
                </a>
              </div>
              <p style="font-size: 1.1em">Hi,${name}</p>
              <p>Thank you for choosing <b>SkillForGe</b>. Use the following OTP to complete  procedures. OTP is valid for a few minutes</p>
              <h2 style="background: #49BBBD; margin: 0 auto; width: max-content; padding: 0 10px; color: white; border-radius: 4px;">
                ${otp}
              </h2>
              <p style="font-size: 0.9em;">Regards,<br />SkillForGe</p>
              <hr style="border: none; border-top: 1px solid #eee" />
              <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
                <p>SkillForGe</p>
                <p>The NH66 Calicut</p>
                <p>India</p>
              </div>
            </div>
          </div>
        `,
        
        }
        const verificationOtp = new Otp({
            studentId: studentId,
            otp: otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 300000
        })
        let verified = await verificationOtp.save()
        transporter.sendMail(options, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(otp);
                console.log(`email has been sent to${email}` , info.response);
            }
        })

        return verified._id;
    } catch (error) {
        console.log(error.message);
    }

}
 

export const sendResetpassword=async(name,email,id)=>{
  try {
    const transporter=nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, 
      secure: false,
      requireTLS: true,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
    })
    const options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SkillForGe Email verification",
      html: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
      <div style="margin: 50px auto; width: 70%; padding: 20px 0">
        <div style="border-bottom: 1px solid #eee">
          <a href="" style="font-size: 1.4em; color: #49BBBD; text-decoration: none; font-weight: 600">
          SkillForGe
          </a>
        </div>
        <p style="font-size: 1.1em">Hi,${name}</p>
        <p><b>Use reset Link to change Your SkillForGe Password.<a href="https://skillforge-lms-client.vercel.app/changepassword?id=${id}">Click here</a></b></p><br/>

        <p style="font-size: 0.9em;">Regards,<br />SkillForGe</p>
        <hr style="border: none; border-top: 1px solid #eee" />
        <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
          <p>SkillForGe</p>
          <p>The NH66 Calicut</p>
          <p>India</p>
        </div>
      </div>
    </div>
  `,
  }
  transporter.sendMail(options, (error, info) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log(`email has been sent to${email}` , info.response);
    }
})

    
    
  } catch (error) {
    console.log(error.message);
    
  }
}




export const sendResetpasswordIns=async(name,email,id)=>{
  try {
    const transporter=nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, 
      secure: false,
      requireTLS: true,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
    })
    const options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SkillForGe Email verification",
      html: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
      <div style="margin: 50px auto; width: 70%; padding: 20px 0">
        <div style="border-bottom: 1px solid #eee">
          <a href="" style="font-size: 1.4em; color: #49BBBD; text-decoration: none; font-weight: 600">
          SkillForGe
          </a>
        </div>
        <p style="font-size: 1.1em">Hi,${name}</p>
        <p><b>Use reset Link to change Your SkillForGe Password.<a href="https://skillforge-lms-client.vercel.app/instructor/inschangePassword?id=${id}">Click here</a></b></p><br/>
        
        

        <p style="font-size: 0.9em;">Regards,<br />SkillForGe</p>
        <hr style="border: none; border-top: 1px solid #eee" />
        <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
          <p>SkillForGe</p>
          <p>The NH66 Calicut</p>
          <p>India</p>
        </div>
      </div>
    </div>
  `,
  }
  transporter.sendMail(options, (error, info) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log(`email has been sent to${email}` , info.response);
    }
})

    
    
  } catch (error) {
    console.log(error.message);
    
  }
}
