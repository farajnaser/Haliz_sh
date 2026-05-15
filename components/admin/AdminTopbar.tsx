"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu, Moon, Sun, Store } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminTopbarProps {
  user?: { name?: string | null; email?: string | null };
  onMenuClick?: () => void;
}

export default function AdminTopbar({ user, onMenuClick }: AdminTopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-14 md:h-16 border-b bg-card px-3 md:px-6 flex items-center justify-between shrink-0">
      {/* Left side: hamburger + title/logo */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full w-9 h-9"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center">
            <Store className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            HALIZ
          </span>
        </div>

        {/* Desktop title */}
        <h1 className="text-sm font-semibold text-muted-foreground hidden md:block">لوحة الإدارة</h1>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full w-8 h-8 md:w-9 md:h-9"
        >
          {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          {!mounted && <div className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 md:w-9 md:h-9">
          <Bell className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 md:h-9 px-1.5 md:px-2 rounded-xl">
              <Avatar className="w-6 h-6 md:w-7 md:h-7">
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-600 text-white text-xs">
                  {user?.name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
