import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { ComingSoon } from "@/components/ui/coming-soon";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b-3 border-black bg-secondary-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="group">
          <Badge 
            variant="default" 
            className="text-lg sm:text-xl font-bold px-2 py-1 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer"
          >
            Here&apos;s the Jump!
          </Badge>
        </Link>
        <nav className="flex items-center space-x-4">
          <ThemeToggle />
          {/* <ComingSoon size="xs" position="top-right" badgeColor="bg-main"> */}
          <Button variant="neutral" size="sm" disabled>
            Submit Movie
          </Button>
          {/* </ComingSoon> */}
        </nav>
      </div>
    </header>
  );
}
