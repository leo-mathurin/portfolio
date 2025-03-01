"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface LanguageContextProps {
  language: string
  setLanguage: (language: string) => void
}

const LanguageContext = React.createContext<LanguageContextProps | undefined>(undefined)

interface LanguageProviderProps {
  readonly children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = React.useState<string>("en")
  
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
    document.documentElement.lang = savedLanguage
  }, [])

  const value = React.useMemo(() => {
    return {
      language,
      setLanguage: (newLanguage: string) => {
        localStorage.setItem("language", newLanguage)
        document.documentElement.lang = newLanguage
        setLanguage(newLanguage)
      }
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  
  return context
}

interface LanguageToggleProps {
  readonly className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("size-12", className)}>
          <Icons.globe className="size-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="space-y-1">
        <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
          <div className="mr-2 flex items-center">
            <Image src="/flags/gb.svg" alt="UK Flag" width={16} height={12} />
          </div>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("fr")} className={language === "fr" ? "bg-accent" : ""}>
          <div className="mr-2 flex items-center">
            <Image src="/flags/fr.svg" alt="France Flag" width={16} height={12} />
          </div>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 