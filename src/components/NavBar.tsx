
import React, { useState, useEffect } from 'react';
import { Moon, Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 transition-all-300",
        scrolled 
          ? "py-3 glass" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <a 
          href="/" 
          className="text-xl font-medium tracking-tight text-gradient relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-accent after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
        >
          SleepCycle
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full glass-light text-primary hover:text-accent transition-all-200"
            aria-label="Toggle theme"
          >
            <Moon size={18} />
          </button>
          
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full glass-light text-primary hover:text-accent transition-all-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden absolute top-full left-0 w-full glass py-4 px-6 flex flex-col space-y-4 transition-all duration-300 ease-in-out",
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <NavLinks vertical />
      </div>
    </nav>
  );
};

const NavLinks = ({ vertical = false }: { vertical?: boolean }) => {
  const links = [
    { text: "Calculator", href: "#calculator" },
    { text: "Sleep Cycles", href: "#cycles" },
    { text: "Tips", href: "#tips" },
  ];
  
  return (
    <>
      {links.map(link => (
        <a
          key={link.text}
          href={link.href}
          className={cn(
            "relative text-foreground/80 hover:text-foreground transition-all-200 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300",
            vertical ? "block py-2" : "inline-block"
          )}
        >
          {link.text}
        </a>
      ))}
    </>
  );
};

export default NavBar;
