import { Boxes } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Boxes className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold text-gray-900">TaskFlow</span>
    </div>
  )
}

