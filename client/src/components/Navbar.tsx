import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Home,
  Lightbulb,
  FolderKanban,
  Users,
  Trophy,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/ideas/new", label: "تقييم الأفكار", icon: Lightbulb },
    { href: "/projects", label: "المشاريع", icon: FolderKanban },
    { href: "/community", label: "المجتمع", icon: Users },
    { href: "/leaderboard", label: "لوحة الصدارة", icon: Trophy },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-gradient-bg flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L12 12M12 12L12 22M12 12L22 12M12 12L2 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                {/* Text */}
                <span className="text-2xl font-bold gradient-text">بذرة</span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-all">
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </a>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative hidden md:flex">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="bg-gradient-bg text-white">
                          {user.name?.charAt(0) || "م"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline font-medium">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <a className="flex items-center gap-2 w-full">
                          <User className="w-4 h-4" />
                          <span>الملف الشخصي</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-projects">
                        <a className="flex items-center gap-2 w-full">
                          <FolderKanban className="w-4 h-4" />
                          <span>مشاريعي</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-ideas">
                        <a className="flex items-center gap-2 w-full">
                          <Lightbulb className="w-4 h-4" />
                          <span>أفكاري</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:flex">
                  <a href={getLoginUrl()}>تسجيل الدخول</a>
                </Button>
                <Button asChild className="gradient-bg btn-hover">
                  <a href={getLoginUrl()}>ابدأ الآن</a>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </a>
                </Link>
              ))}
              {!isAuthenticated && (
                <Button asChild className="gradient-bg btn-hover mt-2">
                  <a href={getLoginUrl()}>تسجيل الدخول</a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
