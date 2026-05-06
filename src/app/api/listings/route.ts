import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateMetadata } from '@/lib/validators/listing';
import { normalizeKeysToCamel } from '@/lib/utils/normalizeKeys';

export async function POST(req: Request) {
  try {
    // 1. Create authenticated Supabase client using the user's session cookies
    const supabase = await createClient();

    // 2. Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', details: 'You must be logged in to create a listing' },
        { status: 401 }
      );
    }

    // 3. Parse request body
    const body = await req.json();

    const {
      user_id,
      category_id,
      title,
      description,
      price,
      currency,
      condition,
      city,
      phone_visible,
      from_owner,
      metadata,
      photos = [],
    } = body;

    // 4. Use the authenticated user's ID instead of trusting the client-sent value
    // This prevents users from creating listings under another user's identity
    const authenticatedUserId = user.id;

    if (user_id && user_id !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'User ID mismatch', details: 'The provided user_id does not match the authenticated user' },
        { status: 403 }
      );
    }

    if (!category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Debug: log Animals & Livestock metadata
    if (Number(category_id) === 10) {
      console.log('[API /api/listings] Animals category - raw metadata:', JSON.stringify(metadata, null, 2));
    }

    const normalized = normalizeKeysToCamel(metadata || {});
    
    // Debug: log normalized Animals metadata
    if (Number(category_id) === 10) {
      console.log('[API /api/listings] Animals category - normalized metadata:', JSON.stringify(normalized, null, 2));
    }
    
    const validation = validateMetadata(Number(category_id), normalized);
    if (!validation.ok) {
      return NextResponse.json({ error: 'Invalid metadata', details: validation.errors }, { status: 400 });
    }

    // 5. Insert listing using the authenticated client (respects RLS policies)
    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        user_id: authenticatedUserId,
        category_id,
        title,
        description,
        price,
        currency,
        condition,
        city,
        phone_visible: phone_visible ?? true,
        from_owner: from_owner ?? false,
        metadata: normalized,
        status: 'active',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Server listing insert failed:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 6. Insert photos if provided
    if (listing && photos.length > 0) {
      const photoRows = photos.map((p: unknown, i: number) => {
        if (typeof p === 'string') {
          return { listing_id: listing.id, photo_url: p, display_order: i, uploaded_by: authenticatedUserId };
        }
        const obj = p as Record<string, unknown>;
        return { listing_id: listing.id, photo_url: (obj.url as string) || (obj.photo_url as string) || '', display_order: i, uploaded_by: authenticatedUserId };
      });

      const { error: photosError } = await supabase.from('photos').insert(photoRows);
      if (photosError) console.error('Server photos insert failed:', photosError);
    }

    return NextResponse.json({ id: listing.id });
  } catch (err) {
    console.error('Listings API error', err);
    
    // Provide more detailed error information
    let errorMessage = 'Unexpected server error';
    let errorDetails = 'Check server logs for more information';
    
    if (err instanceof Error) {
      errorMessage = err.message;
      errorDetails = err.stack || errorDetails;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err && typeof err === 'object') {
      // Define a type for error-like objects
      interface ErrorLike {
        message?: unknown;
        stack?: unknown;
      }
      
      const errorLike = err as ErrorLike;
      if ('message' in errorLike) {
        errorMessage = String(errorLike.message);
      }
      if ('stack' in errorLike) {
        errorDetails = String(errorLike.stack);
      }
    }
    
    console.error('API Catch block - error:', errorMessage);
    console.error('API Catch block - details:', errorDetails);
    
    return NextResponse.json({
      error: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
