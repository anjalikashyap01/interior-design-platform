import env from "../../../config/env";
import {
  OtpProvider,
  SendOtpResult,
  VerifyOtpResult,
} from "../otp-provider";

export class Msg91OtpProvider implements OtpProvider {
  async sendOtp(phone: string): Promise<SendOtpResult> {
    if (!env.otp.msg91AuthKey) {
      throw new Error(
        "MSG91_AUTH_KEY is not configured"
      );
    }

    

    return {
      success: true,
      message: `OTP request prepared for ${phone}`,
    };
  }

  async verifyOtp(
    phone: string,
    otp: string
  ): Promise<VerifyOtpResult> {
    if (!env.otp.msg91AuthKey) {
      throw new Error(
        "MSG91_AUTH_KEY is not configured"
      );
    }


    return {
      success: true,
      message: `OTP verification prepared for ${phone}`,
    };
  }
}