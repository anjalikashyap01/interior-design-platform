import {
  Response,
} from "express";

import User from "../models/User";
import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import {
  sendOtp,
  verifyOtp,
} from "../services/otp/otp.service";
import {
  generateCustomerToken,
} from "../utils/jwt";
import {
  sendSuccess,
} from "../utils/api-response";
import {
  ApiError,
} from "../utils/api-error";
import {
  normalizeIndianPhone,
} from "../utils/phone";

export const sendOtpController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const phone =normalizeIndianPhone(req.body.phone);

  const result = await sendOtp(phone);

  if (!result.success) {
    throw new ApiError(
      400,
      result.message || "Unable to send OTP"
    );
  }

  sendSuccess(res, {
    statusCode: 200,
    message: "OTP sent successfully",
  });
};

export const verifyOtpController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const phone =
  normalizeIndianPhone(req.body.phone);
  const { otp } = req.body;

  const result = await verifyOtp(
    phone,
    otp
  );

  if (!result.success) {
    throw new ApiError(
      401,
      result.message || "Invalid OTP"
    );
  }

  let user = await User.findOne({
    phone,
  });

  if (!user) {
    user = await User.create({
      phone,
      isVerified: true,
    });
  } else if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  const token =
    generateCustomerToken(
      user._id.toString()
    );

  sendSuccess(res, {
    statusCode: 200,
    message: "OTP verified successfully",
    data: {
      token,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    },
  });
};

export const getMeController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  sendSuccess(res, {
    message: "User fetched successfully",
    data: {
      user: req.user,
    },
  });
};

export const logoutController = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  sendSuccess(res, {
    message: "Logged out successfully",
  });
};