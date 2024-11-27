import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log('The course id unpublished', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
