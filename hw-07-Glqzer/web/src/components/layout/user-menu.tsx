import useAuth from "@/hooks/use-auth";
import { Button } from "../ui/button";

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <div className="m-3 space-y-2">
      <div className="text-sm font-medium text-foreground">
        {`Welcome ${user.name}!`}
      </div>
      <Button variant={"secondary"} onClick={logout}>
        Sign out
      </Button>
    </div>
  );
};

export default UserMenu;