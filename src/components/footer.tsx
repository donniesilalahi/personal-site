import { HugeiconsIcon } from '@hugeicons/react'
import {
  Linkedin01Icon,
  NewTwitterRectangleIcon,
} from '@hugeicons/core-free-icons'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer id="contact" className="w-full border-t border-border bg-background/50 py-12 mt-16">
      <div className="mx-auto max-w-[720px] px-4">
        <div className="flex flex-col gap-8">
          {/* Contact Group - Vertical */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-secondary-foreground hover:text-foreground"
                render={<a href="mailto:donniesilalahi@gmail.com" />}
              >
                Email
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-secondary-foreground hover:text-foreground"
                render={
                  <a
                    href="https://linkedin.com/in/donniesilalahi"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <HugeiconsIcon icon={Linkedin01Icon} size={16} />
                Connect
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-secondary-foreground hover:text-foreground"
                render={
                  <a
                    href="https://x.com/donniesilalahi"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <HugeiconsIcon icon={NewTwitterRectangleIcon} size={16} />
                Say hi
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Additional Links - Horizontal */}
          <div className="flex flex-wrap gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary-foreground hover:text-foreground"
              render={<Link to="/ai" />}
            >
              AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary-foreground hover:text-foreground"
              render={<Link to="/colophon" />}
            >
              Colophone
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-xs text-tertiary-foreground">
            © {new Date().getFullYear()} Donnie Silalahi. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
