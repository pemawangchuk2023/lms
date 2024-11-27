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
      return new NextResponse('Unauthorized: User not authenticated', {
        status: 401,
      });
    }

    const { id: chapterId, title } = await req.json();

    if (!chapterId || !title || title.trim().length === 0) {
      return new NextResponse(
        'Invalid input: Chapter ID and Title are required',
        {
          status: 400,
        }
      );
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

    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    console.error('Error updating chapter:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
