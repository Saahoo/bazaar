import { NextResponse } from 'next/server';
import { createClient as createSupabase } from '@supabase/supabase-js';
import { validateMetadata } from '@/lib/validators/listing';
import { normalizeKeysToCamel } from '@/lib/utils/normalizeKeys';

export async function POST(req: Request) {
  try {
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

    if (!user_id || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalized = normalizeKeysToCamel(metadata || {});
    const validation = validateMetadata(Number(category_id), normalized);
    if (!validation.ok) {
      return NextResponse.json({ error: 'Invalid metadata', details: validation.errors }, { status: 400 });
    }

    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('API Debug - supabaseUrl:', supabaseUrl ? 'Set' : 'Not set');
    console.log('API Debug - serviceRoleKey:', serviceRoleKey ? `Set (length: ${serviceRoleKey.length})` : 'Not set');
    
    if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your-service-role-key') {
      console.error('Supabase environment variables not properly configured');
      console.error('supabaseUrl:', supabaseUrl);
      console.error('serviceRoleKey:', serviceRoleKey);
      return NextResponse.json({
        error: 'Server configuration error: Supabase service role key not set',
        details: 'Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables',
        debug: {
          supabaseUrlSet: !!supabaseUrl,
          serviceRoleKeySet: !!serviceRoleKey,
          isPlaceholder: serviceRoleKey === 'your-service-role-key'
        }
      }, { status: 500 });
    }

    const supabase = createSupabase(supabaseUrl, serviceRoleKey);

    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        user_id,
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

    if (listing && photos.length > 0) {
      const photoRows = photos.map((p: unknown, i: number) => {
        if (typeof p === 'string') {
          return { listing_id: listing.id, photo_url: p, display_order: i, uploaded_by: user_id };
        }
        const obj = p as Record<string, unknown>;
        return { listing_id: listing.id, photo_url: (obj.url as string) || (obj.photo_url as string) || '', display_order: i, uploaded_by: user_id };
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
      if ('message' in err) {
        errorMessage = String((err as any).message);
      }
      if ('stack' in err) {
        errorDetails = String((err as any).stack);
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
