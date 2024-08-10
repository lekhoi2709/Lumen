import { LayoutGridIcon, StretchHorizontalIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

function ChangeViewButton({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
}) {
  return (
    <div className="hidden h-fit w-fit gap-1 self-end rounded-md border border-border p-1 md:flex">
      <label htmlFor="list" className="hidden md:block">
        <input
          id="list"
          type="radio"
          checked={view == "list"}
          className="peer hidden"
          name="view"
          value={"list"}
          onChange={() => setView("list")}
        />
        <div className="cursor-pointer rounded-sm p-2 text-muted-foreground transition duration-300 ease-in-out peer-checked:bg-orange-500/20 peer-checked:text-orange-500 hover:peer-checked:bg-orange-500/30 lg:hover:bg-muted">
          <StretchHorizontalIcon strokeWidth={2} />
        </div>
      </label>
      <label htmlFor="grid" className="hidden md:block">
        <input
          id="grid"
          type="radio"
          checked={view == "grid"}
          className="peer hidden"
          name="view"
          value={"grid"}
          onChange={() => setView("grid")}
        />
        <div className="cursor-pointer rounded-sm p-2 text-muted-foreground transition duration-300 ease-in-out peer-checked:bg-orange-500/20 peer-checked:text-orange-500 hover:peer-checked:bg-orange-500/30 lg:hover:bg-muted">
          <LayoutGridIcon strokeWidth={2} />
        </div>
      </label>
    </div>
  );
}

export default ChangeViewButton;
