
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type FontOption = {
  name: string;
  className: string;
  family: string;
};

const fontOptions: FontOption[] = [
  { name: 'Poppins', className: 'font-poppins', family: "'Poppins', sans-serif" },
  { name: 'Montserrat', className: 'font-montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Quicksand', className: 'font-quicksand', family: "'Quicksand', sans-serif" },
  { name: 'Raleway', className: 'font-raleway', family: "'Raleway', sans-serif" },
  { name: 'Space Grotesk', className: 'font-space-grotesk', family: "'Space Grotesk', sans-serif" },
  { name: 'Nunito', className: 'font-nunito', family: "'Nunito', sans-serif" },
  { name: 'Inter', className: 'font-inter', family: "'Inter', sans-serif" },
  { name: 'Rubik', className: 'font-rubik', family: "'Rubik', sans-serif" },
  { name: 'DM Sans', className: 'font-dm-sans', family: "'DM Sans', sans-serif" },
  { name: 'Playfair Display', className: 'font-playfair', family: "'Playfair Display', serif" },
];

const FontSelector = () => {
  const [selectedFont, setSelectedFont] = useState<string>(fontOptions[0].name);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const selectFont = (fontName: string) => {
    setSelectedFont(fontName);
    setMenuOpen(false);
    
    // Apply font to the entire body
    document.body.className = '';
    const font = fontOptions.find(f => f.name === fontName);
    if (font) {
      document.body.classList.add(font.className);
    }
  };

  return (
    <header className="py-4 px-6 glass border-b border-white/10 mb-6">
      <div className="container max-w-4xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-gradient">Font Preview</div>
        
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="glass-light px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>Font: {selectedFont}</span>
          </button>
          
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 z-50 w-64 glass rounded-lg p-2 border border-white/10">
              <div className="max-h-80 overflow-y-auto">
                {fontOptions.map((font) => (
                  <button
                    key={font.name}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md transition-all-200 flex items-center justify-between",
                      selectedFont === font.name ? "bg-secondary text-foreground" : "hover:bg-secondary/50",
                      font.className
                    )}
                    onClick={() => selectFont(font.name)}
                  >
                    <span>{font.name}</span>
                    {selectedFont === font.name && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default FontSelector;
