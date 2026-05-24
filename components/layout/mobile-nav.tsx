import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { navItems } from "@/components/layout/nav-config";
import type { Usuario } from "@/lib/types/database";

export function MobileNav({ profile }: { profile: Usuario }) {
  const items = navItems.filter((item) => item.mobile && item.roles.includes(profile.rol)).slice(0, 4);
  return <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t bg-white/95 p-2 backdrop-blur lg:hidden">{items.map((item) => <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-xl py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><item.icon className="h-5 w-5" />{item.mobileLabel ?? item.label}</Link>)}<SignOutButton compact /></nav>;
}
