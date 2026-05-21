import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const token = process.env.DISCOGS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing Discogs token" },
      { status: 500 }
    );
  }

  const url = new URL("https://api.discogs.com/database/search");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "release");
  url.searchParams.set("per_page", "8");
  url.searchParams.set("token", token);

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "som-vinyl/1.0",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to search Discogs" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    results: data.results,
  });
}