import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Edit, Trash2, Search, Users } from "lucide-react";
import { Chama, InsertChama } from "@shared/schema";

export default function Chamas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChama, setEditingChama] = useState<Chama | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<InsertChama>({
    name: "",
    description: "",
    contributionAmount: "",
    meetingSchedule: "",
    createdBy: 0,
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: chamas, isLoading } = useQuery({
    queryKey: ["/api/chamas"],
  });

  const createChamaMutation = useMutation({
    mutationFn: async (data: InsertChama) => {
      const response = await apiRequest("POST", "/api/chamas", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chamas"] });
      toast({
        title: "Success",
        description: "Chama created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create chama",
        variant: "destructive",
      });
    },
  });

  const updateChamaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertChama> }) => {
      const response = await apiRequest("PUT", `/api/chamas/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chamas"] });
      toast({
        title: "Success",
        description: "Chama updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update chama",
        variant: "destructive",
      });
    },
  });

  const deleteChamaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/chamas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chamas"] });
      toast({
        title: "Success",
        description: "Chama deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete chama",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      contributionAmount: "",
      meetingSchedule: "",
      createdBy: user?.id || 0,
    });
    setEditingChama(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, createdBy: user?.id || 0 };
    
    if (editingChama) {
      updateChamaMutation.mutate({ id: editingChama.id, data: dataToSubmit });
    } else {
      createChamaMutation.mutate(dataToSubmit);
    }
  };

  const handleEdit = (chama: Chama) => {
    setEditingChama(chama);
    setFormData({
      name: chama.name,
      description: chama.description || "",
      contributionAmount: chama.contributionAmount,
      meetingSchedule: chama.meetingSchedule || "",
      createdBy: chama.createdBy || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this chama?")) {
      deleteChamaMutation.mutate(id);
    }
  };

  const filteredChamas = chamas?.filter((chama: Chama) =>
    chama.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chama.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chamas</h1>
          <p className="text-gray-600">Manage your savings groups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Chama
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingChama ? "Edit Chama" : "Add New Chama"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Chama Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="contributionAmount">Contribution Amount (KSh)</Label>
                <Input
                  id="contributionAmount"
                  type="number"
                  step="0.01"
                  value={formData.contributionAmount}
                  onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="meetingSchedule">Meeting Schedule</Label>
                <Input
                  id="meetingSchedule"
                  value={formData.meetingSchedule}
                  onChange={(e) => setFormData({ ...formData, meetingSchedule: e.target.value })}
                  placeholder="e.g., Monthly, Weekly"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createChamaMutation.isPending || updateChamaMutation.isPending}>
                  {createChamaMutation.isPending || updateChamaMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search chamas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredChamas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Contribution Amount</TableHead>
                  <TableHead>Meeting Schedule</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChamas.map((chama: Chama) => (
                  <TableRow key={chama.id}>
                    <TableCell className="font-medium">{chama.name}</TableCell>
                    <TableCell>{chama.description || "No description"}</TableCell>
                    <TableCell className="font-semibold text-secondary">
                      KSh {parseFloat(chama.contributionAmount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{chama.meetingSchedule || "Not set"}</Badge>
                    </TableCell>
                    <TableCell>
                      {chama.createdAt ? new Date(chama.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(chama)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(chama.id)}
                          disabled={deleteChamaMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No chamas found</p>
              <p className="text-sm text-gray-400">Create your first chama to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
