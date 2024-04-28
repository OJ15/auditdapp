import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  try {
    let url = `${process.env.AUDIT_SRV}/token/live/${address}`;

    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (error) {
    if (error) {
      return NextResponse.json(error, { status: 404 });
    } else {
      return NextResponse.error();
    }
  }
}
