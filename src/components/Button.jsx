import React from "react";
import { Button } from "@material-tailwind/react";

function ButtonResponsive({
  children,
  icon: Icon,
  loading = false,
  disabled,
  className,
  ...props
}) {

  const defaultClasses = "flex items-center gap-2 uppercase px-2.5 py-2.5 text-xs md:py-2 md:px-4 md:text-sm";
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : "false"}
      className={className ?? defaultClasses}
    >
      {Icon ? (
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${loading ? "animate-spin" : ""}`} />
      ) : null}
      {children}
    </Button>
  );
}

export default ButtonResponsive;