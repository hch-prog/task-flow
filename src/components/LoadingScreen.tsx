'use client'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#f9fafb]">
      <div className="flex flex-col items-center space-y-4">
        <div className="border-4 border-gray-200 border-t-gray-700 rounded-full w-12 h-12 animate-spin" />
        <p className="font-medium text-gray-700">Loading your board...</p>
      </div>
    </div>
  )
} 