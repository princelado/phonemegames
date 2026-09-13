import { NextResponse } from "next/server";

import { createWord, listWords } from "@/lib/data";
import { validateWordPayload } from "@/lib/validation";

export async function GET() {
  try {
    return NextResponse.json({ words: await listWords() });
  } catch {
    return NextResponse.json({ error: "Unable to load words." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const validation = validateWordPayload(await request.json());
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const word = await createWord(validation.value);
    return NextResponse.json({ word }, { status: 201 });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json({ error: "That English word already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create word." }, { status: 500 });
  }
}
