// src/app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_REASONS = ['spam', 'fraud_scam', 'duplicate_listing', 'wrong_category', 'prohibited_item', 'offensive_content', 'other'];

// POST /api/reports — Submit a new report
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { listing_id, reason, description } = body;

    if (!listing_id || !reason) {
      return NextResponse.json({ error: 'listing_id and reason are required' }, { status: 400 });
    }

    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: 'Invalid reason' }, { status: 400 });
    }

    if (description && typeof description === 'string' && description.length > 1000) {
      return NextResponse.json({ error: 'Description must be 1000 characters or less' }, { status: 400 });
    }

    // Check for duplicate report from same user on same listing
    const { data: existing } = await supabase
      .from('reports')
      .select('id')
      .eq('reported_by', user.id)
      .eq('listing_id', listing_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'You have already reported this listing' }, { status: 409 });
    }

    // Verify the listing exists
    const { data: listing } = await supabase
      .from('listings')
      .select('id')
      .eq('id', listing_id)
      .maybeSingle();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const { data: report, error: insertError } = await supabase
      .from('reports')
      .insert({
        reported_by: user.id,
        listing_id,
        reason,
        description: description?.trim() || null,
        status: 'pending',
      })
      .select('id, created_at')
      .single();

    if (insertError) {
      console.error('Report insert failed:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ report }, { status: 201 });
  } catch (err) {
    console.error('POST /api/reports error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/reports — Admin: list all reports with optional status filter
export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('reports')
      .select(`
        id,
        reason,
        description,
        status,
        admin_notes,
        resolved_by,
        resolved_at,
        created_at,
        reported_by,
        listing_id,
        profiles!reports_reported_by_fkey(display_name),
        listings(title, id)
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    if (status && ['pending', 'resolved', 'rejected'].includes(status)) {
      query = query.eq('status', status);
    }

    const { data: reports, error } = await query;

    if (error) {
      console.error('Reports fetch failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalize the response
    const normalized = (reports || []).map((row: Record<string, unknown>) => {
      const reporter = row.profiles as { display_name: string | null } | { display_name: string | null }[] | null;
      const reporterProfile = Array.isArray(reporter) ? reporter[0] || null : reporter;

      const listing = row.listings as { title: string; id: string } | { title: string; id: string }[] | null;
      const listingData = Array.isArray(listing) ? listing[0] || null : listing;

      return {
        id: row.id,
        reason: row.reason,
        description: row.description,
        status: row.status,
        admin_notes: row.admin_notes,
        resolved_by: row.resolved_by,
        resolved_at: row.resolved_at,
        created_at: row.created_at,
        reported_by: row.reported_by,
        listing_id: row.listing_id,
        reporter_name: reporterProfile?.display_name || 'Unknown',
        listing_title: listingData?.title || 'Unknown Listing',
      };
    });

    return NextResponse.json({ reports: normalized });
  } catch (err) {
    console.error('GET /api/reports error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
