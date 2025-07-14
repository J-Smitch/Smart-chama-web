import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  BarChart3, 
  Smartphone, 
  Bell, 
  Shield, 
  Clock, 
  FileText,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Users,
      title: "Member Management",
      description: "Add, edit, and manage all your chama members in one place. Track their details, contributions, and activity.",
      color: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: DollarSign,
      title: "Savings Tracking",
      description: "Real-time tracking of all member contributions with automatic calculations and balance updates.",
      color: "bg-secondary/10",
      iconColor: "text-secondary"
    },
    {
      icon: CreditCard,
      title: "Loans Management",
      description: "Manage member loans, track repayments, and calculate interest automatically.",
      color: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Generate detailed financial reports, track trends, and make data-driven decisions.",
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Smartphone,
      title: "Mobile-Friendly",
      description: "Access your chama from anywhere with our mobile-optimized interface.",
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Bell,
      title: "Automated Notifications",
      description: "Never miss a payment or meeting with automatic SMS and email notifications.",
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee to protect your data.",
      color: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant updates on contributions, payments, and group activities.",
      color: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Store and organize important chama documents securely in the cloud.",
      color: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Monitor your chama's growth with detailed analytics and trend analysis.",
      color: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: Calendar,
      title: "Meeting Scheduler",
      description: "Schedule meetings, send reminders, and track attendance effortlessly.",
      color: "bg-teal-100",
      iconColor: "text-teal-600"
    },
    {
      icon: AlertCircle,
      title: "Penalty Management",
      description: "Track late payments and manage penalties with automated calculations.",
      color: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h1>
          <p className="text-xl text-gray-600">Everything you need to run a successful chama</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Kenyan Chamas</h2>
            <p className="text-xl text-gray-600">Features designed specifically for savings groups in Kenya</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">KSh Currency Support</h3>
              <p className="text-gray-600">All calculations and reports use Kenyan Shillings for accuracy</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SMS Integration</h3>
              <p className="text-gray-600">Send notifications via SMS to members without smartphones</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-language Support</h3>
              <p className="text-gray-600">Available in English and Swahili for better accessibility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
