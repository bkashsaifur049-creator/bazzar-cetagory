"use client";

import { authClient } from "@/lib/auth-client";
import AuthSkeleton from "./AuthSkeleton";

export default function AuthStatus() {
  const { data: session, isPending } =
    authClient.useSession();

  if (isPending) {
    return <AuthSkeleton />;
  }

  if (!session) {
    return <p>Please login to continue.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">
        Welcome, {session.user.name}
      </h2>

      <p>{session.user.email}</p>
    </div>
  );
}