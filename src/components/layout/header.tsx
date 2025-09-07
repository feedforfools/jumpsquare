import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { ComingSoon } from "@/components/ui/coming-soon";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b-2 border-black bg-app-surface">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-brand-red">
          Here&apos;s the Jump!
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
