import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { StudioKanbanColumn } from "./StudioKanbanColumn";
import { StudioCard } from "./StudioCard";
import { StudioDialog } from "./StudioDialog";
import { useStudios, StudioStatus, Studio } from "@/hooks/useStudios";

const COLUMNS: { status: StudioStatus; title: string }[] = [
  { status: 'soon', title: 'Soon' },
  { status: 'contacted', title: 'Contacted' },
  { status: 'conversation', title: 'Conversation' },
  { status: 'ghosted', title: 'Ghosted' },
  { status: 'dub', title: 'Dub' },
];

const StudiosTracker = () => {
  const { data: studios = [], isLoading, refetch, updateStatus } = useStudios();
  const [activeStudio, setActiveStudio] = useState<Studio | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const studio = studios.find(s => s.id === event.active.id);
    setActiveStudio(studio || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveStudio(null);
      return;
    }

    const studioId = active.id as number;
    const newStatus = over.id as string;
    
    // Validate that we're dropping on a valid status column
    const validStatuses = ['soon', 'contacted', 'conversation', 'ghosted', 'dub'];
    if (!validStatuses.includes(newStatus)) {
      setActiveStudio(null);
      return;
    }
    
    const studio = studios.find(s => s.id === studioId);
    if (studio && studio.status !== newStatus) {
      updateStatus.mutate({ id: studioId, status: newStatus as StudioStatus });
    }
    
    setActiveStudio(null);
  };

  const getStudiosByStatus = (status: StudioStatus) => {
    return studios.filter(s => s.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <StudioDialog />
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
              const columnStudios = getStudiosByStatus(column.status);
              return (
                <StudioKanbanColumn
                  key={column.status}
                  title={column.title}
                  status={column.status}
                  studios={columnStudios}
                  count={columnStudios.length}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeStudio ? <StudioCard studio={activeStudio} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default StudiosTracker;
