import {
  ExternalLink,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  RotateCcw,
} from 'lucide-react'
import content from './content.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const FigmarefHomepage = (): JSX.Element => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primitives-colors-gray-light-mode-50 p-8">
      <div className="flex flex-col items-center w-full max-w-3xl gap-8">
        <header className="flex flex-col items-center gap-4 w-full">
          <Avatar className="w-16 h-16">
            <AvatarImage src="" alt="Donnie Silalahi" />
            <AvatarFallback className="bg-primitives-colors-gray-light-mode-300 text-primitives-colors-gray-light-mode-700">
              DS
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-semibold text-primitives-colors-gray-light-mode-900">
              Donnie Silalahi
            </h1>
            <p className="text-sm text-primitives-colors-gray-light-mode-600">
              Product Builder, Growth Marketer and Operations Leader
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Button variant="outline" size="sm" className="h-auto px-4 py-2">
              <Mail className="w-4 h-4 mr-2" />
              Send email
            </Button>
            <Button variant="outline" size="sm" className="h-auto px-4 py-2">
              <LinkIcon className="w-4 h-4 mr-2" />
              Connect
            </Button>
            <Button variant="outline" size="sm" className="h-auto px-4 py-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Say hi
            </Button>
          </div>
        </header>

        <Card className="w-full overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="relative">
              <img
                className="w-full h-auto"
                alt="Postcard - Are you living your dreams? Silalahi, Toba Lakeside, 2021"
                src={content}
              />
            </div>
          </CardContent>
        </Card>

        <footer className="flex items-center justify-between w-full">
          <span className="text-sm text-primitives-colors-gray-light-mode-600">
            Postcard
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-auto px-3 py-2">
              <RotateCcw className="w-4 h-4 mr-2" />
              Flip
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-auto px-4 py-2 bg-primitives-colors-gray-light-mode-800 hover:bg-primitives-colors-gray-light-mode-900"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default FigmarefHomepage
