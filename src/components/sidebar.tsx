'use client'

import * as React from 'react'
import { ChevronRight, User, LayoutDashboard, Bird } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type NavItem = {
    title: string
    url: string
    icon?: React.ReactNode
    items?: NavItem[]
}

function hasIcon(item: NavItem): item is { icon: React.ReactNode } & NavItem {
    return item.icon !== undefined
}

const collapsibleNav = {
    navMain: [
        {
            title: 'CRM',
            url: '#',
            icon: <User size={20} />,
            items: [
                { title: 'Contacts', url: '/contacts' },
                { title: 'Companies', url: '/companies' },
            ],
        }
    ],
}

const urlLinks = {
    navMain: [
        { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={20} /> },

    ],
}

function getAllUrls(items: NavItem[]): string[] {
    let urls: string[] = []
    for (const item of items) {
        if (item.url && item.url !== '#') urls.push(item.url)
        if (item.items?.length) urls = urls.concat(getAllUrls(item.items))
    }
    return urls
}

function SidebarLink({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
        <Link href={href} onClick={onClick} className={cn('flex items-center gap-2', className)}>
            {children}
        </Link>
    )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
    const [activeLink, setActiveLink] = useState<string>('')

    const toggleOpen = (key: string, open: boolean) => {
        setOpenStates((prev) => ({ ...prev, [key]: open }))
    }

    const handleLinkClick = (url: string) => {
        setActiveLink(url)
    }

    const getPaddingClass = (level: number) => {
        switch (level) {
            case 0:
                return 'pl-2'
            case 1:
                return 'pl-2'
            case 2:
                return 'pl-6'
            case 3:
                return 'pl-8'
            default:
                return 'pl-10'
        }
    }

    const renderMenuItems = (items: NavItem[], level = 0): React.ReactNode => {
        return items.map((item) => {
            const hasNestedItems = !!item.items?.length
            const isOpen = !!openStates[item.title]
            const isActive = activeLink === item.url
            const paddingClass = getPaddingClass(level)

            return (
                <React.Fragment key={item.title}>
                    {hasNestedItems ? (
                        <Collapsible open={isOpen} onOpenChange={(open: boolean) => toggleOpen(item.title, open)} className="group/collapsible">
                            <div className={cn(paddingClass, 'pr-3')}>
                                <SidebarGroupLabel
                                    asChild
                                    className={cn(
                                        'group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm flex items-center justify-between py-2 rounded-md transition-all duration-200',
                                        isActive && 'bg-primary/10 text-primary font-medium'
                                    )}>
                                    <CollapsibleTrigger
                                        className="w-full text-left flex items-center justify-between"
                                        onClick={() => toggleOpen(item.title, !isOpen)}>
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {hasIcon(item) && item.icon}
                                            <span className="truncate">{item.title}</span>
                                        </div>
                                        <ChevronRight
                                            className={cn('ml-2 shrink-0 transition-transform duration-200', isOpen ? 'rotate-90' : '')}
                                            size={20}
                                        />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent asChild forceMount>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                className="overflow-hidden">
                                                <SidebarGroupContent className="pt-1">
                                                    <SidebarMenu className="space-y-1 border-l-2 border-sidebar-border ml-3 pl-2">
                                                        {renderMenuItems(item.items!, level + 1)}
                                                    </SidebarMenu>
                                                </SidebarGroupContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem className={paddingClass}>
                            <SidebarMenuButton
                                asChild
                                className={cn(
                                    'py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors duration-200',
                                    isActive && 'bg-primary/10 text-primary font-medium'
                                )}
                                onClick={() => handleLinkClick(item.url)}>
                                <SidebarLink href={item.url} onClick={() => handleLinkClick(item.url)}>
                                    {hasIcon(item) && item.icon}
                                    <span className="truncate">{item.title}</span>
                                </SidebarLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </React.Fragment>
            )
        })
    }

    useEffect(() => {
        const allUrls = [...getAllUrls(collapsibleNav.navMain), ...getAllUrls(urlLinks.navMain)]
        allUrls.forEach((url) => {
            router.prefetch(url)
        })
    }, [router])

    return (
        <Sidebar {...props} className="border-r bg-sidebar/95 backdrop-blur supports-backdrop-filter:bg-sidebar/80">
            <SidebarHeader className="p-6">
                <SidebarMenuButton asChild className="p-0! h-auto flex items-center">
                    <SidebarLink href="/" className="inline-flex items-center gap-3 transition-transform duration-200 hover:scale-105">
                        <Bird size={48} className="shrink-0" />
                        <span className="text-base font-semibold">Phoenix</span>
                    </SidebarLink>
                </SidebarMenuButton>
            </SidebarHeader>

            <SidebarContent className="gap-2 p-3 scrollbar-hide">
                <div className="py-2">
                    {urlLinks.navMain.map((item) => (
                        <SidebarGroup key={item.title} className="mb-1">
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                'py-2.5 rounded-md transition-colors duration-200',
                                                activeLink === item.url
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                            )}
                                            onClick={() => handleLinkClick(item.url)}>
                                            <SidebarLink href={item.url} onClick={() => handleLinkClick(item.url)}>
                                                {item.icon && item.icon}
                                                <span className="font-bold truncate">{item.title}</span>
                                            </SidebarLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                    {collapsibleNav.navMain.map((item) => {
                        const isOpen = !!openStates[item.title]
                        const isActive = activeLink === item.url

                        return (
                            <Collapsible
                                key={item.title}
                                open={isOpen}
                                onOpenChange={(open: boolean) => toggleOpen(item.title, open)}
                                className="group/collapsible mb-1">
                                <SidebarGroup>
                                    <SidebarGroupLabel
                                        asChild
                                        className={cn(
                                            'group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm flex items-center justify-between py-2.5 rounded-md transition-colors duration-200 pr-3',
                                            isActive && 'bg-primary/10 text-primary font-medium'
                                        )}>
                                        <CollapsibleTrigger
                                            className="w-full flex items-center justify-between"
                                            onClick={() => toggleOpen(item.title, !isOpen)}>
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                {hasIcon(item) && item.icon}
                                                <span className="font-bold truncate">{item.title}</span>
                                            </div>
                                            <ChevronRight
                                                className={cn('ml-2 shrink-0 transition-transform duration-200', isOpen ? 'rotate-90' : '')}
                                                size={20}
                                            />
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>

                                    <CollapsibleContent asChild forceMount>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                    className="overflow-hidden">
                                                    <SidebarGroupContent className="pt-1">
                                                        <SidebarMenu className="space-y-1 border-l-2 border-sidebar-border ml-3 pl-2">
                                                            {renderMenuItems(item.items || [])}
                                                        </SidebarMenu>
                                                    </SidebarGroupContent>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>
                        )
                    })}


                </div>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
