import { signIn, signOut, signUp, validateUser } from "@/data/api";
import { useStore } from "@nanostores/react";
import { $user, clearUser, setUser } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";

function useAuth() {
  const user = useStore($user);

  const login = async (username: string, password: string) => {

    try {
      if (!username || !password) {
        throw new Error("Username and password are required!");
      }
      const data = await signIn(username, password);
      openPage($router, "home");
      setUser(data);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing in 🙁",
        description: errorMessage,
      });
    }
  };

  const register = async (name: string, username: string, password: string) => {
    try {
      if (!name || !username || !password) {
        throw new Error("Name, username, and password are required!");
      }
      const data = await signUp(name, username, password);
      setUser(data);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing up 🙁",
        description: errorMessage,
      });
    }
  };

  const logout = async () => {
    try {
      await signOut();
      openPage($router, "login");
      clearUser();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing out 🙁",
        description: errorMessage,
      });
    }
  };

  const validate = async () => {
    try {
      const success = await validateUser();
      if (!success) {
        throw new Error("Session is invalid or expired!");
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing out 🙁",
        description: errorMessage,
      });
      clearUser();
    }
  }

  const validateErrorPage = async () => {
    try {
      await validateUser();
    } catch (error) {
      clearUser();
    }
  }

  return { user, login, register, logout, validate, validateErrorPage };
}

export default useAuth;