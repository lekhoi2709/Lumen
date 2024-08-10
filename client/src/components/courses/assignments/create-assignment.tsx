import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import CreateAssignmentDialog from "./create-dialog";
import { useState } from "react";

export function CreateAssignmentBtn() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="fixed bottom-4 right-4 z-[40] h-14 w-14 border-transparent bg-orange-500 md:static md:z-0 md:h-12 md:w-16 md:border-border md:bg-transparent"
              >
                <PlusIcon
                  size={20}
                  className="text-background md:text-foreground"
                />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t("courses.assignments.create")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CreateAssignmentDialog setIsOpen={setIsOpen} />
    </Dialog>
  );
}

export default CreateAssignmentBtn;
