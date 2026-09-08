import * as React from "react";
import logo from "../../../logo.svg";
type HeaderProps = React.ComponentProps<"div">;

function Header({ className, ...props }: HeaderProps) {
  return (
    <header className={className} {...props}>
        <img src={logo} alt="bun logo" className="h-8 w-8 ml-4 mt-2" />
    </header>
  );
}

export { Header }