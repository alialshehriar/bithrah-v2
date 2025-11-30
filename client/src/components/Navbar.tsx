import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Home,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/early-access#evaluate", label: "قيّم فكرتك", icon: Lightbulb },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
              <img 
                src="/logo-white-bg.png" 
                alt="بذرة" 
                className="h-10 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-all cursor-pointer">
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Button asChild className="gradient-bg btn-hover">
              <Link href="/early-access">سجّل الآن</Link>
            </Button>

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
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-all cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                </Link>
              ))}
              <Button asChild className="gradient-bg btn-hover mt-2">
                <Link href="/early-access">سجّل الآن</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
