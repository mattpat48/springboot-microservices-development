import { BriefcaseBusiness, LayoutDashboard, Send, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/utenti", label: "Utenti", icon: Users },
  { to: "/offerte", label: "Offerte", icon: BriefcaseBusiness },
  { to: "/candidature", label: "Candidature", icon: Send },
];

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r bg-white px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-pop text-ink">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
          </span>
          <div>
            <p className="font-display text-xl font-bold">OpenJob</p>
            <p className="text-xs text-muted-foreground">Console microservizi</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand-soft hover:text-brand",
                  isActive && "bg-brand text-white hover:bg-brand hover:text-white"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b bg-white/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-pop text-ink">
              <img src="/logo.svg" alt="" className="h-6 w-6" />
            </span>
            <p className="font-display text-lg font-bold">OpenJob</p>
          </div>
          <nav className="grid grid-cols-4 gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "grid min-h-12 place-items-center rounded-md px-1 text-[11px] font-medium text-muted-foreground",
                    isActive && "bg-brand text-white"
                  )
                }
              >
                <item.icon className="mb-0.5 h-4 w-4" />
                <span className="max-w-full truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
