import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/reel", label: "Reel" },
    { to: "/", label: "Photos" },
    { to: "/resume", label: "Resume" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <div className={'flex flex-col space-y-4 items-center justify-center'}>
            <h1 className="text-2xl font-bold uppercase tracking-[0.2rem] text-center">Sharbel Habchy</h1>
            <div className="flex gap-8">
              {links.map((link) => (
                  <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                          "text-sm font-medium tracking-widest transition-colors phover:text-primary uppercase",
                          location.pathname === link.to
                              ? "text-primary"
                              : "text-foreground/70"
                      )}
                  >
                    {link.label}
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
