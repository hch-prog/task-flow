import { Search } from "lucide-react"
import { Input } from "./ui/input"


export const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
    return (
        <div className="relative mb-4">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <Input
                className="bg-white py-2 pl-10 w-full"
                placeholder="Search tasks..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    )
}