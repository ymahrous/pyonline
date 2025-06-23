import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import { Redirect } from "wouter";

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginUserSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await apiRequest("POST", "/api/login", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data;
      const res = await apiRequest("POST", "/api/register", registerData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Account created!",
        description: "Welcome to PyLearn! You can now start learning.",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <i className="fab fa-python text-3xl text-blue-600 mr-2"></i>
              <span className="text-2xl font-bold text-slate-800">PythonOnline</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-600">
              {activeTab === "login" 
                ? "Sign in to continue your Python journey" 
                : "Start your Python learning adventure"}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    {...loginForm.register("username")}
                    placeholder="Enter your username"
                    className="mt-1"
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-sm text-red-600 mt-1">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    {...loginForm.register("password")}
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...registerForm.register("firstName")}
                      placeholder="John"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...registerForm.register("lastName")}
                      placeholder="Doe"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...registerForm.register("username")}
                    placeholder="Choose a username"
                    className="mt-1"
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-sm text-red-600 mt-1">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerForm.register("email")}
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...registerForm.register("password")}
                    placeholder="Create a password (min 6 chars)"
                    className="mt-1"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registerForm.register("confirmPassword")}
                    placeholder="Confirm your password"
                    className="mt-1"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <i className="fab fa-python text-6xl mb-4 opacity-90"></i>
            <h2 className="text-3xl font-bold mb-4">Learn Python from Scratch</h2>
            <p className="text-lg opacity-90">
              Master Python programming through engaging lessons, hands-on projects, 
              and interactive coding exercises designed for beginners.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-left">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <i className="fas fa-code text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold">Interactive Coding</h3>
                <p className="text-sm opacity-80">Practice Python directly in your browser</p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <i className="fas fa-chart-line text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm opacity-80">Monitor your learning journey</p>
              </div>
            </div>
            <div className="flex items-center text-left">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <i className="fas fa-smile text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold">Fun Learning</h3>
                <p className="text-sm opacity-80">Enjoy memes and engaging content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}