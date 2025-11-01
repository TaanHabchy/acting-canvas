import { useState } from "react";
import { useMedia } from "@/hooks/useMedia";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const MediaManager = () => {
  const { data: media, isLoading } = useMedia();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    type: "video" as "video" | "photo",
    storage_path: "",
    display_order: 0,
    is_visible: true,
  });

  const resetForm = () => {
    setFormData({
      description: "",
      type: "video",
      storage_path: "",
      display_order: 0,
      is_visible: true,
    });
    setSelectedFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !selectedFile) {
      toast({ 
        title: "Error", 
        description: "Please select a file to upload",
        variant: "destructive" 
      });
      return;
    }
    
    setUploading(true);
    
    try {
      let storagePath = formData.storage_path;
      
      // Upload file if a new one is selected
      if (selectedFile) {
        const bucketName = formData.type === "video" ? "videos" : "photos";
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, selectedFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        
        storagePath = publicUrl;
      }
      
      if (editingId) {
        const { error } = await supabase
          .from("media")
          .update({ ...formData, storage_path: storagePath })
          .eq("id", editingId);
        
        if (error) throw error;
        toast({ title: "Media updated successfully" });
      } else {
        const { error } = await supabase
          .from("media")
          .insert([{ ...formData, storage_path: storagePath }]);
        
        if (error) throw error;
        toast({ title: "Media added successfully" });
      }
      
      queryClient.invalidateQueries({ queryKey: ['media'] });
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      description: item.description || "",
      type: item.type,
      storage_path: item.storage_path,
      display_order: item.display_order,
      is_visible: item.is_visible,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const { error } = await supabase
        .from("media")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast({ title: "Media deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['media'] });
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
          {editingId ? "Edit Media" : "Add New Media"}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: "video" | "photo") => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
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
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            type="file"
            accept={formData.type === "video" ? "video/*" : "image/*"}
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            required={!editingId}
          />
          {editingId && (
            <p className="text-sm text-muted-foreground mt-1">
              Leave empty to keep current file
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => 
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_visible"
            checked={formData.is_visible}
            onChange={(e) => 
              setFormData({ ...formData, is_visible: e.target.checked })
            }
          />
          <Label htmlFor="is_visible">Visible</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : editingId ? "Update" : "Add"} Media
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm} disabled={uploading}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Current Media</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell className="max-w-xs truncate">{item.storage_path}</TableCell>
                <TableCell>{item.display_order}</TableCell>
                <TableCell>{item.is_visible ? "Yes" : "No"}</TableCell>
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

export default MediaManager;
