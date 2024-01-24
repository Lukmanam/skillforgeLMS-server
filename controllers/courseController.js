import Course from "../models/courseModel.js";
import Category from "../models/categoryModel.js";
import cloudinary from "../utilities/cloudinary.js";
import Modules from "../models/ModulesModel.js";
import EnrolledCourse from '../models/enrolledCourseModel.js';
import stripe from "stripe";





export const addNewCourse = async (req, res) => {
    try {
        console.log(req.body);
        const { courseName, courseDescription, category, price, thumbnailImage, instructor } = req.body;
        console.log(category, "this is category Selected");
        console.log(courseDescription, "this is deiscregad Selected");
        console.log(price, "this is price Selected");
        console.log(category, "this is category Selected");
        const instructorId = instructor._id
        const courseThumbnail = await cloudinary.uploader.upload(thumbnailImage, {

            folder: "CourseThumbnail",
        });

        let thumbnailImages = courseThumbnail.secure_url
        console.log(thumbnailImages);
        const saving = await Course.create({
            courseName: courseName,
            instructorId: instructorId,
            courseDescription: courseDescription,
            category: category,
            price: price,
            thumbnail: thumbnailImages

        })
        console.log(saving);

        res.
            status(200).json({ message: "Course Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const fetchCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isBlocked: false })
        console.log(categories);
        res.status(200).json({ message: "Category Fetched Successfully", categories })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const addModule = async (req, res) => {
    try {
        console.log(req.body, "this is course in backend");

        const { module_title, module_order, video_url, course } = req.body.formData;
        console.log(course, "course");

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

        console.log(moduleVideo);
        const video = moduleVideo.secure_url

        const saved = await Modules.create({
            module_title: module_title,
            module_order: module_order,
            video_url: video,
            course: course

        });
        console.log(saved._id, "this is module Id");
        const module = saved._id

        await Course.findByIdAndUpdate({ _id: course }, { $push: { modules: { module: module } } })

        res.status(200).json({ message: "Module Added Successfully" })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}



export const deleteModule = async (req, res) => {
    try {
        console.log(req.body, "in deleteModule Function");
        const { moduleId, courseId } = req.body
        console.log(moduleId, "this is Module id");
        console.log(courseId, "this is course id");
        const deleted = await Course.findByIdAndUpdate({ _id: courseId }, { $pull: { modules: { _id: moduleId } } },
            { new: true }
        );
        console.log(deleted, "deleted");
        res.status(200).json({ Message: "Module deleted Successfully" })
    }

    catch (error) {
        console.log(error);
    }

}


export const getCourseDetails = async (req, res) => {
    const { courseId } = req.params;
    console.log(courseId);

    const courseDetails = await Course.findOne({ _id: courseId });
    console.log(courseDetails, "this is course Details  for edit Course");
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
        console.log(thumbnailImages);
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
        console.log(saving);

        res.
            status(200).json({ message: "Edit Has been Done Successfully" });
    } catch (error) {
        console.log(error);
    }
}



export const paymentCheckout = async (req, res) => {
    const stripeInstance = stripe('sk_test_51OFr1pSB3NLla9eM1vE5JuNyD4fIMDGfyLEn6WZoaJNUzhZhKMzONjIuZWEQj8DZyprUuykNLJIRxWLXiadQgYqe00HEwuW6rM')
    console.log(req.body, "this is whole Body");
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
        success_url: `http://localhost:5173/enrollSuccess/${course._id}`,
        cancel_url: `http://localhost:5173/CourseDetails/${course._id}`,
        // customer_email: "test@example.com", // Use a dummy email for testing
        // billing_address_collection: "auto"

    });

    console.log(session, "this is sessioon");
    res.json({ id: session.id })

    console.log(course, "this is course Data which is Enrollinggggggggggggggggggggggg");

}




export const saveProgress = async (req, res) => {
    console.log(req.body, "saving Progreess of learning");
    const { courseId, studentId, moduleId } = req.body;
    // const alreadyexist=await EnrolledCourse.findOne({studentId:studentId,courseId:courseId})
    const progress = await EnrolledCourse.findOneAndUpdate({ studentId: studentId, courseId: courseId }, { $push: { Progress: moduleId } })
    console.log(progress);

}

export const alreadyCompletedModules=async(req,res)=>{
    const courseId = req.query.courseId;
    const studentId = req.query.studentId;
    const modulesCompleted=await EnrolledCourse.findOne({courseId:courseId,studentId:studentId});
    console.log(modulesCompleted);
    res.status(200).json({modulesCompleted})

}







