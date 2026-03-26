import { NextResponse } from "next/server";

// Check if user has a specific permission
export function requirePermission(user: any, permission: string) {
  const hasPermission = user.permissions?.some(
    (p: any) => p.permission === permission,
  );

  if (!hasPermission) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

// permission check (boolean)
export function hasPermission(user: any, permission: string) {
  return user.permissions?.some((p: any) => p.permission === permission);
}
