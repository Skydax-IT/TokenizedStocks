import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

// Basic email validator
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // If keys are missing, simulate success in dev to keep UX smooth.
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      return NextResponse.json(
        { ok: true, simulated: true, message: 'Beehiiv keys not set; simulated success.' },
        { status: 202 }
      );
    }

    const url = `https://api.beehiiv.com/v2/publications/${encodeURIComponent(
      BEEHIIV_PUBLICATION_ID
    )}/subscriptions`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'tokenization-data-hub',
        referring_site: 'Tokenization Data Hub'
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Beehiiv error', detail: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: e?.message }, { status: 500 });
  }
}

