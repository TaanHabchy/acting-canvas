import { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ExperienceManager = () => {
  const { data: experiences, isLoading } = useExperience();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    studio: "",
    director: "",
    role: "",
    type: "short_film" as "film" | "short_film" | "tv" | "commercial" | "theatre" | "training" | "skill",
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      studio: "",
      director: "",
      role: "",
      type: "short_film",
      display_order: 0,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from("experience")
          .update(formData)
          .eq("id", editingId);
        
        if (error) throw error;
        toast({ title: "Experience updated successfully" });
      } else {
        const { error } = await supabase
          .from("experience")
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Experience added successfully" });
      }
      
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      studio: item.studio || "",
      director: item.director || "",
      role: item.role || "",
      type: item.type,
      display_order: item.display_order,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast({ title: "Experience deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold">
          {editingId ? "Edit Experience" : "Add New Experience"}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="film">Film</SelectItem>
                <SelectItem value="short_film">Short Film</SelectItem>
                <SelectItem value="tv">TV</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="theatre">Theatre</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="skill">Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => 
                setFormData({ ...formData, display_order: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => 
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studio">Studio</Label>
            <Input
              id="studio"
              value={formData.studio}
              onChange={(e) => 
                setFormData({ ...formData, studio: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              value={formData.director}
              onChange={(e) => 
                setFormData({ ...formData, director: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => 
              setFormData({ ...formData, role: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {editingId ? "Update" : "Add"} Experience
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Current Experience</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Studio</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.type.replace('_', ' ')}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.studio}</TableCell>
                <TableCell>{item.director}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.display_order}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExperienceManager;
