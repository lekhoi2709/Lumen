import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import ChatForm from "./chat-form";

function ChatDialog() {
  const { t } = useTranslation();
  return (
    <DialogContent className="md:max-w-[40rem] lg:max-w-[50rem] rounded-lg font-nunito bg-transparent border-none p-4">
      <div className="w-full h-full rounded-lg bg-background border border-border p-6 flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{t("courses.overview.chat-title")}</DialogTitle>
          <DialogDescription className="hidden">
            Join a class by entering
          </DialogDescription>
        </DialogHeader>
        <section className="border-t border-border pt-4">
          <ChatForm />
        </section>
      </div>
    </DialogContent>
  );
}

export default ChatDialog;
