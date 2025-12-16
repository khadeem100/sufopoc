"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bug, X } from "lucide-react"

export function DevelopmentNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check if user has already seen the notice
    const hasSeenNotice = localStorage.getItem("development-notice-seen")
    
    if (!hasSeenNotice) {
      // Show the notice after a short delay for better UX
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    // Remember that user has seen the notice
    localStorage.setItem("development-notice-seen", "true")
  }

  const handleDontShowAgain = () => {
    setOpen(false)
    // Remember that user has seen the notice and doesn't want to see it again
    localStorage.setItem("development-notice-seen", "true")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-gray-700" />
            </div>
            <DialogTitle>Website Under Development</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            This website is currently under active development. You may encounter bugs or incomplete features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Bug className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                If you notice any issues or bugs, please report them using the bug report button 
                (bottom right corner) or contact us directly. Your feedback helps us improve!
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDontShowAgain}
            className="w-full sm:w-auto"
          >
            Don&apos;t show again
          </Button>
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto bg-black hover:bg-gray-800"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

