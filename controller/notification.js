const Notification = require('../models/notificationModel'); 

const getNotificationCount = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Count notifications for the user
    const total = await Notification.countDocuments({ userId });

    return res.status(200).json({
      status: 200,
      message: "Retrieved notification count successfully",
      data: {
        total: total,
      }
    });
  } catch (error) {
    console.error("Error retrieving notification count:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

const getNotificationById = async (req, res) => {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;
  
      // Finding the notification by ID and also ensuring it belongs to the authenticated user
      const notification = await Notification.findOne({ _id: notificationId, userId });
  
      if (!notification) {
        return res.status(404).json({
          status: 404,
          message: "Notification not found"
        });
      }
  
      return res.status(200).json({
        status: 200,
        message: "Retrieved notification successfully",
        data: {
          id: notification._id,
          message: notification.message,
          isRead: notification.read,
          createdAt: notification.createdAt,
        }
      });
    } catch (error) {
      console.error("Error retrieving notification:", error);
      return res.status(500).json({
        status: 500,
        message: "Server error"
      });
    }
  };
  
  
  const updateNotificationStatus = async (req, res) => {
    try {
      const { id } = req.params; 
      const { isRead } = req.body; // Get the new read status from the request body
  
      if (typeof isRead !== 'boolean') {
        return res.status(400).json({
          status: 400,
          message: "Invalid 'isRead' value. It must be a boolean."
        });
      }
  
      // Find and update the notification and ensure it belongs to the user
      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId: req.user.id }, 
        { isRead: isRead },
        { new: true } // Return the updated notification
      );
  
      if (!notification) {
        return res.status(404).json({
          status: 404,
          message: "Notification not found"
        });
      }
  
      return res.status(201).json({
        status: 201,
        message: "Notification successfully marked",
        data: {
          title: notification.title || "No Title",
          message: notification.message,
          isRead: notification.isRead
        }
      });
    } catch (error) {
      console.error("Error updating notification status:", error);
      return res.status(500).json({
        status: 500,
        message: "Server error"
      });
    }
  };
  
  const deleteNotification = async (req, res) => {
    try {
      const userId = req.user.id; 
      const notificationId = req.params.id; 
  
      // Check if the notification exists and belongs to the user
      const notification = await Notification.findOne({ _id: notificationId, userId });
      if (!notification) {
        return res.status(404).json({
          status: 404,
          message: "Notification not found or does not belong to the user",
          data: {}
        });
      }
  
    
      await Notification.deleteOne({ _id: notificationId });
  
      return res.status(200).json({
        status: 200,
        message: "Notification deleted successfully",
        data: {}
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      return res.status(500).json({
        status: 500,
        message: "Server error",
        data: {}
      });
    }
  };
  
  

module.exports = { getNotificationCount,
                   getNotificationById,
                   updateNotificationStatus,
                   deleteNotification};
