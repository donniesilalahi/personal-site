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
  { label: 'Writing', href: '/writings', collapsedMobile: true },
  { label: 'Contact', href: '#contact', collapsedMobile: true },
]

const LOGO_SIZE_LARGE = 64
const LOGO_SIZE_SMALL = 40
const HEADER_HEIGHT_LARGE = 80
const HEADER_HEIGHT_SMALL = 56

export function Header() {
  const { scrollProgress, isHomePage } = useProfileVisibility()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const collapsedItems = menuItems.filter((item) => item.collapsedMobile)
  const visibleMobileItems = menuItems.filter((item) => !item.collapsedMobile)

  const logoSize = LOGO_SIZE_LARGE - (LOGO_SIZE_LARGE - LOGO_SIZE_SMALL) * scrollProgress

  const headerHeight = HEADER_HEIGHT_LARGE - (HEADER_HEIGHT_LARGE - HEADER_HEIGHT_SMALL) * scrollProgress

  const showBorder = scrollProgress > 0

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Header background */}
      <div
        className={cn(
          'absolute inset-0 bg-background/80 backdrop-blur-md border-b transition-colors duration-300',
          showBorder ? 'border-border' : 'border-transparent',
        )}
      />

      <div
        className="relative mx-auto flex max-w-[720px] items-center justify-between px-4 transition-all duration-300 ease-out"
        style={{ height: headerHeight }}
      >
        {/* Logo - Profile picture with size animation */}
        <Link to="/" className="flex items-center">
          <div
            className="group relative shrink-0 overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 ease-out"
            style={{
              width: logoSize,
              height: logoSize,
              padding: isHomePage ? 4 * (1 - scrollProgress * 0.5) : 2,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2px]">
              <img
                src="/images/profile_picture.webp"
                alt="Donnie Silalahi"
                className="h-full w-full scale-[1.8] rounded-[2px] object-cover object-[50%_30%] transition-transform duration-300 group-hover:scale-[2.4]"
              />

              {/* Texture overlay - paper-like effect */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='texture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23texture)'/%3E%3C/svg%3E")`,
                  opacity: 0.04,
                  mixBlendMode: 'overlay',
                }}
                aria-hidden="true"
              />

              {/* Noise overlay - grainy film effect */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.1,
                  mixBlendMode: 'soft-light',
                  backgroundColor: 'rgba(246, 243, 241, 0.1)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
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
                className="font-normal text-secondary-foreground hover:text-foreground"
                render={
                  item.href.startsWith('#') ? (
                    <a href={item.href} />
                  ) : (
                    <Link to={item.href} />
                  )
                }
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
                className="font-normal text-secondary-foreground hover:text-foreground"
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
                  render={
                    item.href.startsWith('#') ? (
                      <a href={item.href} />
                    ) : (
                      <Link to={item.href} />
                    )
                  }
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
    </header>
  )
}
