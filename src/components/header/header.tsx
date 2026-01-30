'use client'

import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu as MenuIcon } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { useProfileVisibility } from '@/hooks/use-profile-visibility'

interface MenuItem {
  label: string
  href: string
  collapsedMobile: boolean
}

const menuItems: Array<MenuItem> = [
  { label: 'About', href: '/about', collapsedMobile: true },
  { label: 'Now', href: '/now', collapsedMobile: true },
  { label: 'Project', href: '/project', collapsedMobile: true },
  { label: 'Writing', href: '/writing', collapsedMobile: true },
  { label: 'Contact', href: '/contact', collapsedMobile: true },
]

export function Header() {
  const { isProfileVisible } = useProfileVisibility()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const collapsedItems = menuItems.filter((item) => item.collapsedMobile)
  const visibleMobileItems = menuItems.filter((item) => !item.collapsedMobile)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isProfileVisible
          ? 'pointer-events-none -translate-y-full opacity-0'
          : 'pointer-events-auto translate-y-0 opacity-100',
      )}
    >
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {/* Logomark - Profile picture */}
            <div className="relative size-10 shrink-0 overflow-hidden rounded-sm border border-border bg-card p-0.5">
              <div className="relative h-full w-full overflow-hidden rounded-[2px]">
                <img
                  src="/images/profile_picture.webp"
                  alt="Donnie Silalahi"
                  className="h-full w-full scale-[1.8] rounded-[2px] object-cover object-[50%_30%]"
                />
              </div>
            </div>

            {/* Logotype - Signature (hidden on mobile) */}
            <span className="hidden font-italianno text-2xl leading-6 text-foreground md:block">
              Donnie
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Desktop menu */}
            <div className="hidden items-center gap-1 md:flex">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  render={<Link to={item.href} />}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Mobile menu items that stay visible */}
            <div className="flex items-center gap-1 md:hidden">
              {visibleMobileItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  render={<Link to={item.href} />}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Mobile menu dropdown */}
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                className="md:hidden"
                render={<Button variant="ghost" size="sm" />}
              >
                <MenuIcon className="size-4" />
                Menu
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                {collapsedItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    render={<Link to={item.href} />}
                    onSelect={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle - always visible */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </nav>
        </div>
      </div>
    </header>
  )
}
