"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href.toString());

  return (
    <Link
      href={href}
      className={cn(
        "text-sm text-text-muted transition-colors hover:text-text",
        isActive && "text-primary font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
