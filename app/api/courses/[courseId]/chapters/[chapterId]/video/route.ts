import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = params;

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

    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${courseId}-${chapterId}-${Date.now()}.mp4`;

    // Store the video file in the database
    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        videoUrl: filename,
        muxData: {
          create: {
            assetId: buffer.toString('base64'),
          },
        },
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTER_VIDEO_UPLOAD]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
