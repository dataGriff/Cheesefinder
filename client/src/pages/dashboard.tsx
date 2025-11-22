import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ClipboardList, 
  Package, 
  Users, 
  TrendingUp,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import type { Questionnaire, CheeseProduct, Response } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: questionnaires, isLoading: questionnairesLoading } = useQuery<Questionnaire[]>({
    queryKey: ["/api/questionnaires"],
    enabled: isAuthenticated,
  });

  const { data: products, isLoading: productsLoading } = useQuery<CheeseProduct[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated,
  });

  const { data: responses, isLoading: responsesLoading } = useQuery<Response[]>({
    queryKey: ["/api/responses"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: "Total Questionnaires",
      value: questionnaires?.length || 0,
      icon: ClipboardList,
      description: "Active questionnaires",
      link: "/questionnaires",
      linkText: "Manage",
      testId: "card-stat-questionnaires",
    },
    {
      title: "Cheese Products",
      value: products?.length || 0,
      icon: Package,
      description: "In your catalog",
      link: "/products",
      linkText: "View All",
      testId: "card-stat-products",
    },
    {
      title: "Total Responses",
      value: responses?.length || 0,
      icon: Users,
      description: "Customer submissions",
      link: "/questionnaires",
      linkText: "View Details",
      testId: "card-stat-responses",
    },
    {
      title: "Completion Rate",
      value: questionnaires?.length ? 
        `${Math.round(((responses?.length || 0) / questionnaires.length) * 10)}%` : 
        "0%",
      icon: TrendingUp,
      description: "Average completion",
      testId: "card-stat-completion",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-dashboard">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your cheese questionnaires.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild data-testid="button-new-product">
            <Link href="/products">
              <a className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </a>
            </Link>
          </Button>
          <Button asChild data-testid="button-new-questionnaire">
            <Link href="/questionnaires">
              <a className="gap-2">
                <Plus className="h-4 w-4" />
                New Questionnaire
              </a>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-elevate" data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {(questionnairesLoading || productsLoading || responsesLoading) ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.link && (
                <Button variant="link" className="mt-2 h-auto p-0" asChild>
                  <Link href={stat.link}>
                    <a className="text-xs">{stat.linkText} →</a>
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-quick-action-questionnaire">
          <CardHeader>
            <CardTitle>Create Your First Questionnaire</CardTitle>
            <CardDescription>
              Build a custom questionnaire to help customers find their perfect cheese
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-create-questionnaire">
              <Link href="/questionnaires">
                <a className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Build Questionnaire
                </a>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-quick-action-products">
          <CardHeader>
            <CardTitle>Add Cheese Products</CardTitle>
            <CardDescription>
              Build your product catalog to power personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline" data-testid="button-add-products">
              <Link href="/products">
                <a className="gap-2">
                  <Package className="h-4 w-4" />
                  Manage Products
                </a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {responses && responses.length > 0 && (
        <Card data-testid="card-recent-responses">
          <CardHeader>
            <CardTitle>Recent Responses</CardTitle>
            <CardDescription>
              Latest customer submissions to your questionnaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responses.slice(0, 5).map((response) => (
                <div key={response.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium" data-testid={`text-response-email-${response.id}`}>
                      {response.customerEmail || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(response.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
