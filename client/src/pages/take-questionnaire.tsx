import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Questionnaire, Question, CheeseProduct } from "@shared/schema";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type Answers = Record<string, string>;

export default function TakeQuestionnaire() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [customerEmail, setCustomerEmail] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<CheeseProduct[]>([]);

  const { data: questionnaire, isLoading: questionnaireLoading } = useQuery<Questionnaire>({
    queryKey: ["/api/public/questionnaires", id],
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/public/questionnaires", id, "questions"],
    enabled: !!id,
  });

  const { data: userId } = useQuery<{ userId: string }>({
    queryKey: ["/api/public/questionnaires", id, "user"],
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { customerEmail: string; answers: Answers }) => {
      return await apiRequest("POST", `/api/public/questionnaires/${id}/submit`, data);
    },
    onSuccess: (data: { recommendations: CheeseProduct[] }) => {
      setRecommendations(data.recommendations);
      setIsComplete(true);
      toast({
        title: "Success",
        description: "Your responses have been submitted!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit responses. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sortedQuestions = questions?.sort((a, b) => a.order - b.order) || [];
  const currentQuestion = sortedQuestions[currentQuestionIndex];
  const progress = sortedQuestions.length > 0 
    ? ((currentQuestionIndex + 1) / sortedQuestions.length) * 100 
    : 0;

  const handleAnswer = (value: string) => {
    if (currentQuestion) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: value,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate({
      customerEmail,
      answers,
    });
  };

  const isAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;
  const isLastQuestion = currentQuestionIndex === sortedQuestions.length - 1;

  if (questionnaireLoading || questionsLoading) {
    return <QuestionnaireLoading />;
  }

  if (!questionnaire || !questionnaire.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="mb-2 text-lg font-semibold">Questionnaire Not Available</h3>
            <p className="text-center text-sm text-muted-foreground">
              This questionnaire is not currently published or does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl space-y-8 py-12">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold" data-testid="heading-complete">
              Thank You!
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your preferences, here are our top cheese recommendations for you.
            </p>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover-elevate"
                  data-testid={`card-recommendation-${product.id}`}
                >
                  {product.imageUrl && (
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        #{index + 1}
                      </div>
                    </div>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  {product.tags && product.tags.length > 0 && (
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No specific recommendations at this time. Please contact us for personalized suggestions!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="mb-2 text-lg font-semibold">No Questions Available</h3>
            <p className="text-center text-sm text-muted-foreground">
              This questionnaire doesn't have any questions yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold" data-testid="heading-questionnaire-title">
            {questionnaire.title}
          </h1>
          {questionnaire.description && (
            <p className="text-lg text-muted-foreground">
              {questionnaire.description}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {sortedQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        {/* Question Card */}
        <Card data-testid={`card-question-${currentQuestion?.id}`}>
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion?.questionText}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion?.questionType === "multiple-choice" && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rounded-md border p-4 hover-elevate"
                      data-testid={`option-${index}`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion?.questionType === "rating" && (
              <div className="space-y-3">
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswer}
                >
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex flex-col items-center gap-2">
                        <RadioGroupItem
                          value={String(rating)}
                          id={`rating-${rating}`}
                          className="h-12 w-12"
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="cursor-pointer text-sm"
                        >
                          {rating}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not at all</span>
                  <span>Extremely</span>
                </div>
              </div>
            )}

            {currentQuestion?.questionType === "text" && (
              <Textarea
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="min-h-32"
                data-testid="input-text-answer"
              />
            )}
          </CardContent>
        </Card>

        {/* Email Input (Last Question) */}
        {isLastQuestion && (
          <Card data-testid="card-email-input">
            <CardHeader>
              <CardTitle>Almost Done!</CardTitle>
              <CardDescription>
                Optionally provide your email to receive your personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="email"
                placeholder="your@email.com (optional)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                data-testid="input-email"
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            data-testid="button-previous"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered || submitMutation.isPending}
              data-testid="button-submit"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit"}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              data-testid="button-next"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionnaireLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6 py-12">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        <Skeleton className="h-2 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
