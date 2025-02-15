import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ticker } = req.query;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data["Global Quote"]) {
      res.status(200).json(data["Global Quote"]);
    } else {
      res.status(404).json({ error: "Unable to fetch stock data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching stock data" });
  }
}