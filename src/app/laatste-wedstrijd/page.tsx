"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Pomocnicza funkcja do kompresji zdjęć po stronie przeglądarki przed wysłaniem na serwer
function compressImage(file: File, maxWidth = 1200): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          } else {
            resolve(file); // fallback
          }
        }, 'image/jpeg', 0.8);
      };
    };
  });
}

export default function Home() {
  const [cloudPhotos, setCloudPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Pobieranie zdjęć z chmury po wejściu na stronę
  useEffect(() => {
    fetch('https://res.cloudinary.com/drclgmym/image/list/haasdonk.json?v=' + Date.now(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.resources) {
          const urls = data.resources.map((r: any) => 
            `https://res.cloudinary.com/drclgmym/image/upload/v${r.version}/${r.public_id}.${r.format}`
          );
          setCloudPhotos(urls);
        }
      })
      .catch(err => console.error('Error fetching gallery:', err));
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const filesArray = Array.from(e.target.files);
    const newUrls: string[] = [];
    
    for (const file of filesArray) {
      try {
        const compressedFile = await compressImage(file);
        
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("upload_preset", "Haasdonk");
        formData.append("tags", "haasdonk"); // Ważne: tag pozwala odnaleźć te zdjęcia na liście

        const res = await fetch("https://api.cloudinary.com/v1_1/drclgmym/image/upload", {
          method: "POST",
          body: formData
        });
        
        const data = await res.json();
        if (data.secure_url) {
          newUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    
    // Dodajemy nowe zdjęcia na początek galerii
    if (newUrls.length > 0) {
      setCloudPhotos(prev => [...newUrls, ...prev]);
    }
    
    setIsUploading(false);
  };

  const scorers = [
    { name: "Gaston", goals: 10 },
    { name: "Noah", goals: 2 },
    { name: "Joachim", goals: 1 },
    { name: "Lucas", goals: 1 },
    { name: "Basiel", goals: 1 },
  ];

  return (
    <div className="p-4 md:p-12 overflow-y-auto w-full h-full relative z-10">
      <header className="mb-8 md:mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-red-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-1 md:mb-2">Seizoen 2026</h2>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Wedstrijd<span className="text-red-600">verslag</span>
          </h1>
        </div>
      </header>

      {/* MATCH SCOREBOARD */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-red-400"></div>
        
        <div className="p-4 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          {/* Away Team */}
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-lg md:text-2xl font-bold text-slate-500 uppercase tracking-wide">City Pirates<br className="hidden md:block"/> Antwerpen</h3>
          </div>
          
          {/* Score */}
          <div className="shrink-0 flex items-center justify-center gap-2 md:gap-4 bg-slate-50 px-4 md:px-8 py-4 md:py-6 rounded-2xl border border-slate-100 shadow-inner w-full md:w-auto">
            <div className="text-4xl md:text-7xl font-black text-slate-700">5</div>
            <div className="text-2xl md:text-3xl text-slate-300 font-black">-</div>
            <div className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800 drop-shadow-sm">15</div>
          </div>

          {/* Home Team */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-wide">HRS<br className="hidden md:block"/> Haasdonk</h3>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
          Zaterdag 5 September — Competitie
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* SCORERS */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-red-50 text-red-600 p-2.5 rounded-xl border border-red-100 shadow-sm">⚽</span> Doelpuntenmakers
          </h3>
          <ul className="space-y-3">
            {scorers.map((s, i) => (
              <li key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:bg-red-50 hover:border-red-100">
                <span className="font-bold text-slate-700">{s.name}</span>
                <span className="bg-white border border-red-200 text-red-700 px-3 py-1 rounded-lg font-black text-sm shadow-sm">
                  {s.goals}x
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* FEATURED MATCH PHOTO */}
        <div className="lg:col-span-2 relative aspect-[16/9] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-200 group bg-slate-200">
          <Image 
            src="/images/match1.jpg" 
            alt="Wedstrijd foto" 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-white font-black text-2xl drop-shadow-md">Team foto na de overwinning!</p>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Fotogalerij</h2>
          <p className="text-slate-500 mt-1 font-medium">Zdjęcia z chmury (widoczne dla wszystkich)</p>
        </div>
        <label className={`mt-4 md:mt-0 ${isUploading ? 'bg-slate-400 cursor-wait' : 'bg-red-600 hover:bg-red-700 cursor-pointer'} text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5`}>
          {isUploading ? "Trwa wysyłanie..." : "+ Dodaj zdjęcia"}
          <input type="file" multiple accept="image/*" className="hidden" disabled={isUploading} onChange={handlePhotoUpload} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 group bg-slate-200">
          <Image src="/images/match1.jpg" alt="Gallery" fill className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
        </div>
        
        {cloudPhotos.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 group bg-slate-200">
            <Image src={url} alt="Cloud Upload" fill className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
