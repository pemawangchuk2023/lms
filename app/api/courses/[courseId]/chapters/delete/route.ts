import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized: User not authenticated', {
        status: 401,
      });
    }

    const { id: chapterId } = await req.json();

    if (!chapterId) {
      return new NextResponse('Invalid input: Chapter ID is required', {
        status: 400,
      });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: params.courseId,
        course: {
          userId: userId,
        },
      },
    });

    if (!chapter) {
      return new NextResponse('Unauthorized or Chapter not found', {
        status: 401,
      });
    }

    await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    return new NextResponse('Chapter deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
