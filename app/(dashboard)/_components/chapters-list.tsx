import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Grid, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Chapter } from '@prisma/client';

interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (
    updateData: { id: string; position: number }[],
    updatedChapters: Chapter[]
  ) => void;
  courseId: string;
}

const ChaptersList = ({
  items,
  onEdit,
  onDelete,
  onReorder,
  courseId,
}: ChaptersListProps) => {
  const [chapters, setChapters] = useState<Chapter[]>(items);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedChapters = Array.from(chapters);
    const [reorderedItem] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, reorderedItem);

    setChapters(updatedChapters);

    if (onReorder) {
      const updateData = updatedChapters.map((chapter, index) => ({
        id: chapter.id,
        position: index,
      }));
      onReorder(updateData, updatedChapters);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chapters'>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='space-y-4 mt-4'
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'flex items-center gap-x-2 bg-white border rounded-lg text-sm',
                      'hover:shadow-md transition-all duration-200'
                    )}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className={cn(
                        'px-2 py-3 border-r hover:bg-slate-100 rounded-l-lg transition',
                        'cursor-grab'
                      )}
                    >
                      <Grid className='h-5 w-5 text-slate-500' />
                    </div>
                    <div className='flex-1 px-4'>
                      <Link
                        href={`/teacher/courses/${courseId}/chapters/${chapter.id}`}
                        className='font-medium text-slate-700 hover:underline'
                      >
                        {chapter.title}
                      </Link>
                    </div>
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          'bg-slate-500',
                          chapter.isPublished && 'bg-green-500'
                        )}
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className='ml-auto pr-2 flex items-center'>
                      <Button
                        variant='ghost'
                        className='h-auto p-2 hover:bg-slate-100'
                        onClick={() => onEdit(chapter.id)}
                      >
                        <Pencil className='h-4 w-4 text-slate-600' />
                      </Button>
                      <Button
                        variant='ghost'
                        className='h-auto p-2 hover:bg-slate-100'
                        onClick={() => onDelete(chapter.id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;
