import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = process.env.DISCOGS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing Discogs token" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.discogs.com/releases/${id}?token=${token}`,
    {
      headers: {
        "User-Agent": "som-vinyl/1.0",
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch release" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}