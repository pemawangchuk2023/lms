import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { updates }: { updates: { id: string; position: number }[] } =
      await req.json();

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatePromises = updates.map((update) =>
      db.chapter.update({
        where: { id: update.id },
        data: { position: update.position },
      })
    );
    await Promise.all(updatePromises);

    return new NextResponse('Reorder successful', { status: 200 });
  } catch (error) {
    console.error('Error during reordering:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
