import { Edit2, Trash2 } from "lucide-react"

import { Button } from "./ui/button"

export function TaskCard() {
  return (
    <div className="w-full border border-gray-500 rounded-sm p-3 space-y-6 md:h-auto">
      <div className="w-full flex items-center justify-between">
        <span className="font-heading font-semibold text-lg text-gray-900">
          Tarefa 1
        </span>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">
            Início: 15:00
          </span>
        
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              Status: Em andamento
            </span>

            <div className="w-4 h-4 rounded-full bg-blue-500" />
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4">
        <p className="font-sans font-normal text-sm text-gray-600 md:text-xs">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
          non neque quam. Donec vel tincidunt dolor. Sed id lectus 
          nec enim tincidunt vestibulum.
        </p>

        <div className="flex items-center gap-3">
          <Button>
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}