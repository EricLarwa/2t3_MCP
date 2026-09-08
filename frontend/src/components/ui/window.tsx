import * as React from "react";
import { Header } from "./chat_window/header";

function Window({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window"
      className={className}
      {...props}
    >
      <Header className="absolute top-0 left-0 w-full h-12 bg-background border-b border-border" />
      {children}
    </div>
  );
}

export { Window }