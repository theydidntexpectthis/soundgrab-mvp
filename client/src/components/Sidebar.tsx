import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, Search, History, Download, Settings, 
  Headphones, Menu, X 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: History, label: "Recent", path: "/recent" },
    { icon: Download, label: "Downloads", path: "/downloads" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <aside className={cn(
      "w-full md:w-64 bg-surface p-4 z-10",
      "md:fixed md:h-screen md:overflow-y-auto",
      "transition-all duration-300 ease-in-out",
      isOpen ? "fixed inset-0 h-screen overflow-y-auto" : "hidden md:block"
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Headphones className="text-primary h-6 w-6 mr-2" />
          <h1 className="font-heading font-bold text-xl text-text-primary">SoundGrab</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden text-text-primary" 
          onClick={onToggle}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      <nav className="mb-8">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className={cn(
                  "flex items-center p-2 rounded-lg group transition-all",
                  isActive(item.path) 
                    ? "bg-surface-light text-primary" 
                    : "hover:bg-surface-light text-text-primary"
                )}>
                <item.icon className="w-6 h-6 mr-2" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Ad Placement - Sidebar */}
      <div className="bg-surface-light rounded-lg p-3 mb-6">
        <p className="text-xs text-text-secondary mb-2">Sponsored</p>
        <div className="text-sm mb-2">Premium Audio Tools</div>
        <p className="text-xs text-text-secondary">Enhance your music experience with our premium tools.</p>
        <Button 
          variant="outline"
          className="mt-2 text-xs bg-accent text-white px-3 py-1 rounded-full"
        >
          Learn More
        </Button>
      </div>
      
      <div className="mt-auto">
        <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
          <h3 className="font-heading font-semibold text-sm mb-2">Go Premium</h3>
          <p className="text-xs text-text-secondary mb-3">Download unlimited tracks, ad-free experience.</p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white text-xs font-medium py-1 px-3 rounded-full transition-all"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </aside>
  );
}
