import { NextResponse } from "next/server";

import { deleteActivity, getActivity, updateActivity } from "@/lib/data";
import { validateActivityPayload } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid activity id." }, { status: 400 });

  const activity = await getActivity(id);
  if (!activity) return NextResponse.json({ error: "Activity not found." }, { status: 404 });
  return NextResponse.json({ activity });
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid activity id." }, { status: 400 });

    const validation = validateActivityPayload(await request.json());
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const activity = await updateActivity(id, validation.value);
    if (!activity) return NextResponse.json({ error: "Activity not found." }, { status: 404 });
    return NextResponse.json({ activity });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update activity.";
    const status = message.includes("do not exist") ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? message : "Unable to update activity." }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid activity id." }, { status: 400 });

  const deleted = await deleteActivity(id);
  if (!deleted) return NextResponse.json({ error: "Activity not found." }, { status: 404 });
  return NextResponse.json({ message: "Activity deleted." });
}
