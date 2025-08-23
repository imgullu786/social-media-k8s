import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({to:userId}).sort({ createdAt: -1 }).populate({
            path: "from",
            select: "username profileImg"
        });
        await Notification.updateMany({to:userId}, { $set: { read: true } });
        res.json(notifications);
    } catch (error) {
        console.log("error in getNotifications controller : ", error.message);
        res.status(500).json({ error : "Internal Server Error" });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await Notification.findById(notificationId);
        if(!notification) return res.status(404).json({ error : "Notification not found" });
        if(notification.to.toString() !== userId.toString()) {
            return res.status(401).json({ error : "Unauthorized : You're not allowed to delete this notification" });
        }
        await Notification.findByIdAndDelete(notificationId);
        res.json({ message: "Notification deleted" });
    } catch (error) {
        console.log("error in deleteNotification controller : ", error.message);
        res.status(500).json({ error : "Internal Server Error" });
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to:userId});

        res.json({ message: "Notifications deleted" });
    } catch (error) {
        console.log("error in deleteNotification controller : ", error.message);
        res.status(500).json({ error : "Internal Server Error" });
    }
}