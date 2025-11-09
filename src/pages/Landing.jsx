import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, BookOpen, Users, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Share Your Stories with{' '}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              BlogSpace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern blogging platform where your ideas come to life. Create, share, and connect with readers around the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                <PenSquare className="mr-2 h-5 w-5" />
                Start Writing
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Writing</h3>
            <p className="text-muted-foreground">
              Beautiful editor with all the tools you need to create engaging content
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Build Audience</h3>
            <p className="text-muted-foreground">
              Connect with readers who share your interests and passions
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized performance for the best reading and writing experience
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-2xl bg-linear-to-r from-primary/10 to-accent/10 border border-border">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of writers sharing their stories on BlogSpace
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
