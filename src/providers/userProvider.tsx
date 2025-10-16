"use client";

export default function UserProvider({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
