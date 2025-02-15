import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data["Global Quote"]) {
      return NextResponse.json(data["Global Quote"], { status: 200 });
    } else {
      return NextResponse.json({ error: "Unable to fetch stock data" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error fetching stock data" }, { status: 500 });
  }
}