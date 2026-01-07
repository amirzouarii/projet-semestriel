"use client";

import * as React from "react";
import { useEffect, useState, useRef, useId } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Button } from "../../button";
import { Input } from "../../input";
import { Avatar, AvatarFallback } from "../../avatar";



// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...(props as any)}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface Navbar04NavItem {
  href?: string;
  label: string;
}

export interface Navbar04Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar04NavItem[];
  signInText?: string;
  signInHref?: string;
  cartText?: string;
  cartHref?: string;
  cartCount?: number;
  searchPlaceholder?: string;
  onSignInClick?: () => void;
  onCartClick?: () => void;
  onSearchSubmit?: (query: string) => void;
  onReservationsClick?: () => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar04NavItem[] = [
  { href: "#", label: "Products" },
  { href: "#", label: "Categories" },
  { href: "#", label: "Deals" },
];

export const Navbar04 = React.forwardRef<HTMLElement, Navbar04Props>(
  (
    {
      className,
      logo = <img src="../../../../../public/logovoi.webp" alt="image" />,
      logoHref = "#",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      signInHref = "#signin",
      cartText = "Cart",
      cartHref = "#cart",
      cartCount = 2,
      searchPlaceholder = "Search...",
      onSignInClick,
      onCartClick,
      onSearchSubmit,
      onReservationsClick,
      user = null,
      onLogout,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const searchId = useId();
    const navigate = useNavigate();

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background px-4 md:px-6 [&_*]:no-underline",
          className
        )}
        {...(props as any)}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex flex-1 items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}
                      <NavigationMenuItem
                        className="w-full"
                        role="presentation"
                        aria-hidden={true}
                      >
                        <div
                          role="separator"
                          aria-orientation="horizontal"
                          className="bg-border -mx-1 my-1 h-px"
                        />
                      </NavigationMenuItem>
                      <NavigationMenuItem className="w-full">
                        <button
                          onClick={() => navigate('/register')}
                          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                        >
                          Sign up
                        </button>
                      </NavigationMenuItem>
                      <NavigationMenuItem className="w-full">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (onSignInClick) onSignInClick();
                          }}
                          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                        >
                          {signInText}
                        </button>
                      </NavigationMenuItem>
                      <NavigationMenuItem className="w-full">
                        <Button
                          size="sm"
                          className="mt-0.5 w-full text-left text-sm"
                          onClick={(e: { preventDefault: () => void }) => {
                            e.preventDefault();
                            if (onCartClick) onCartClick();
                          }}
                        >
                          <span className="flex items-baseline gap-2">
                            {cartText}
                            <span className="text-primary-foreground/60 text-xs">
                              {cartCount}
                            </span>
                          </span>
                        </Button>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex flex-1 items-center gap-6 max-md:justify-between">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="w-[95px] h-auto">{logo}</div>
                
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex" orientation="horizontal">
                  <NavigationMenuList className="flex flex-row gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <button
                          onClick={() => {
                            if (link.href) {
                              navigate(link.href);
                            }
                          }}
                          className="text-muted-foreground hover:text-primary py-1.5 font-medium transition-colors cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          {link.label}
                        </button>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
              
              
            </div>
          </div>
          {/* Right side */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm font-medium hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    if (onReservationsClick) onReservationsClick();
                  }}
                >
                  <span>Mes Réservations</span>
                </Button>
              )}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {(user.role ?? "").toUpperCase() === "ADMIN" && (
                      <DropdownMenuItem
                        onClick={() => navigate('/dashboard')}
                        className="cursor-pointer"
                      >
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        if (onLogout) onLogout();
                      }}
                      className="cursor-pointer"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                    onClick={() => navigate('/register')}
                  >
                    Sign up
                  </Button>

                  <Button
                    size="sm"
                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault();
                      if (onSignInClick) onSignInClick();
                    }}
                  >
                    {signInText}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    );
  }
);

Navbar04.displayName = "Navbar04";

export {  HamburgerIcon };
