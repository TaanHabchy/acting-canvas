import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonCard } from "./PersonCard";
import { Person, OutreachStatus } from "@/hooks/usePeople";

interface KanbanColumnProps {
  title: string;
  status: OutreachStatus;
  people: Person[];
  count: number;
}

export const KanbanColumn = ({ title, status, people, count }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card className={`flex flex-col h-full transition-colors ${isOver ? 'bg-accent/50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{title}</span>
          <Badge variant="secondary" className="ml-2">
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent 
        ref={setNodeRef}
        className="flex-1 space-y-2 overflow-y-auto min-h-[200px]"
      >
        <SortableContext 
          items={people.map(p => p.id)} 
          strategy={verticalListSortingStrategy}
        >
          {people.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              No people in this stage
            </div>
          ) : (
            people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
};
