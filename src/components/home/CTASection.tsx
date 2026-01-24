import { Link } from 'react-router-dom';
import { ArrowRight, Code, Users, Lightbulb, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with like-minded developers and tech enthusiasts from around the world.'
  },
  {
    icon: Code,
    title: 'Tech Events',
    description: 'Attend workshops, hackathons, and meetups to level up your skills.'
  },
  {
    icon: Lightbulb,
    title: 'Knowledge Sharing',
    description: 'Share your insights and learn from community posts and discussions.'
  },
  {
    icon: Rocket,
    title: 'Career Growth',
    description: 'Network with industry professionals and discover new opportunities.'
  }
];

export function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 surface-elevated relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-glow-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="gradient-border animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-base sm:text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to join the{' '}
              <span className="gradient-text">we4x</span> community?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-lg">
              Be part of a growing community of developers, designers, and tech enthusiasts. 
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="glow-primary text-xs sm:text-sm">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-xs sm:text-sm">
                <Link to="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
