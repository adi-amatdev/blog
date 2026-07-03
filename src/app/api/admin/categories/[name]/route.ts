import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  try {
    const category = await prisma.category.findUnique({ where: { name } });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const postIds = (await prisma.postCategory.findMany({
      where: { categoryId: category.id },
      select: { postId: true },
    })).map(pc => pc.postId);

    await prisma.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({ where: { categoryId: category.id } });
      if (postIds.length > 0) {
        await tx.post.deleteMany({ where: { id: { in: postIds } } });
      }
      await tx.category.delete({ where: { id: category.id } });
    });

    return NextResponse.json({ deleted: true, postsDeleted: postIds.length });
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
