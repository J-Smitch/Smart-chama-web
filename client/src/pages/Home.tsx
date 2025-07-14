import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BarChart3, Calendar, FileText, CheckCircle, Star } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Simplify Your <span className="text-primary">Chama</span> Management
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                SmartChama is the digital platform that transforms how savings groups manage contributions, track payments, and grow together in Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-up">
              <Card className="transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-2xl">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Jua Kali Chama</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">KSh 245,000</div>
                        <div className="text-sm text-gray-600">Total Savings</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-sm text-gray-600">Active Members</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Mary Wanjiku</span>
                      <span className="text-sm font-medium text-secondary">KSh 5,000</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">John Kariuki</span>
                      <span className="text-sm font-medium text-secondary">KSh 5,000</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Grace Akinyi</span>
                      <span className="text-sm font-medium text-accent">Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SmartChama?</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your savings group efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Chamas</h3>
              <p className="text-gray-600">Create and manage multiple savings groups with ease</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Contributions</h3>
              <p className="text-gray-600">Monitor member contributions and payment history</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Payouts</h3>
              <p className="text-gray-600">Automate payout schedules and notifications</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Reports</h3>
              <p className="text-gray-600">Detailed financial reports and analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of chama groups across Kenya</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">MW</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Mary Wanjiku</h4>
                    <p className="text-sm text-gray-600">Chairperson, Jua Kali Chama</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "SmartChama has revolutionized how we manage our group. No more manual record keeping. Everything is digital and transparent."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JK</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">John Kariuki</h4>
                    <p className="text-sm text-gray-600">Treasurer, Biashara Chama</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The automatic notifications and payment tracking have made my job as treasurer so much easier. Highly recommended!"
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">GA</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Grace Akinyi</h4>
                    <p className="text-sm text-gray-600">Member, Mama Mboga Chama</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "I love how I can track all my contributions and see exactly when I'll receive my payout. Very user-friendly!"
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Chama?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of savings groups already using SmartChama</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
