import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Studio, StudioStatus } from "@/hooks/useStudios";

interface StudioDialogProps {
  studio?: Studio;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const StudioDialog = ({ studio, open, onOpenChange }: StudioDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(studio?.name || "");
  const [website, setWebsite] = useState(studio?.website || "");
  const [facebook, setFacebook] = useState(studio?.facebook || "");
  const [location, setLocation] = useState(studio?.location || "");
  const [status, setStatus] = useState<StudioStatus>(studio?.status || "soon");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (studio) {
        const { error } = await supabase
          .from('studios')
          .update({
            name,
            website: website || null,
            facebook: facebook || null,
            location: location || null,
            status,
          })
          .eq('id', studio.id);

        if (error) throw error;

        toast({
          title: "Studio updated",
          description: "Studio has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('studios')
          .insert({
            name,
            website: website || null,
            facebook: facebook || null,
            location: location || null,
            status,
          });

        if (error) throw error;

        toast({
          title: "Studio added",
          description: "Studio has been added successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['studios'] });
      setDialogOpen(false);
      
      if (!studio) {
        setName("");
        setWebsite("");
        setFacebook("");
        setLocation("");
        setStatus("soon");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{studio ? "Edit Studio" : "Add New Studio"}</DialogTitle>
          <DialogDescription>
            {studio ? "Update studio information" : "Add a new studio to track"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Studio name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Facebook profile or page"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as StudioStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soon">Soon</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="conversation">Conversation</SelectItem>
                <SelectItem value="ghosted">Ghosted</SelectItem>
                <SelectItem value="dub">Dub</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {studio ? "Update Studio" : "Add Studio"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (studio) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Studio
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};
