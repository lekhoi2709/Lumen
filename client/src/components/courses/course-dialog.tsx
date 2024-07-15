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
      <DialogTrigger asChild>
        <Button variant="outline" className="px-3">
          <PlusIcon size={20} />
        </Button>
      </DialogTrigger>
      {user && user.role === "Student" && <JoinCourse user={user} />}
      {user && user.role === "Teacher" && <CreateCourse user={user} />}
    </Dialog>
  );
}

export default CourseDialog;
