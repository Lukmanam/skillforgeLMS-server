import Course from "../models/courseModel.js";
import Category from "../models/categoryModel.js";
import cloudinary from "../utilities/cloudinary.js";
import Modules from "../models/ModulesModel.js";
import EnrolledCourse from '../models/enrolledCourseModel.js';
import stripe from "stripe";





export const addNewCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, category, price, thumbnailImage, instructor } = req.body;
        const instructorId = instructor._id
        const courseThumbnail = await cloudinary.uploader.upload(thumbnailImage, {

            folder: "CourseThumbnail",
        });

        let thumbnailImages = courseThumbnail.secure_url
        const saving = await Course.create({
            courseName: courseName,
            instructorId: instructorId,
            courseDescription: courseDescription,
            category: category,
            price: price,
            thumbnail: thumbnailImages

        })

        res.
            status(200).json({ message: "Course Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const fetchCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isBlocked: false })
        res.status(200).json({ message: "Category Fetched Successfully", categories })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const addModule = async (req, res) => {
    try {

        const { module_title, module_order, video_url, course } = req.body.formData;

        const moduleVideo = await cloudinary.uploader
            .upload(video_url,
                {
                    resource_type: "video",
                    public_id: "coursevideo",
                    eager: [
                        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
                })
            .then(result => {
                return result
            })
            .catch(error => {
                console.error("error in Uploading video", error)
            })

        const video = moduleVideo.secure_url

        const saved = await Modules.create({
            module_title: module_title,
            module_order: module_order,
            video_url: video,
            course: course

        });

        const module = saved._id

        await Course.findByIdAndUpdate({ _id: course }, { $push: { modules: { module: module } } })

        res.status(200).json({ message: "Module Added Successfully" })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}



export const deleteModule = async (req, res) => {
    try {
        const { moduleId, courseId } = req.body


        const deleted = await Course.findByIdAndUpdate({ _id: courseId }, { $pull: { modules: { _id: moduleId } } },
            { new: true }
        );

        res.status(200).json({ Message: "Module deleted Successfully" })
    }

    catch (error) {
        console.log(error);
    }

}


export const getCourseDetails = async (req, res) => {
    const { courseId } = req.params;


    const courseDetails = await Course.findOne({ _id: courseId });
    res.status(200).json({ courseDetails })
}


export const editCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, category, price, thumbnailImage, instructor, courseId } = req.body;
        const instructorId = instructor._id
        const courseThumbnail = await cloudinary.uploader.upload(thumbnailImage, {

            folder: "CourseThumbnail",
        });

        let thumbnailImages = courseThumbnail.secure_url
        const saving = await Course.findByIdAndUpdate({ _id: courseId }, {
            $set: {
                courseName: courseName,
                instructorId: instructorId,
                courseDescription: courseDescription,
                category: category,
                price: price,
                thumbnail: thumbnailImages
            }


        })

        res.
            status(200).json({ message: "Edit Has been Done Successfully" });
    } catch (error) {
        console.log(error);
    }
}



export const paymentCheckout = async (req, res) => {
    const stripeInstance = stripe('sk_test_51OFr1pSB3NLla9eM1vE5JuNyD4fIMDGfyLEn6WZoaJNUzhZhKMzONjIuZWEQj8DZyprUuykNLJIRxWLXiadQgYqe00HEwuW6rM')

    const course = req.body.courseData

    const lineItems = [
        {
            price_data: {
                currency: "inr",
                product_data: {
                    name: course.courseName,
                },
                unit_amount: course.price * 100
            },

            quantity: 1,
        }
    ];

    const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `https://skillforge-lms-client.vercel.app/enrollSuccess/${course._id}`,
        cancel_url: `https://skillforge-lms-client.vercel.app/CourseDetails/${course._id}`,
        // customer_email: "test@example.com", // Use a dummy email for testing
        // billing_address_collection: "auto"

    });


    res.json({ id: session.id })

}




export const saveProgress = async (req, res) => {

    const { courseId, studentId, moduleId } = req.body;
    const progress = await EnrolledCourse.findOneAndUpdate({ studentId: studentId, courseId: courseId }, { $push: { Progress: moduleId } })

}

export const alreadyCompletedModules = async (req, res) => {
    const courseId = req.query.courseId;
    const studentId = req.query.studentId;
    const modulesCompleted = await EnrolledCourse.findOne({ courseId: courseId, studentId: studentId });
    res.status(200).json({ modulesCompleted })

}







