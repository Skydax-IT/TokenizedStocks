import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

// Enhanced validation schema with robust email validation
const NewsletterSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine(email => {
      // Basic MX record format check (no external call)
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email);
    }, 'Invalid email format'),
  consent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
  honeypot: z.string().refine(val => val === '', 'Invalid submission'),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req);
    
    // Check rate limiting (stricter for newsletter)
    const rateLimitResult = checkRateLimit(clientIP, { maxRequests: 3, windowMs: 60000 });
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const validationResult = NewsletterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, consent, honeypot, source } = validationResult.data;

    // Check honeypot (anti-spam)
    if (honeypot !== '') {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Check GDPR consent
    if (!consent) {
      return NextResponse.json(
        { error: 'GDPR consent is required' },
        { status: 400 }
      );
    }

    // If keys are missing, simulate success in dev to keep UX smooth
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.warn('Beehiiv API keys not configured - simulating success');
      return NextResponse.json(
        { 
          ok: true, 
          simulated: true, 
          message: 'Newsletter subscription successful (simulated - API keys not configured)',
          email,
          timestamp: new Date().toISOString()
        },
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
        utm_source: source || 'tokenized-stocks-dashboard',
        utm_medium: 'web',
        utm_campaign: 'newsletter-signup',
        referring_site: 'Tokenized Stocks Dashboard',
        custom_fields: {
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
          source: source || 'dashboard'
        }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Beehiiv API error:', res.status, errorText);
      
      // Handle specific error cases
      if (res.status === 409) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Newsletter service temporarily unavailable',
          detail: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { status: 502 }
      );
    }

    const result = await res.json();
    
    return NextResponse.json({
      ok: true,
      message: 'Successfully subscribed to newsletter',
      email,
      timestamp: new Date().toISOString(),
      beehiiv_id: result.id
    }, { status: 200 });

  } catch (e: any) {
    console.error('Newsletter API error:', e);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        detail: process.env.NODE_ENV === 'development' ? e?.message : undefined
      },
      { status: 500 }
    );
  }
}

