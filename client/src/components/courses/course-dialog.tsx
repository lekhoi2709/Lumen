import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import JoinCourse from "./join-course";
import CreateCourse from "./create-course";

function CourseDialog() {
  const { user } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild className="fixed bottom-4 right-4 md:static">
        <Button
          variant="outline"
          className="w-14 h-14 bg-orange-500 border-transparent z-[40] md:w-16 md:h-12 md:bg-transparent md:border-border md:z-0"
        >
          <PlusIcon size={20} className="text-background md:text-foreground" />
        </Button>
      </DialogTrigger>
      {user && user.role === "Student" && <JoinCourse user={user} />}
      {user && user.role === "Teacher" && <CreateCourse user={user} />}
    </Dialog>
  );
}

export default CourseDialog;
