import User, { type IUser } from "../models/User";

interface SyncUserInput {
  clerkUserId: string;
  name?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
}

export async function findOrCreateUser(
  input: SyncUserInput
): Promise<IUser> {
  const existingUser = await User.findOne({
    clerkUserId: input.clerkUserId,
  });

  if (existingUser) {
    existingUser.name = input.name ?? existingUser.name;
    existingUser.email = input.email ?? existingUser.email;
    existingUser.phone = input.phone ?? existingUser.phone;

    if (input.isVerified !== undefined) {
      existingUser.isVerified = input.isVerified;
    }

    await existingUser.save();

    return existingUser;
  }

  const user = await User.create({
    clerkUserId: input.clerkUserId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: "customer",
    status: "active",
    isActive: true,
    isVerified: input.isVerified ?? false,
  });

  return user;
}