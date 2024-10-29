import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/useTheme";

export default function ModeToggle() {
  const { mode, setMode } = useTheme();

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost" 
      className="h-8 w-8 p-2 rounded-full"
      onClick={toggleTheme}
    >
      {mode === "dark" ? (
        <Sun className="h-8 w-8" color={mode === "dark" ? "white" : "black"} />
      ) : (
        <Moon className="h-8 w-8" color={mode === "dark" ? "white" : "black"} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
