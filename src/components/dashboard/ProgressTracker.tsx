import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, LayoutGrid, Table as TableIcon } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { PersonCard } from "./PersonCard";
import { PersonDialog } from "./PersonDialog";
import { usePeople, OutreachStatus, Person } from "@/hooks/usePeople";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    const newStatus = over.id as string;
    
    // Validate that we're dropping on a valid status column
    const validStatuses = ['soon', 'contacted', 'conversation', 'ghosted', 'dub'];
    if (!validStatuses.includes(newStatus)) {
      setActivePerson(null);
      return;
    }
    
    const person = people.find(p => p.id === personId);
    if (person && person.status !== newStatus) {
      updateStatus.mutate({ id: personId, status: newStatus as OutreachStatus });
    }
    
    setActivePerson(null);
  };

  const getPeopleByStatus = (status: OutreachStatus) => {
    return people.filter(p => p.status === status);
  };

  const getStatusBadge = (status: OutreachStatus) => {
    const variants: Record<OutreachStatus, string> = {
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
          <PersonDialog />
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

      {editingPerson && (
        <PersonDialog 
          person={editingPerson}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingPerson(null);
          }}
        />
      )}

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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>LinkedIn</TableHead>
                <TableHead>Facebook</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No people found
                  </TableCell>
                </TableRow>
              ) : (
                people.map((person) => (
                  <TableRow 
                    key={person.id} 
                    className="cursor-pointer"
                    onClick={() => setEditingPerson(person)}
                  >
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.email || '-'}</TableCell>
                    <TableCell>{person.phone || '-'}</TableCell>
                    <TableCell>
                      {person.linkedin ? (
                        <a 
                          href={person.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Link
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {person.facebook ? (
                        <a 
                          href={person.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Link
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{person.location || '-'}</TableCell>
                    <TableCell>{person.tags || '-'}</TableCell>
                    <TableCell>{getStatusBadge(person.status)}</TableCell>
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
