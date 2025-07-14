import * as React from "react"

import { cn } from "@/lib/utils"

export interface FloatingAssistantProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const FloatingAssistant = React.forwardRef<
  HTMLTextAreaElement,
  FloatingAssistantProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "peer block w-full resize-none rounded-md border border-input bg-background py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
FloatingAssistant.displayName = "FloatingAssistant"

const handleTouchStart = (e: React.TouchEvent<HTMLTextAreaElement>) => {
  e.preventDefault();
};

export { FloatingAssistant }
