import { NextRequest, NextResponse } from "next/server";
import {
  canImportLocalTasks,
  deleteTasks,
  listTasks,
  parseDate,
  parseTask,
  upsertTasks,
} from "@/lib/server/tasks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  const clientError = message.includes("invalid") || message.includes("must be");
  return NextResponse.json(
    { error: clientError ? message : "Unexpected server error" },
    { status: clientError ? 400 : 500 },
  );
}

export async function GET(request: NextRequest) {
  try {
    const from = parseDate(request.nextUrl.searchParams.get("from"), "from");
    const to = parseDate(request.nextUrl.searchParams.get("to"), "to");
    if (from > to) return NextResponse.json({ error: "from must not be after to" }, { status: 400 });
    return NextResponse.json({ tasks: listTasks(from, to), canImportLocal: canImportLocalTasks() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { tasks?: unknown };
    if (!Array.isArray(body.tasks) || body.tasks.length > 2000) {
      return NextResponse.json({ error: "tasks must be an array with at most 2000 items" }, { status: 400 });
    }
    const tasks = body.tasks.map(parseTask);
    upsertTasks(tasks);
    return NextResponse.json({ saved: tasks.length });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as { ids?: unknown };
    if (
      !Array.isArray(body.ids) ||
      body.ids.length > 2000 ||
      body.ids.some((id) => typeof id !== "string" || !id || id.length > 100)
    ) {
      return NextResponse.json({ error: "ids must be a valid array" }, { status: 400 });
    }
    deleteTasks(body.ids as string[]);
    return NextResponse.json({ deleted: body.ids.length });
  } catch (error) {
    return errorResponse(error);
  }
}
