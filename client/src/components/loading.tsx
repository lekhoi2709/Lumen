import { Loader2Icon } from "lucide-react";

function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}

export default Loading;
