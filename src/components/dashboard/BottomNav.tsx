import { LayoutGrid, Star, Clock, Settings } from "lucide-react";
import { ReactNode } from "react";

export type NavTab = "all" | "starred" | "recent" | "settings";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  centerButton: ReactNode;
}

export default function BottomNav({ activeTab, onTabChange, centerButton }: BottomNavProps) {
  const navItems = [
    { id: "all" as const, label: "Workspace", icon: LayoutGrid },
    { id: "starred" as const, label: "Starred", icon: Star },
    // empty placeholder slot for the central AddButton to prevent overlaying text
    { id: "center-gap" as const, label: "", icon: null },
    { id: "recent" as const, label: "Recent", icon: Clock },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:hidden">
      <div className="bg-white/90 backdrop-blur-lg border border-neutral-200/65 rounded-3xl h-16 shadow-xl flex items-center justify-around px-2 relative">
        
        {/* Floating center button positioner */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2">
          {centerButton}
        </div>

        {/* Navigation tabs */}
        {navItems.map((item, index) => {
          if (item.id === "center-gap") {
            return <div key={index} className="w-14 h-full" />; // empty spacer for floating FAB
          }

          const Icon = item.icon!;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center w-12 h-full rounded-2xl relative transition-all focus:outline-none"
            >
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  isActive ? "text-blue-600 stroke-[2.2]" : "text-neutral-400 hover:text-neutral-650"
                }`}
              />
              <span
                className={`text-[9px] font-bold mt-1 transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-neutral-400"
                }`}
              >
                {item.label}
              </span>
              
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
}
