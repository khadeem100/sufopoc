"use client"

import React, { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  links: Array<{
    label: string
    href: string
    icon: React.ReactNode
  }>
  user: {
    name: string | null
    email: string
    image?: string | null
  }
  logo?: React.ReactNode
  logoIcon?: React.ReactNode
}

function UserProfile({ user }: { user: DashboardLayoutProps['user'] }) {
  const { open } = useSidebar()
  
  return (
    <div className="flex items-center gap-2 py-2">
      {user.image ? (
        <Image
          src={user.image}
          className="h-7 w-7 flex-shrink-0 rounded-full"
          width={50}
          height={50}
          alt="Avatar"
        />
      ) : (
        <div className="h-7 w-7 flex-shrink-0 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
          {(user.name || user.email).charAt(0).toUpperCase()}
        </div>
      )}
      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="text-black text-sm whitespace-pre inline-block !p-0 !m-0"
      >
        {user.name || user.email}
      </motion.span>
    </div>
  )
}

function LogoSection({ open, logo, logoIcon }: { open: boolean; logo?: React.ReactNode; logoIcon?: React.ReactNode }) {
  return open ? (logo || <DefaultLogo />) : (logoIcon || <DefaultLogoIcon />)
}

export function DashboardLayout({ children, links, user, logo, logoIcon }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <LogoSection open={open} logo={logo} logoIcon={logoIcon} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <UserProfile user={user} />
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-auto">
        <div className="p-4 md:p-8 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

const DefaultLogo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre"
      >
        Job Platform
      </motion.span>
    </div>
  )
}

const DefaultLogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  )
}

