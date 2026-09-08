
import * as React from "react"
import { cn } from "../../../lib/utils";


function ChatInterface({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6", className)} {...props}>
      {children}
    </div>
  );
}

export { ChatInterface }
