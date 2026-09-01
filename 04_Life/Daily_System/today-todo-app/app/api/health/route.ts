import { NextResponse } from "next/server";
import { checkDatabase } from "@/lib/server/tasks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    if (!checkDatabase()) throw new Error("SQLite quick_check failed");
    return NextResponse.json({ status: "ok", storage: "sqlite" });
  } catch {
    return NextResponse.json({ status: "error", storage: "sqlite" }, { status: 503 });
  }
}
