import { ApiError } from "../../utils/api-error";
import { Msg91OtpProvider } from "./providers/msg91.provider";
import { OtpProvider } from "./otp-provider";

const providers: Record<string, OtpProvider> = {
  msg91: new Msg91OtpProvider(),
};

const getOtpProvider = (): OtpProvider => {
  const providerName =
    process.env.OTP_PROVIDER || "msg91";

  const provider = providers[providerName];

  if (!provider) {
    throw new ApiError(
      500,
      `Unsupported OTP provider: ${providerName}`
    );
  }

  return provider;
};

export const sendOtp = async (
  phone: string
) => {
  const provider = getOtpProvider();

  return provider.sendOtp(phone);
};

export const verifyOtp = async (
  phone: string,
  otp: string
) => {
  const provider = getOtpProvider();

  return provider.verifyOtp(phone, otp);
};