export interface SendOtpResult {
  success: boolean;
  message?: string;
  requestId?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message?: string;
}

export interface OtpProvider {
  sendOtp(phone: string): Promise<SendOtpResult>;

  verifyOtp(
    phone: string,
    otp: string
  ): Promise<VerifyOtpResult>;
}