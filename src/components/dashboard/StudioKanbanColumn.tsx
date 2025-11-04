import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudioCard } from "./StudioCard";
import { Studio, StudioStatus } from "@/hooks/useStudios";

interface StudioKanbanColumnProps {
  title: string;
  status: StudioStatus;
  studios: Studio[];
  count: number;
}

export const StudioKanbanColumn = ({ title, status, studios, count }: StudioKanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card className={`transition-colors ${isOver ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant="secondary">{count}</Badge>
        </div>
      </CardHeader>
      <CardContent ref={setNodeRef} className="space-y-2 min-h-[200px]">
        <SortableContext items={studios.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {studios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
};
