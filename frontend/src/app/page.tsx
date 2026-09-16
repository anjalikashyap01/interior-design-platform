import {
  Show,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import ClerkBackendTest from "@/components/ClerkBackendTest";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">
        Interior Design Platform
      </h1>

      <Show when="signed-out">
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="rounded-lg border px-5 py-3">
              Sign in
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="rounded-lg bg-black px-5 py-3 text-white">
              Create account
            </button>
          </SignUpButton>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="flex flex-col items-center gap-4">
          <p>You are signed in.</p>

          <UserButton />

          <ClerkBackendTest />
        </div>
      </Show>
    </main>
  );
}