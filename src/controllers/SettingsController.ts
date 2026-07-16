import { Request, Response } from 'express';
import Settings from '../models/Settings';

// Get Settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        message: 'Settings not found',
      });
    }

    res.status(200).json({
      success: true,
      settings,
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

export const createSettings = async (req: Request, res: Response) => {
  try {
    const settingsExist = await Settings.findOne();

    if (settingsExist) {
      return res.status(400).json({
        message: 'Settings already exist',
      });
    }

    const settings = await Settings.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Settings created successfully',
      settings,
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

// Update Settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        message: 'Settings not found',
      });
    }

    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      req.body,
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings,
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
