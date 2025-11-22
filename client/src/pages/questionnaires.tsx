import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionnaireSchema } from "@shared/schema";
import type { Questionnaire, InsertQuestionnaire } from "@shared/schema";
import { Plus, Edit, Trash2, ExternalLink, Copy } from "lucide-react";
import { Link } from "wouter";

export default function Questionnaires() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  const { data: questionnaires, isLoading } = useQuery<Questionnaire[]>({
    queryKey: ["/api/questionnaires"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertQuestionnaire) => {
      return await apiRequest("POST", "/api/questionnaires", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaires"] });
      toast({
        title: "Success",
        description: "Questionnaire created successfully",
      });
      setCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create questionnaire",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/questionnaires/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaires"] });
      toast({
        title: "Success",
        description: "Questionnaire deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete questionnaire",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertQuestionnaire>({
    resolver: zodResolver(insertQuestionnaireSchema.omit({ userId: true })),
    defaultValues: {
      title: "",
      description: "",
      isPublished: false,
    },
  });

  const onSubmit = (data: Omit<InsertQuestionnaire, 'userId'>) => {
    // userId is enforced on the server from the session
    createMutation.mutate(data as InsertQuestionnaire);
  };

  const copyQuestionnaireUrl = (id: string) => {
    const url = `${window.location.origin}/q/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Questionnaire URL copied to clipboard",
    });
  };

  if (authLoading || !isAuthenticated) {
    return <QuestionnairesSkeleton />;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-questionnaires">
            Questionnaires
          </h1>
          <p className="text-muted-foreground">
            Create and manage your cheese questionnaires
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-questionnaire">
              <Plus className="mr-2 h-4 w-4" />
              New Questionnaire
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-create-questionnaire">
            <DialogHeader>
              <DialogTitle>Create New Questionnaire</DialogTitle>
              <DialogDescription>
                Start building a custom questionnaire for your customers
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Find Your Perfect Cheese"
                          data-testid="input-questionnaire-title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell customers what this questionnaire is about..."
                          data-testid="input-questionnaire-description"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-questionnaire"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Questionnaire"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : questionnaires && questionnaires.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {questionnaires.map((questionnaire) => (
            <Card
              key={questionnaire.id}
              className="hover-elevate"
              data-testid={`card-questionnaire-${questionnaire.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{questionnaire.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {questionnaire.description || "No description"}
                    </CardDescription>
                  </div>
                  <Badge variant={questionnaire.isPublished ? "default" : "secondary"}>
                    {questionnaire.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    data-testid={`button-edit-${questionnaire.id}`}
                  >
                    <Link href={`/questionnaires/${questionnaire.id}`}>
                      <a className="gap-2">
                        <Edit className="h-3 w-3" />
                        Edit
                      </a>
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyQuestionnaireUrl(questionnaire.id)}
                    data-testid={`button-copy-url-${questionnaire.id}`}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    data-testid={`button-preview-${questionnaire.id}`}
                  >
                    <a href={`/q/${questionnaire.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(questionnaire.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${questionnaire.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card data-testid="card-empty-state">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No questionnaires yet</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Create your first questionnaire to start collecting customer preferences
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first">
              <Plus className="mr-2 h-4 w-4" />
              Create Questionnaire
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QuestionnairesSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
