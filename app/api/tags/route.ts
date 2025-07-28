import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser, requireAdmin } from '@/lib/api/auth';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    await requireAdmin(user?.id);
    
    const supabase = createClient();
    const { name } = await request.json();
    const { data: tag, error } = await supabase
      .from('tags')
      .insert({ name })
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    await requireAdmin(user?.id);
    
    const supabase = createClient();
    const { id } = await request.json();
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
} 