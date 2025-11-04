import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, LayoutGrid, Table as TableIcon } from "lucide-react";
import { StudioKanbanColumn } from "./StudioKanbanColumn";
import { StudioCard } from "./StudioCard";
import { StudioDialog } from "./StudioDialog";
import { useStudios, StudioStatus, Studio } from "@/hooks/useStudios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

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

  const getStatusBadge = (status: StudioStatus) => {
    const variants: Record<StudioStatus, string> = {
      soon: 'secondary',
      contacted: 'default',
      conversation: 'default',
      ghosted: 'destructive',
      dub: 'default'
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
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
        <div className="flex gap-2">
          <Button 
            onClick={() => setViewMode('board')} 
            variant={viewMode === 'board' ? 'default' : 'outline'}
            size="sm"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button 
            onClick={() => setViewMode('table')} 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : viewMode === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Facebook</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No studios found
                  </TableCell>
                </TableRow>
              ) : (
                studios.map((studio) => (
                  <TableRow key={studio.id}>
                    <TableCell className="font-medium">{studio.name}</TableCell>
                    <TableCell>
                      {studio.website ? (
                        <a href={studio.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Link
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {studio.facebook ? (
                        <a href={studio.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Link
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{studio.location || '-'}</TableCell>
                    <TableCell>{getStatusBadge(studio.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
