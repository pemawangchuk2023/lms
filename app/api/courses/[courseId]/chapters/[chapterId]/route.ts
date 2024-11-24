import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title } = await req.json();
    if (!title || title.trim().length === 0) {
      return new NextResponse('Invalid input: Title is required', {
        status: 400,
      });
    }

    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized: You do not own this course', {
        status: 401,
      });
    }
    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
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

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized: You do not own this course', {
        status: 401,
      });
    }
    await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    return new NextResponse('Chapter deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
