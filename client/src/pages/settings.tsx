import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ThemeToggle } from "@/components/theme-toggle";

const settingsSchema = z.object({
  companyName: z.string().optional(),
  brandColor: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

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

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      return await apiRequest("PATCH", "/api/auth/user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
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
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: user?.companyName || "",
      brandColor: user?.brandColor || "#F59E0B",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        companyName: user.companyName || "",
        brandColor: user.brandColor || "#F59E0B",
      });
    }
  }, [user, form]);

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (authLoading || !isAuthenticated) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-settings">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and branding preferences
        </p>
      </div>

      <div className="grid gap-6 md:max-w-2xl">
        <Card data-testid="card-account-info">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details from authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground" data-testid="text-user-fullname">
                {user?.firstName || user?.lastName
                  ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email-display">
                {user?.email || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-company-branding">
          <CardHeader>
            <CardTitle>Company Branding</CardTitle>
            <CardDescription>
              Customize how your questionnaires appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Cheese Company"
                          data-testid="input-company-name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed on your public questionnaires
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brandColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            className="w-24 h-10"
                            data-testid="input-brand-color"
                            {...field}
                          />
                          <Input
                            placeholder="#F59E0B"
                            data-testid="input-brand-color-text"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Primary color for buttons and accents on your questionnaires
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card data-testid="card-appearance">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize your dashboard appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>
      <div className="grid gap-6 md:max-w-2xl">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
