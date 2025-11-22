import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionSchema } from "@shared/schema";
import type { Questionnaire, Question, InsertQuestion } from "@shared/schema";
import { Plus, Trash2, GripVertical, ArrowLeft } from "lucide-react";
import { z } from "zod";

export default function QuestionnaireEditor() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [createQuestionOpen, setCreateQuestionOpen] = useState(false);
  const [optionInputs, setOptionInputs] = useState<string[]>([""]);

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

  const { data: questionnaire, isLoading: questionnaireLoading } = useQuery<Questionnaire>({
    queryKey: ["/api/questionnaires", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/questionnaires", id, "questions"],
    enabled: isAuthenticated && !!id,
  });

  const updateQuestionnaireMutation = useMutation({
    mutationFn: async (data: Partial<Questionnaire>) => {
      return await apiRequest("PATCH", `/api/questionnaires/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaires", id] });
      toast({
        title: "Success",
        description: "Questionnaire updated successfully",
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
        description: "Failed to update questionnaire",
        variant: "destructive",
      });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: InsertQuestion) => {
      return await apiRequest("POST", `/api/questionnaires/${id}/questions`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaires", id, "questions"] });
      toast({
        title: "Success",
        description: "Question added successfully",
      });
      setCreateQuestionOpen(false);
      form.reset();
      setOptionInputs([""]);
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
        description: "Failed to add question",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      return await apiRequest("DELETE", `/api/questions/${questionId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaires", id, "questions"] });
      toast({
        title: "Success",
        description: "Question deleted successfully",
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
        description: "Failed to delete question",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertQuestion>({
    resolver: zodResolver(
      insertQuestionSchema.omit({ questionnaireId: true }).extend({
        questionText: z.string().min(1, "Question text is required"),
        questionType: z.string().min(1, "Question type is required"),
      })
    ),
    defaultValues: {
      questionText: "",
      questionType: "multiple-choice",
      options: null,
      order: 0,
    },
  });

  const questionType = form.watch("questionType");

  const onSubmit = (data: Omit<InsertQuestion, 'questionnaireId'>) => {
    const cleanOptions = optionInputs.filter(opt => opt.trim() !== "");
    // questionnaireId is enforced on the server from the URL param
    const finalData = {
      ...data,
      options: data.questionType === "multiple-choice" ? cleanOptions : null,
      order: questions?.length || 0,
    };
    createQuestionMutation.mutate(finalData as InsertQuestion);
  };

  const togglePublished = () => {
    if (questionnaire) {
      updateQuestionnaireMutation.mutate({
        isPublished: !questionnaire.isPublished,
      });
    }
  };

  if (authLoading || questionnaireLoading || !isAuthenticated) {
    return <EditorSkeleton />;
  }

  if (!questionnaire) {
    return (
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="mb-2 text-lg font-semibold">Questionnaire not found</h3>
            <Button asChild>
              <Link href="/questionnaires">
                <a>Back to Questionnaires</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild data-testid="button-back">
            <Link href="/questionnaires">
              <a>
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-questionnaire-editor">
              {questionnaire.title}
            </h1>
            <p className="text-muted-foreground">{questionnaire.description || "Edit your questionnaire"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Published</span>
            <Switch
              checked={questionnaire.isPublished}
              onCheckedChange={togglePublished}
              data-testid="switch-published"
            />
          </div>
          <Badge variant={questionnaire.isPublished ? "default" : "secondary"}>
            {questionnaire.isPublished ? "Live" : "Draft"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" data-testid="card-questions">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Add and organize questions for your questionnaire
                </CardDescription>
              </div>
              <Dialog open={createQuestionOpen} onOpenChange={setCreateQuestionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-add-question">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" data-testid="dialog-add-question">
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>
                      Create a question for your customers to answer
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="questionText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., What flavor profile do you prefer?"
                                data-testid="input-question-text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="questionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-question-type">
                                  <SelectValue placeholder="Select question type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="rating">Rating Scale</SelectItem>
                                <SelectItem value="text">Text Response</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {questionType === "multiple-choice" && (
                        <div className="space-y-2">
                          <FormLabel>Options</FormLabel>
                          {optionInputs.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...optionInputs];
                                  newOptions[index] = e.target.value;
                                  setOptionInputs(newOptions);
                                }}
                                data-testid={`input-option-${index}`}
                              />
                              {optionInputs.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setOptionInputs(optionInputs.filter((_, i) => i !== index));
                                  }}
                                  data-testid={`button-remove-option-${index}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setOptionInputs([...optionInputs, ""])}
                            data-testid="button-add-option"
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add Option
                          </Button>
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={createQuestionMutation.isPending}
                          data-testid="button-submit-question"
                        >
                          {createQuestionMutation.isPending ? "Adding..." : "Add Question"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {questionsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : questions && questions.length > 0 ? (
              <div className="space-y-4">
                {questions
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <Card key={question.id} data-testid={`card-question-${question.id}`}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <GripVertical className="mt-1 h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Question {index + 1}
                                  </span>
                                  <Badge variant="outline">{question.questionType}</Badge>
                                </div>
                                <p className="font-medium">{question.questionText}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteQuestionMutation.mutate(question.id)}
                                disabled={deleteQuestionMutation.isPending}
                                data-testid={`button-delete-question-${question.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {question.options && question.options.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="h-4 w-4 rounded-full border-2" />
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No questions yet</h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Add your first question to get started
                </p>
                <Button onClick={() => setCreateQuestionOpen(true)} data-testid="button-add-first-question">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card data-testid="card-preview-info">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your questionnaire looks to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                asChild
                data-testid="button-preview"
              >
                <a href={`/q/${id}`} target="_blank" rel="noopener noreferrer">
                  Open Preview
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-share-info">
            <CardHeader>
              <CardTitle>Share</CardTitle>
              <CardDescription>
                Share this URL with your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-3">
                <code className="text-xs break-all">
                  {window.location.origin}/q/{id}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
