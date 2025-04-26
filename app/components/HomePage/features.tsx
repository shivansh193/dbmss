"use client";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart2, 
  Globe, 
  Users, 
  MessageSquare,
  ArrowRight 
} from "lucide-react";

const features = [
    {
      icon: LayoutDashboard,
      title: "Centralized Event Dashboard",
      description: "Manage schedules, vendors, attendees, and budgets effortlessly from a single, intuitive interface.",
      tag: "Popular"
    },
    {
      icon: CreditCard,
      title: "End-to-End Payment Integration",
      description: "Secure and seamless transactions with multiple payment options, ensuring a hassle-free booking and payment experience.",
      tag: "New"
    },
    {
      icon: BarChart2,
      title: "Data-Driven Insights",
      description: "Gain valuable analytics on attendee engagement, vendor performance, and event success to optimize future planning."
    },
    {
      icon: Globe,
      title: "Custom Event Subdomains",
      description: "Each event gets a unique branded page to showcase agendas, speaker profiles, and a smooth registration process."
    },
    {
      icon: Users,
      title: "Vendor Marketplace with Bidding",
      description: "Vendors can bid for event requirements, ensuring competitive pricing and better service selection.",
      tag: "Beta"
    },
    {
      icon: MessageSquare,
      title: "Real-Time Communication & Networking",
      description: "Enable seamless interaction between organizers, vendors, and attendees via chat, live Q&A, and video calls."
    }
  ];
  

const brands = ['Facebook', 'Webflow', 'Google', 'YouTube', 'Pinterest'];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted dark:from-background dark:to-muted/30">
      <div className="container px-4 mx-auto max-w-7xl relative">
        {/* Gradient background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl opacity-30" />
        
        <div className="text-center mb-16 space-y-4 relative">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[200%_auto] animate-gradient bg-clip-text text-transparent">
              Simple, yet powerful features
            </span>
          </h2>
          <p className="text-lg bg-gradient-to-r from-foreground/80 to-foreground/60 bg-clip-text text-transparent max-w-2xl mx-auto from-white to-gray-400 dark:from-white dark:to-gray-400">
            Everything you need to manage your business, all in one place. Start with the basics and scale up as you grow.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-purple-600/30 transition-all duration-300"
            >
              Get started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300"
            >
              Browse Features
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border border-muted-foreground/10 bg-background/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-colors duration-300" />
              <CardContent className="p-6 relative">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-3 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-purple-600 transition-colors" />
                    </div>
                    {feature.tag && (
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-foreground">
                        {feature.tag}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 relative">
                <Button 
                  variant="ghost" 
                  className="group-hover:translate-x-1 transition-transform duration-300 bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center space-y-8 relative">
          <p className="text-lg font-medium bg-gradient-to-r from-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {brands.map((brand) => (
              <div 
                key={brand}
                className="h-12 w-32 rounded-lg bg-gradient-to-r from-blue-600/5 to-purple-600/5 hover:from-blue-600/10 hover:to-purple-600/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <span className="bg-gradient-to-r from-foreground/70 to-foreground/50 bg-clip-text text-transparent font-medium">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Add this to your global CSS file
const styles = `
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient 8s linear infinite;
}
`;

export default FeaturesSection;