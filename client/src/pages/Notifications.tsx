import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { Notification } from "@shared/schema";

export default function Notifications() {
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications", user?.id],
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", user?.id] });
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleSelectNotification = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications?.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications?.map((n: Notification) => n.id) || []);
    }
  };

  const handleMarkSelectedAsRead = () => {
    selectedNotifications.forEach(id => {
      markAsReadMutation.mutate(id);
    });
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your chama activities</p>
        </div>
        <div className="flex gap-2">
          {selectedNotifications.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkSelectedAsRead}
              disabled={markAsReadMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark Selected as Read
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSelectAll}
          >
            {selectedNotifications.length === notifications?.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Notifications
            {notifications?.filter((n: Notification) => !n.isRead).length > 0 && (
              <Badge variant="secondary">
                {notifications.filter((n: Notification) => !n.isRead).length} unread
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.isRead ? "bg-gray-50 border-gray-200" : getNotificationColor(notification.type)
                  } ${
                    selectedNotifications.includes(notification.id) ? "ring-2 ring-primary ring-opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1"
                    />
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-sm font-medium ${
                            notification.isRead ? "text-gray-700" : "text-gray-900"
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            notification.isRead ? "text-gray-500" : "text-gray-700"
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={notification.isRead || markAsReadMutation.isPending}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400">You'll see updates about your chama activities here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{notifications?.length || 0}</p>
              </div>
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-primary">
                  {notifications?.filter((n: Notification) => !n.isRead).length || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-secondary">
                  {notifications?.filter((n: Notification) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return n.createdAt && new Date(n.createdAt) > weekAgo;
                  }).length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Important</p>
                <p className="text-2xl font-bold text-destructive">
                  {notifications?.filter((n: Notification) => n.type === "error" || n.type === "warning").length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
