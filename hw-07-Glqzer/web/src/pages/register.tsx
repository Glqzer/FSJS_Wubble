import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { getPagePath, redirectPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { Toaster } from "@/components/ui/toaster";

const Register = () => {
  const { user, register } = useAuth();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await register(name, username, password);
    
    setTimeout(() => {
      if (user.name) {
        redirectPage($router, "home");
      }
    }, 500);
    
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-center text-muted-foreground">
          Or{" "}
          <a
            href={getPagePath($router, "login")}
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            sign in to your existing account
          </a>
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleFormSubmit} method="POST">
        <div>
          <Label htmlFor="name">Name</Label>
          <div className="mt-1">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your name"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="mt-1">
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Enter a username"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter a password"
            />
          </div>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default Register;