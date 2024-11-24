// app/api/courses/[courseId]/attachments/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find course and verify ownership
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Get the attachment data from request body
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    // Create the attachment
    const attachment = await db.attachement.create({
      data: {
        name: url.split('/').pop() || 'unnamed',
        url,
        courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENTS]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Add DELETE endpoint for removing attachments
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const { searchParams } = new URL(req.url);
    const attachmentId = searchParams.get('attachmentId');

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!attachmentId) {
      return new NextResponse('Attachment ID is required', { status: 400 });
    }

    // Find course and verify ownership
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Delete the attachment
    const attachment = await db.attachement.deleteMany({
      where: {
        id: attachmentId,
        courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
