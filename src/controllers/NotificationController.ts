import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const notifications = await Notification.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      isRead: false,
    });

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      totalNotifications: notifications.length,
      unreadCount,
      readCount: notifications.length - unreadCount,
      notifications,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};


export const getMyAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      totalNotifications: notifications.length,
      unreadCount,
      readCount: notifications.length - unreadCount,
      notifications,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    console.log('notificationId:', notificationId);
    console.log('userId:', userId);
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const readAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      {
        user: userId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res.status(200).json({
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const deleteNotificationById = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};
