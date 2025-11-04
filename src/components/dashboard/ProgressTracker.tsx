import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { PersonCard } from "./PersonCard";
import { PersonDialog } from "./PersonDialog";
import { usePeople, OutreachStatus, Person } from "@/hooks/usePeople";

const COLUMNS: { status: OutreachStatus; title: string }[] = [
  { status: 'soon', title: 'Soon' },
  { status: 'contacted', title: 'Contacted' },
  { status: 'conversation', title: 'Conversation' },
  { status: 'ghosted', title: 'Ghosted' },
  { status: 'dub', title: 'Dub' },
];

const ProgressTracker = () => {
  const { data: people = [], isLoading, refetch, updateStatus } = usePeople();
  const [activePerson, setActivePerson] = useState<Person | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const person = people.find(p => p.id === event.active.id);
    setActivePerson(person || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActivePerson(null);
      return;
    }

    const personId = active.id as string;
    const newStatus = over.id as OutreachStatus;
    
    const person = people.find(p => p.id === personId);
    if (person && person.status !== newStatus) {
      updateStatus.mutate({ id: personId, status: newStatus });
    }
    
    setActivePerson(null);
  };

  const getPeopleByStatus = (status: OutreachStatus) => {
    return people.filter(p => p.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <PersonDialog />
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {COLUMNS.map((column) => {
              const columnPeople = getPeopleByStatus(column.status);
              return (
                <KanbanColumn
                  key={column.status}
                  title={column.title}
                  status={column.status}
                  people={columnPeople}
                  count={columnPeople.length}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activePerson ? <PersonCard person={activePerson} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default ProgressTracker;
