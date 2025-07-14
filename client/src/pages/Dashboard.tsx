import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Calendar 
} from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: contributions } = useQuery({
    queryKey: ["/api/contributions"],
  });

  const { data: chamas } = useQuery({
    queryKey: ["/api/chamas"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Chamas</p>
                <p className="text-3xl font-bold">{stats?.totalChamas || 0}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-secondary to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Members</p>
                <p className="text-3xl font-bold">{stats?.totalMembers || 0}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <UserPlus className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-accent to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">This Month</p>
                <p className="text-3xl font-bold">
                  KSh {stats?.totalContributions?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Next Payout</p>
                <p className="text-3xl font-bold">{stats?.nextPayout || "N/A"}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700">Member</th>
                    <th className="px-4 py-2 text-left text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contributions?.slice(0, 5).map((contribution: any) => (
                    <tr key={contribution.id}>
                      <td className="px-4 py-2">{contribution.member.user.name}</td>
                      <td className="px-4 py-2 text-secondary font-semibold">
                        KSh {parseFloat(contribution.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(contribution.contributionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        No contributions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Chamas */}
        <Card>
          <CardHeader>
            <CardTitle>Active Chamas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chamas?.slice(0, 5).map((chama: any) => (
                <div key={chama.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{chama.name}</h4>
                    <p className="text-sm text-gray-600">{chama.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      KSh {parseFloat(chama.contributionAmount).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Per contribution</p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">
                  No chamas yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
