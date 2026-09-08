import * as React from "react";
import { Header } from "./chat_window/header";
import { cn } from "../../lib/utils";

function Window({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window"
      className={cn("flex h-dvh w-full flex-col overflow-hidden bg-background", className)}
      {...props}
    >
      <Header />
      {children}
    </div>
  );
}

export { Window }
