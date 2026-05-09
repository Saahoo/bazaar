// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/reports/[id] — Admin: update report status and notes
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    const body = await req.json();
    const { status, admin_notes } = body;

    if (!status || !['resolved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be "resolved" or "rejected"' }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {
      status,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    };

    if (admin_notes !== undefined) {
      if (typeof admin_notes !== 'string' || admin_notes.length > 2000) {
        return NextResponse.json({ error: 'Admin notes must be 2000 characters or less' }, { status: 400 });
      }
      updatePayload.admin_notes = admin_notes.trim() || null;
    }

    const { data: report, error: updateError } = await supabase
      .from('reports')
      .update(updatePayload)
      .eq('id', id)
      .select('id, status, admin_notes, resolved_by, resolved_at')
      .single();

    if (updateError) {
      console.error('Report update failed:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (err) {
    console.error('PATCH /api/reports/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
