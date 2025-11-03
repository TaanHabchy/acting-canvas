import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil } from "lucide-react";
import { Person, OutreachStatus } from "@/hooks/usePeople";

interface PersonDialogProps {
  person?: Person;
  trigger?: React.ReactNode;
}

export const PersonDialog = ({ person, trigger }: PersonDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    notes: "",
    outreach_status: "soon" as OutreachStatus,
    rating: 0,
    is_visible: true,
  });

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        company: person.company || "",
        position: person.position || "",
        email: person.email || "",
        phone: person.phone || "",
        notes: person.notes || "",
        outreach_status: person.outreach_status,
        rating: person.rating || 0,
        is_visible: person.is_visible,
      });
    }
  }, [person, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      position: "",
      email: "",
      phone: "",
      notes: "",
      outreach_status: "soon",
      rating: 0,
      is_visible: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (person) {
        const { error } = await supabase
          .from("people")
          .update(formData)
          .eq("id", person.id);

        if (error) throw error;
        toast({ title: "Person updated successfully" });
      } else {
        const { error } = await supabase
          .from("people")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Person added successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ['people'] });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{person ? "Edit Person" : "Add New Person"}</DialogTitle>
          <DialogDescription>
            {person ? "Update person details" : "Add a new person to track outreach"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Outreach Status</Label>
              <Select
                value={formData.outreach_status}
                onValueChange={(value: OutreachStatus) =>
                  setFormData({ ...formData, outreach_status: value })
                }
              >
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

            <div>
              <Label htmlFor="rating">Rating (0-10)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
            />
            <Label htmlFor="is_visible">Visible</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : person ? "Update" : "Add"} Person
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
