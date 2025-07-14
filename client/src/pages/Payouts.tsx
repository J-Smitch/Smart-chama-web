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
import { Plus, Edit, Trash2, Search, Calendar, DollarSign } from "lucide-react";
import { Payout, InsertPayout } from "@shared/schema";

export default function Payouts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayout, setEditingPayout] = useState<Payout | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<InsertPayout>({
    chamaId: 0,
    memberId: 0,
    amount: "",
    payoutDate: new Date(),
    status: "scheduled",
    notes: "",
  });
  
  const { toast } = useToast();

  const { data: payouts, isLoading } = useQuery({
    queryKey: ["/api/payouts"],
  });

  const { data: members } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: chamas } = useQuery({
    queryKey: ["/api/chamas"],
  });

  const createPayoutMutation = useMutation({
    mutationFn: async (data: InsertPayout) => {
      const response = await apiRequest("POST", "/api/payouts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      toast({
        title: "Success",
        description: "Payout scheduled successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule payout",
        variant: "destructive",
      });
    },
  });

  const updatePayoutMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPayout> }) => {
      const response = await apiRequest("PUT", `/api/payouts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      toast({
        title: "Success",
        description: "Payout updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payout",
        variant: "destructive",
      });
    },
  });

  const deletePayoutMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/payouts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      toast({
        title: "Success",
        description: "Payout deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete payout",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      chamaId: 0,
      memberId: 0,
      amount: "",
      payoutDate: new Date(),
      status: "scheduled",
      notes: "",
    });
    setEditingPayout(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPayout) {
      updatePayoutMutation.mutate({ id: editingPayout.id, data: formData });
    } else {
      createPayoutMutation.mutate(formData);
    }
  };

  const handleEdit = (payout: any) => {
    setEditingPayout(payout);
    setFormData({
      chamaId: payout.chamaId,
      memberId: payout.memberId,
      amount: payout.amount,
      payoutDate: new Date(payout.payoutDate),
      status: payout.status,
      notes: payout.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this payout?")) {
      deletePayoutMutation.mutate(id);
    }
  };

  const filteredPayouts = payouts?.filter((payout: any) => {
    const matchesSearch = payout.member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.chama.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "scheduled": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-600">Manage scheduled and completed payouts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPayout ? "Edit Payout" : "Schedule New Payout"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="payoutDate">Payout Date</Label>
                <Input
                  id="payoutDate"
                  type="date"
                  value={formData.payoutDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, payoutDate: new Date(e.target.value) })}
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createPayoutMutation.isPending || updatePayoutMutation.isPending}>
                  {createPayoutMutation.isPending || updatePayoutMutation.isPending ? "Saving..." : "Save"}
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
                placeholder="Search payouts..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
          ) : filteredPayouts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Chama</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payout Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout: any) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.member.user.name}</TableCell>
                    <TableCell>{payout.chama.name}</TableCell>
                    <TableCell className="font-semibold text-secondary">
                      KSh {parseFloat(payout.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(payout.payoutDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payout.notes || "No notes"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(payout)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(payout.id)}
                          disabled={deletePayoutMutation.isPending}
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
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payouts found</p>
              <p className="text-sm text-gray-400">Schedule your first payout to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
