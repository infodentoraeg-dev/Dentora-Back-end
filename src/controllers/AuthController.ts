import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { UserRole } from '../enums/UserRole';
import { createAndSaveOtp, verifyOtp } from '../services/otp';
import PendingUser from '../models/PendingUser';

export const register = async (req: Request, res: Response) => {
  try {
    const userData = { ...req.body };
    const { fullName, email, phone, password } = userData;
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: 'All required fields are required',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let user = await User.findOne({
      email: userData.email.trim().toLowerCase(),
    });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const pendingUser = await PendingUser.create({
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      password: hashedPassword,
      role: UserRole.DOCTOR,
    });
    await pendingUser.save();
    await createAndSaveOtp(email);
    res.status(201).json({
      message: `otp send to ${email}`,
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
export const verify = async (req: Request, res: Response) => {
  try {
    console.log('verify called');
    console.log(req.body);
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: 'All required fields are required',
      });
    }
    const pendingUser = await PendingUser.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!pendingUser)
      return res.status(400).json({ message: 'User not found' });

    if (await verifyOtp(email, otp)) {
      const user = await User.create({
        fullName: pendingUser.fullName || '',
        email: pendingUser.email || '',
        phone: pendingUser.phone || '',
        password: pendingUser.password || '',
        role: UserRole.DOCTOR,
        isVerified: true,
      });
      await pendingUser.deleteOne();
      const token = jwt.sign(
        { id: user._id, role: user.role, fullName: user.fullName },
        process.env.JWT_SECRET as string,
        {
          expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        },
      );
      const userResponse = await User.findById(user._id).select('-password');

      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: userResponse,
      });
    }
    if (!(await verifyOtp(email, otp))) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      },
    );

    res.status(200).json({
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
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

// get my profile

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json(user);
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

// update my profile

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    if (req.body.role && req.body.role !== user.role) {
      return res.status(403).json({
        message: "You can't change your role",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      message: 'User update successfully',
      user: updatedUser,
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

//delete me
export const deleteMe = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.user.id).select('-password');
  res.json({
    message: 'User deleted successfully',
  });
};

// change my password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // check fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }
    // check confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }
    // check if the new password the same old password
    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: 'New password cannot be the same as old password',
      });
    }
    // get user with password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Old password is incorrect',
      });
    }
    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // save new password
    user.password = hashedPassword;
    await user.save();
    res.json({
      message: 'Password changed successfully',
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

const removeProfileImageFile = (profileImage?: string | null) => {
  if (!profileImage) return;

  const normalizedPath = profileImage.replace(/^\//, '');
  const filePath = path.join(process.cwd(), normalizedPath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: 'No image uploaded',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    removeProfileImageFile(user.profileImage);

    const profileImage = `/uploads/profiles/${file.filename}`;
    user.profileImage = profileImage;
    await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      user: updatedUser,
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

export const deleteProfileImage = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!user.profileImage) {
      return res.status(400).json({
        message: 'No profile image to delete',
      });
    }

    removeProfileImageFile(user.profileImage);
    user.profileImage = undefined;
    await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      message: 'Profile image deleted successfully',
      user: updatedUser,
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
