import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "categories.json");

export async function GET() {
  try {
    const data = readFileSync(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
