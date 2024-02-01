import NotificationModel from "../models/notificationModel.js";
import Message from "../models/messageModel.js";



export const addMessage = async (req, res) => {
    try {
        const { chatId, text, senderId } = req.body

        const message = new Message({ chatId, text, senderId })

        const result = await message.save()
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params

        const result = await Message.find({ chatId: id })

        res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

