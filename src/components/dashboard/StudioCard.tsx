import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Facebook, Pencil } from "lucide-react";
import { Studio } from "@/hooks/useStudios";
import { StudioDialog } from "./StudioDialog";
import { useState } from "react";

interface StudioCardProps {
  studio: Studio;
}

export const StudioCard = ({ studio }: StudioCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: studio.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <Card 
        ref={setNodeRef} 
        style={style}
        className="cursor-move hover:shadow-md transition-shadow group"
        {...attributes}
        {...listeners}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-semibold">{studio.name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {studio.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{studio.location}</span>
            </div>
          )}
          {studio.website && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="truncate">{studio.website}</span>
            </div>
          )}
          {studio.facebook && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Facebook className="h-3 w-3" />
              <span className="truncate">{studio.facebook}</span>
            </div>
          )}
        </CardContent>
      </Card>
      <StudioDialog studio={studio} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  );
};
