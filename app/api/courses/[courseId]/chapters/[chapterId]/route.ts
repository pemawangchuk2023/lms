import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const values = await req.json();

    console.log('PATCH request received with values:', values);

    if (!userId) {
      console.error('Unauthorized: No user ID found.');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      console.error('Unauthorized: User does not own the course.');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        ...values,
        courseId: params.courseId,
      },
    });

    console.log('Chapter updated successfully:', chapter);

    if (values.videoUrl) {
      console.log('Processing video URL with Mux:', values.videoUrl);

      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        console.log('Deleting existing Mux asset:', existingMuxData.assetId);

        await muxClient.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await muxClient.video.assets.create({
        input: values.videoUrl,
        playback_policy: ['public'],
      });

      if (!asset.playback_ids || asset.playback_ids.length === 0) {
        console.error('Mux asset creation failed: No playback IDs returned.');
        throw new Error('Mux asset creation failed: No playback IDs returned.');
      }

      console.log('Mux asset created successfully:', asset);

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: params.chapterId,
          playbackId: asset.playback_ids[0].id,
        },
      });

      console.log('Mux data saved to database.');
    }

    return NextResponse.json(chapter);
  } catch (error: any) {
    console.error('There was an error:', error.message || error);
    return new NextResponse(
      `Internal Error: ${error.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();

    console.log('DELETE request received for chapterId:', params.chapterId);

    if (!userId) {
      console.error('Unauthorized: No user ID found.');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      console.error(
        'Unauthorized: User does not own the course or course does not exist.'
      );
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the chapter exists
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
      },
    });

    if (!chapter) {
      console.error('Chapter not found with ID:', params.chapterId);
      return new NextResponse('Chapter not found', { status: 404 });
    }

    // Handle Mux asset deletion if Mux data exists
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        try {
          await muxClient.video.assets.delete(existingMuxData.assetId);
        } catch (muxError) {
          console.error('Failed to delete Mux asset:', muxError);
        }

        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });

        console.log('Mux data deleted successfully.');
      }
    }

    // Delete the chapter
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(deletedChapter);
  } catch (error: any) {
    console.error('There was an error:', error.message || error);
    return new NextResponse(
      `Internal Error: ${error.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}
