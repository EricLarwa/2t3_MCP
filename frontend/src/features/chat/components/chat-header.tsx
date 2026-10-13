import * as React from "react";
import logo from "../../../logo.svg";
import { cn } from "../../../lib/utils";
type HeaderProps = React.ComponentProps<"header">;

function Header({ className, ...props }: HeaderProps) {
  return (
    <header className={cn("flex h-12 w-full shrink-0 items-center border-b bg-background px-4 sm:px-6", className)} {...props}>
        <img src={logo} alt="Bun logo" className="h-8 w-8" />
    </header>
  );
}

export { Header }
