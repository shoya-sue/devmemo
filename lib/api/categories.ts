import { Category } from '@/types/post';
import { prisma } from '@/lib/prisma';

export async function getCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function createCategory(name: string): Promise<Category> {
  return await prisma.category.create({
    data: {
      name
    }
  });
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to update category');
  }
  return response.json();
}

export async function deleteCategory(id: number): Promise<Category> {
  return await prisma.category.delete({
    where: {
      id
    }
  });
} 