const Notification = require("../models/Notification");


const createNotification = async ({
  userId,
  title,
  message,
  type = "general",
  data = {},
}) => {

  try {

    const notification =
      await Notification.create({
        userId,
        title,
        message,
        type,
        data,
      });


    return notification;


  } catch (error) {

    console.error(
      "Notification creation failed:",
      error.message
    );

    // Don't break main operation
    // Example: booking should succeed even if notification fails
    return null;
  }

};


module.exports = createNotification;