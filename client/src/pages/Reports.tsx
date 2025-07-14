import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, Calendar, PieChart } from "lucide-react";
import { useMemo } from "react";

export default function Reports() {
  const { data: contributions } = useQuery({
    queryKey: ["/api/contributions"],
  });

  const { data: penalties } = useQuery({
    queryKey: ["/api/penalties"],
  });

  const { data: payouts } = useQuery({
    queryKey: ["/api/payouts"],
  });

  const { data: chamas } = useQuery({
    queryKey: ["/api/chamas"],
  });

  const { data: members } = useQuery({
    queryKey: ["/api/members"],
  });

  const reportData = useMemo(() => {
    if (!contributions || !penalties || !payouts) return null;

    const totalContributions = contributions.reduce((sum: number, contrib: any) => 
      sum + parseFloat(contrib.amount), 0);
    
    const totalPenalties = penalties.reduce((sum: number, penalty: any) => 
      sum + parseFloat(penalty.amount), 0);
    
    const totalPayouts = payouts.reduce((sum: number, payout: any) => 
      sum + parseFloat(payout.amount), 0);

    // Monthly contributions data
    const monthlyContributions = contributions.reduce((acc: any, contrib: any) => {
      const month = new Date(contrib.contributionDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + parseFloat(contrib.amount);
      return acc;
    }, {});

    // Contribution status breakdown
    const statusBreakdown = contributions.reduce((acc: any, contrib: any) => {
      acc[contrib.status] = (acc[contrib.status] || 0) + 1;
      return acc;
    }, {});

    // Penalty summary
    const penaltyStatus = penalties.reduce((acc: any, penalty: any) => {
      acc[penalty.status] = (acc[penalty.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalContributions,
      totalPenalties,
      totalPayouts,
      monthlyContributions,
      statusBreakdown,
      penaltyStatus,
    };
  }, [contributions, penalties, payouts]);

  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Financial insights and performance metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-secondary to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Contributions</p>
                <p className="text-2xl font-bold">KSh {reportData.totalContributions.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Payouts</p>
                <p className="text-2xl font-bold">KSh {reportData.totalPayouts.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-destructive to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Penalties</p>
                <p className="text-2xl font-bold">KSh {reportData.totalPenalties.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-accent to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Net Savings</p>
                <p className="text-2xl font-bold">
                  KSh {(reportData.totalContributions - reportData.totalPayouts).toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Contributions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.monthlyContributions).map(([month, amount]: [string, any]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${(amount / Math.max(...Object.values(reportData.monthlyContributions))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-secondary">
                      KSh {amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contribution Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Contribution Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.statusBreakdown).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{status}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}>
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Penalty Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Penalty Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.penaltyStatus).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{status}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={status === 'paid' ? 'default' : status === 'pending' ? 'secondary' : 'outline'}>
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chama Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Chama Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chamas?.slice(0, 5).map((chama: any) => {
                const chamaContributions = contributions?.filter((c: any) => c.chamaId === chama.id) || [];
                const totalAmount = chamaContributions.reduce((sum: number, c: any) => sum + parseFloat(c.amount), 0);
                
                return (
                  <div key={chama.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{chama.name}</p>
                      <p className="text-xs text-gray-600">{chamaContributions.length} contributions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-secondary">
                        KSh {totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contributions?.slice(0, 10).map((contribution: any) => (
              <div key={contribution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contribution.member.user.name}</p>
                    <p className="text-xs text-gray-600">{contribution.chama.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">KSh {parseFloat(contribution.amount).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(contribution.contributionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
