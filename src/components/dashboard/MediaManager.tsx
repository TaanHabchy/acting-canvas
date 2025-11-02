import { useState } from "react";
import { useMedia, Media } from "@/hooks/useMedia";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const MediaManager = () => {
  const [mediaType, setMediaType] = useState<'video' | 'photo' | undefined>(undefined);
  const { data: media, isLoading } = useMedia(mediaType);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedMedia, setReorderedMedia] = useState<Media[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: "photo" as "video" | "photo",
    storage_path: "",
    display_order: 0,
    is_visible: true,
  });

  const resetForm = () => {
    setFormData({
      type: "photo",
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

  const startReordering = () => {
    setIsReordering(true);
    setReorderedMedia([...(media || [])]);
  };

  const cancelReordering = () => {
    setIsReordering(false);
    setReorderedMedia([]);
  };

  const saveReordering = async () => {
    try {
      // Update display_order for all items
      const updates = reorderedMedia.map(async (item, index) => {
        const { error } = await supabase
            .from("media")
            .update({ display_order: index })
            .eq("id", item.id)
            .eq("type", item.type);

        if (error) throw error;
      });

      await Promise.all(updates);

      toast({ title: "Order updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setIsReordering(false);
      setReorderedMedia([]);


    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMedia = [...reorderedMedia];
    const draggedItem = newMedia[draggedIndex];
    newMedia.splice(draggedIndex, 1);
    newMedia.splice(index, 0, draggedItem);
    
    setReorderedMedia(newMedia);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const displayMedia = isReordering ? reorderedMedia : media;

  if (isLoading) return <p>Loading...</p>;

  const renderMediaTable = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Current Media</h3>
        {!isReordering ? (
          <Button onClick={startReordering} variant="outline">
            Reorder Media
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={saveReordering}>
              Save Changes
            </Button>
            <Button onClick={cancelReordering} variant="outline">
              Cancel
            </Button>
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {isReordering && <TableHead className="w-12"></TableHead>}
            <TableHead>Preview</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Visible</TableHead>
            {!isReordering && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayMedia?.map((item, index) => (
            <TableRow 
              key={item.id}
              draggable={isReordering}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={isReordering ? "cursor-move" : ""}
            >
              {isReordering && (
                <TableCell>
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </TableCell>
              )}
              <TableCell>
                {item.type === "photo" ? (
                  <img 
                    src={item.storage_path} 
                    alt="Media preview" 
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <video 
                    src={item.storage_path} 
                    className="w-12 h-12 object-cover rounded"
                    muted
                  />
                )}
              </TableCell>
              <TableCell className="capitalize">{item.type}</TableCell>
              <TableCell>{isReordering ? index : item.display_order}</TableCell>
              <TableCell>{item.is_visible ? "Yes" : "No"}</TableCell>
              {!isReordering && (
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
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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
              onValueChange={(value: "photo" | "video") =>
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
            className={'cursor-pointer'}
          />
          {editingId && (
            <p className="text-sm text-muted-foreground mt-1">
              Leave empty to keep current file
            </p>
          )}
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

      <Tabs defaultValue="all" onValueChange={(value) => {
        if (value === "all") setMediaType(undefined);
        else if (value === "video") setMediaType("video");
        else if (value === "photo") setMediaType("photo");
        setIsReordering(false);
      }}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="photo">Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {renderMediaTable()}
        </TabsContent>
        
        <TabsContent value="video">
          {renderMediaTable()}
        </TabsContent>
        
        <TabsContent value="photo">
          {renderMediaTable()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManager;
