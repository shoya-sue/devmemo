import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const tag = await prisma.tag.create({
      data: { name },
    });
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.tag.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
} 