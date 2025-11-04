import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Mail, Phone, Star, Pencil } from "lucide-react";
import { Person } from "@/hooks/usePeople";
import { PersonDialog } from "./PersonDialog";

interface PersonCardProps {
  person: Person;
}

export const PersonCard = ({ person }: PersonCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: person.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className="group hover:shadow-md transition-shadow w-full"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-1"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {person.name}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PersonDialog
                  person={person} 
                  trigger={
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              {person.email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{person.email}</span>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{person.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
