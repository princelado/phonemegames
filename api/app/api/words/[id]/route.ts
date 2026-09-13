import { NextResponse } from "next/server";

import { deleteWord, getWord, updateWord } from "@/lib/data";
import { validateWordPayload } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid word id." }, { status: 400 });

  const word = await getWord(id);
  if (!word) return NextResponse.json({ error: "Word not found." }, { status: 404 });
  return NextResponse.json({ word });
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ error: "Invalid word id." }, { status: 400 });

    const validation = validateWordPayload(await request.json());
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const word = await updateWord(id, validation.value);
    if (!word) return NextResponse.json({ error: "Word not found." }, { status: 404 });
    return NextResponse.json({ word });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json({ error: "That English word already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to update word." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid word id." }, { status: 400 });

  const deleted = await deleteWord(id);
  if (!deleted) return NextResponse.json({ error: "Word not found." }, { status: 404 });
  return NextResponse.json({ message: "Word deleted." });
}
