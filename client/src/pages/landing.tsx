import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  ClipboardList, 
  Sparkles, 
  Users, 
  BarChart3, 
  Check,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">🧀</span>
            </div>
            <span className="text-xl font-semibold">CheeseFinder</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
              Build Perfect Cheese{" "}
              <span className="text-primary">Recommendations</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Create custom questionnaires to help your customers discover their perfect cheese match. 
              Professional SaaS platform designed specifically for cheese companies.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild data-testid="button-get-started">
                <a href="/api/login" className="gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-learn-more">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-b py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features designed to help cheese companies deliver personalized recommendations at scale.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card data-testid="card-feature-builder">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Intuitive Questionnaire Builder</CardTitle>
                <CardDescription>
                  Drag-and-drop interface to create custom questionnaires with multiple question types
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-recommendations">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Recommendations</CardTitle>
                <CardDescription>
                  AI-powered matching algorithm to suggest the perfect cheese products based on customer preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-branding">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Custom Branding</CardTitle>
                <CardDescription>
                  Add your logo and brand colors to create a seamless experience for your customers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-analytics">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Track customer responses and gain insights into preferences and trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-hosting">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fully Hosted</CardTitle>
                <CardDescription>
                  Share unique URLs with customers - no technical setup required
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-responsive">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mobile Optimized</CardTitle>
                <CardDescription>
                  Beautiful questionnaire experience on any device - desktop, tablet, or mobile
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-12 md:gap-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-semibold">Create Your Questionnaire</h3>
                <p className="text-muted-foreground">
                  Use our intuitive builder to design custom questions that capture customer preferences. 
                  Add multiple choice, ratings, or text questions.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-semibold">Add Your Cheese Products</h3>
                <p className="text-muted-foreground">
                  Build your product catalog with images, descriptions, and tags. 
                  Our system uses these to match with customer responses.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-semibold">Share & Recommend</h3>
                <p className="text-muted-foreground">
                  Share your unique questionnaire URL with customers. 
                  They'll receive personalized cheese recommendations instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl rounded-lg bg-primary/5 p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join cheese companies using CheeseFinder to deliver personalized recommendations
            </p>
            <Button size="lg" asChild data-testid="button-cta-start">
              <a href="/api/login" className="gap-2">
                Start Building Free <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">🧀</span>
              </div>
              <span className="text-lg font-semibold">CheeseFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CheeseFinder. Built for cheese companies worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
