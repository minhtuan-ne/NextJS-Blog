"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { buttonVariants } from "../ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const linkBase = "text-sm font-medium transition-colors";

export function Navbar() {
  const pathname = usePathname();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const linkClass = (href: string) =>
    clsx(
      linkBase,
      pathname === href
        ? "font-semibold underline underline-offset-4 text-blue-600"
        : "hover:text-blue-500"
    );

  return (
    <nav className="py-5 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="text-3xl font-semibold">
            Blog<span className="text-blue-500"> Tuan</span>
          </h1>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link className={linkClass("/")} href="/">
            Home
          </Link>
          <Link className={linkClass("/dashboard")} href="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants({ variant: "secondary" })}>
            Log out
          </LogoutLink>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <LoginLink className={buttonVariants()}>Sign in</LoginLink>
          <RegisterLink className={buttonVariants({ variant: "secondary" })}>
            Sign up
          </RegisterLink>
        </div>
      )}
    </nav>
  );
}
