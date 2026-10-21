import { Link, Outlet, useLocation } from "react-router-dom"
import { type User } from "firebase/auth"
import { GitBranch, Globe, LayoutDashboard, Link2, Rocket, Settings as SettingsIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/connect", label: "Connect", icon: Link2 },
  { to: "/repos", label: "Repositories", icon: GitBranch },
  { to: "/projects", label: "Projects", icon: Rocket },
  { to: "/domains", label: "Domains", icon: Globe },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
]

export default function Layout({ user }: { user: User }) {
  const { pathname } = useLocation()
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex-row items-center gap-3 p-4">
          <Avatar className="size-9">
            <AvatarImage src="/apleemaofficial.png" alt="Apleema" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">Apleema</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((n) => (
                  <SidebarMenuItem key={n.to}>
                    <SidebarMenuButton asChild isActive={pathname === n.to}>
                      <Link to={n.to}>
                        <n.icon />
                        <span>{n.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="border-t p-4">
          <p className="truncate text-xs text-muted-foreground" title={user.email || ""}>
            {user.email || user.displayName || "Signed-in account"}
          </p>
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="font-medium">Apleema</span>
        </header>
        <main className="mx-auto w-full max-w-5xl p-4 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
