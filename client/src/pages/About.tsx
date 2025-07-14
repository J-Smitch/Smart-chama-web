import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Eye, Users } from "lucide-react";

export default function About() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About SmartChama</h1>
            <p className="text-lg text-gray-600 mb-6">
              SmartChama was born from the understanding that traditional chama management can be challenging, 
              time-consuming, and prone to errors. We're here to change that.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our platform digitizes the entire chama experience, from member registration to payout distribution, 
              making it easier for groups to focus on what matters most - growing their savings together.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <Target className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-700">To empower savings groups across Kenya with modern, reliable technology that simplifies financial management.</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <Eye className="w-8 h-8 text-secondary mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-700">A future where every chama group has access to professional-grade financial management tools.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Active Chamas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">5,000+</div>
                <div className="text-sm text-gray-600">Happy Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">KSh 50M+</div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-primary to-secondary h-96 flex items-center justify-center">
                <Users className="w-32 h-32 text-white opacity-30" />
              </div>
            </div>
            
            <Card className="absolute -bottom-6 -left-6 shadow-lg">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-gray-900">99.8%</div>
                <div className="text-sm text-gray-600">Uptime Guarantee</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SmartChama?</h2>
            <p className="text-xl text-gray-600">We understand the unique needs of Kenyan savings groups</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted & Secure</h3>
              <p className="text-gray-600">Bank-level security to protect your group's financial data</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface designed for all skill levels</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Support</h3>
              <p className="text-gray-600">Dedicated customer support in English and Swahili</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
