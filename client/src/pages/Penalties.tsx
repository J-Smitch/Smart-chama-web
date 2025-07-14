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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
import { Penalty, InsertPenalty } from "@shared/schema";

export default function Penalties() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPenalty, setEditingPenalty] = useState<Penalty | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<InsertPenalty>({
    memberId: 0,
    chamaId: 0,
    amount: "",
    reason: "",
    status: "pending",
  });
  
  const { toast } = useToast();

  const { data: penalties, isLoading } = useQuery({
    queryKey: ["/api/penalties"],
  });

  const { data: members } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: chamas } = useQuery({
    queryKey: ["/api/chamas"],
  });

  const createPenaltyMutation = useMutation({
    mutationFn: async (data: InsertPenalty) => {
      const response = await apiRequest("POST", "/api/penalties", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      toast({
        title: "Success",
        description: "Penalty recorded successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record penalty",
        variant: "destructive",
      });
    },
  });

  const updatePenaltyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPenalty> }) => {
      const response = await apiRequest("PUT", `/api/penalties/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      toast({
        title: "Success",
        description: "Penalty updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update penalty",
        variant: "destructive",
      });
    },
  });

  const deletePenaltyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/penalties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      toast({
        title: "Success",
        description: "Penalty deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete penalty",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      memberId: 0,
      chamaId: 0,
      amount: "",
      reason: "",
      status: "pending",
    });
    setEditingPenalty(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPenalty) {
      updatePenaltyMutation.mutate({ id: editingPenalty.id, data: formData });
    } else {
      createPenaltyMutation.mutate(formData);
    }
  };

  const handleEdit = (penalty: any) => {
    setEditingPenalty(penalty);
    setFormData({
      memberId: penalty.memberId,
      chamaId: penalty.chamaId,
      amount: penalty.amount,
      reason: penalty.reason,
      status: penalty.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this penalty?")) {
      deletePenaltyMutation.mutate(id);
    }
  };

  const filteredPenalties = penalties?.filter((penalty: any) => {
    const matchesSearch = penalty.member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penalty.chama.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penalty.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || penalty.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "pending": return "secondary";
      case "waived": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penalties</h1>
          <p className="text-gray-600">Manage member penalties and late fees</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Penalty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPenalty ? "Edit Penalty" : "Add New Penalty"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="memberId">Member</Label>
                <Select
                  value={formData.memberId?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, memberId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members?.map((member: any) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.user.name} - {member.chama.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="chamaId">Chama</Label>
                <Select
                  value={formData.chamaId?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, chamaId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chama" />
                  </SelectTrigger>
                  <SelectContent>
                    {chamas?.map((chama: any) => (
                      <SelectItem key={chama.id} value={chama.id.toString()}>
                        {chama.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount (KSh)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="waived">Waived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createPenaltyMutation.isPending || updatePenaltyMutation.isPending}>
                  {createPenaltyMutation.isPending || updatePenaltyMutation.isPending ? "Saving..." : "Save"}
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
                placeholder="Search penalties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="waived">Waived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredPenalties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Chama</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPenalties.map((penalty: any) => (
                  <TableRow key={penalty.id}>
                    <TableCell className="font-medium">{penalty.member.user.name}</TableCell>
                    <TableCell>{penalty.chama.name}</TableCell>
                    <TableCell className="font-semibold text-destructive">
                      KSh {parseFloat(penalty.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>{penalty.reason}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(penalty.status)}>
                        {penalty.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {penalty.penaltyDate ? new Date(penalty.penaltyDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(penalty)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(penalty.id)}
                          disabled={deletePenaltyMutation.isPending}
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
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No penalties found</p>
              <p className="text-sm text-gray-400">Add penalties for late payments or violations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
