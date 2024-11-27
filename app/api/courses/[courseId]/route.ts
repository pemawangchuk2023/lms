import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: values,
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    if (!userId) {
      console.error('Unauthorized: No user ID found.');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the course exists and is owned by the user
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      console.error('Course not found or not owned by the user.');
      return new NextResponse('Course not found', { status: 404 });
    }

    // Delete associated chapters and their Mux assets
    const chapters = await db.chapter.findMany({
      where: {
        courseId,
      },
    });

    for (const chapter of chapters) {
      if (chapter.videoUrl) {
        const muxData = await db.muxData.findFirst({
          where: {
            chapterId: chapter.id,
          },
        });

        if (muxData) {
          try {
            await muxClient.video.assets.delete(muxData.assetId);
          } catch (muxError) {
            console.error('Failed to delete Mux asset:', muxError);
          }

          await db.muxData.delete({
            where: {
              id: muxData.id,
            },
          });
        }
      }

      await db.chapter.delete({
        where: {
          id: chapter.id,
        },
      });
    }

    // Finally, delete the course
    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error: any) {
    console.error('Error during course deletion:', error.message || error);
    return new NextResponse(
      `Internal Error: ${error.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}
