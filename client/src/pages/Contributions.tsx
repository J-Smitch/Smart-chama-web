import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, DollarSign, Calendar } from "lucide-react";
import { Contribution, InsertContribution } from "@shared/schema";

export default function Contributions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<InsertContribution>({
    memberId: 0,
    chamaId: 0,
    amount: "",
    status: "completed",
  });
  
  const { toast } = useToast();

  const { data: contributions, isLoading } = useQuery({
    queryKey: ["/api/contributions"],
  });

  const { data: members } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: chamas } = useQuery({
    queryKey: ["/api/chamas"],
  });

  const createContributionMutation = useMutation({
    mutationFn: async (data: InsertContribution) => {
      const response = await apiRequest("POST", "/api/contributions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Contribution recorded successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record contribution",
        variant: "destructive",
      });
    },
  });

  const updateContributionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertContribution> }) => {
      const response = await apiRequest("PUT", `/api/contributions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Contribution updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contribution",
        variant: "destructive",
      });
    },
  });

  const deleteContributionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contributions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Contribution deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contribution",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      memberId: 0,
      chamaId: 0,
      amount: "",
      status: "completed",
    });
    setEditingContribution(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContribution) {
      updateContributionMutation.mutate({ id: editingContribution.id, data: formData });
    } else {
      createContributionMutation.mutate(formData);
    }
  };

  const handleEdit = (contribution: any) => {
    setEditingContribution(contribution);
    setFormData({
      memberId: contribution.memberId,
      chamaId: contribution.chamaId,
      amount: contribution.amount,
      status: contribution.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this contribution?")) {
      deleteContributionMutation.mutate(id);
    }
  };

  const filteredContributions = contributions?.filter((contribution: any) => {
    const matchesSearch = contribution.member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.chama.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contribution.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
          <p className="text-gray-600">Track member contributions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Record Contribution
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingContribution ? "Edit Contribution" : "Record New Contribution"}</DialogTitle>
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
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createContributionMutation.isPending || updateContributionMutation.isPending}>
                  {createContributionMutation.isPending || updateContributionMutation.isPending ? "Saving..." : "Save"}
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
                placeholder="Search contributions..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
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
          ) : filteredContributions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Chama</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContributions.map((contribution: any) => (
                  <TableRow key={contribution.id}>
                    <TableCell className="font-medium">{contribution.member.user.name}</TableCell>
                    <TableCell>{contribution.chama.name}</TableCell>
                    <TableCell className="font-semibold text-secondary">
                      KSh {parseFloat(contribution.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(contribution.status)}>
                        {contribution.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {contribution.contributionDate ? new Date(contribution.contributionDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(contribution)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(contribution.id)}
                          disabled={deleteContributionMutation.isPending}
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
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No contributions found</p>
              <p className="text-sm text-gray-400">Record your first contribution to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
