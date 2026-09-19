"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const MATCHES = [
  {
    id: 0,
    date: "Zaterdag 19 September — Competitie",
    homeTeam: "Ws Meerdonk",
    awayTeam: "HRS Haasdonk",
    homeScore: 8,
    awayScore: 17,
    scorers: [
      { name: "Gaston", goals: 9 },
      { name: "Viny", goals: 4 },
      { name: "Joachim", goals: 2 },
      { name: "Tristan", goals: 1 },
      { name: "Niya", goals: 1 },
    ],
    featuredImage: null,
    showCloudGallery: true,
    cloudinaryTag: "meerdonk"
  },
  {
    id: 1,
    date: "Zaterdag 12 September — Competitie",
    homeTeam: "HRS Haasdonk",
    awayTeam: "Zwijndrecht",
    homeScore: 8,
    awayScore: 4,
    scorers: [
      { name: "Gaston", goals: 5 },
      { name: "Viny", goals: 3 },
    ],
    featuredImage: null,
    showCloudGallery: true,
    cloudinaryTag: "zwijndrecht"
  },
  {
    id: 2,
    date: "Zaterdag 5 September — Competitie",
    homeTeam: "City Pirates",
    awayTeam: "HRS Haasdonk",
    homeScore: 5,
    awayScore: 15,
    scorers: [
      { name: "Gaston", goals: 10 },
      { name: "Noah", goals: 2 },
      { name: "Joachim", goals: 1 },
      { name: "Lucas", goals: 1 },
      { name: "Basiel", goals: 1 },
    ],
    featuredImage: "/images/match1.jpg",
    showCloudGallery: true,
    cloudinaryTag: "haasdonk"
  }
];

export default function Home() {
  const [expandedMatch, setExpandedMatch] = useState<number | null>(0);
  const [galleries, setGalleries] = useState<Record<string, string[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    MATCHES.forEach(match => {
      if (match.showCloudGallery && match.cloudinaryTag) {
        fetch(`https://res.cloudinary.com/drclgmym/image/list/${match.cloudinaryTag}.json?v=` + Date.now(), { cache: 'no-store' })
          .then(res => res.json())
          .then(data => {
            if (data.resources) {
              const urls = data.resources.map((r: any) => 
                `https://res.cloudinary.com/drclgmym/image/upload/v${r.version}/${r.public_id}.${r.format}`
              );
              setGalleries(prev => ({ ...prev, [match.cloudinaryTag]: urls }));
            }
          })
          .catch(err => console.error(`Error fetching gallery for ${match.cloudinaryTag}:`, err));
      }
    });
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const filesArray = Array.from(e.target.files);
    const newUrls: string[] = [];
    
    for (const file of filesArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Haasdonk");
        formData.append("tags", tag);

        const res = await fetch("https://api.cloudinary.com/v1_1/drclgmym/image/upload", {
          method: "POST",
          body: formData
        });
        
        const data = await res.json();
        if (data.secure_url) {
          newUrls.push(data.secure_url);
        } else if (data.error) {
          alert("Cloudinary fout: " + data.error.message + " Zorg ervoor dat de upload preset 'Haasdonk' bestaat en is ingesteld op Unsigned!");
        }
      } catch (error) {
        alert("Er is een fout opgetreden bij het uploaden. Controleer de verbinding. " + error);
        console.error("Upload error:", error);
      }
    }
    
    if (newUrls.length > 0) {
      setGalleries(prev => ({ 
        ...prev, 
        [tag]: [...newUrls, ...(prev[tag] || [])] 
      }));
    }
    
    setIsUploading(false);
  };

  return (
    <div className="p-4 md:p-12 overflow-y-auto w-full h-full relative z-10">
      <header className="mb-8 md:mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-red-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-1 md:mb-2">Seizoen 2026</h2>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Laatste <span className="text-red-600">Wedstrijden</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-col gap-6 pb-20">
        {MATCHES.map(match => {
          const isExpanded = expandedMatch === match.id;
          
          let allPhotos: string[] = [];
          if (match.featuredImage) allPhotos.push(match.featuredImage);
          if (match.showCloudGallery && match.cloudinaryTag) {
            allPhotos = [...allPhotos, ...(galleries[match.cloudinaryTag] || [])];
          }

          return (
            <div key={match.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative transition-all duration-300">
              {/* Header (Clickable) */}
              <div 
                className="cursor-pointer relative p-4 md:p-8 hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-red-400"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                  <div className="flex-1 text-center md:text-right">
                    <h3 className={`text-lg md:text-2xl font-bold uppercase tracking-wide ${match.homeScore < match.awayScore ? 'text-slate-400' : 'text-slate-900'}`}>
                      {match.homeTeam}
                    </h3>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-center gap-2 md:gap-4 bg-slate-50 px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-slate-100 shadow-inner w-full md:w-auto">
                    <div className={`text-3xl md:text-5xl font-black ${match.homeScore > match.awayScore ? 'text-red-600' : 'text-slate-700'}`}>{match.homeScore}</div>
                    <div className="text-xl md:text-2xl text-slate-300 font-black">-</div>
                    <div className={`text-3xl md:text-5xl font-black ${match.awayScore > match.homeScore ? 'text-red-600' : 'text-slate-700'}`}>{match.awayScore}</div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className={`text-lg md:text-2xl font-bold uppercase tracking-wide ${match.awayScore < match.homeScore ? 'text-slate-400' : 'text-slate-900'}`}>
                      {match.awayTeam}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  {match.date}
                  <span className="ml-2 text-lg">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 md:p-8 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* SCORERS */}
                    <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="bg-red-50 text-red-600 p-2.5 rounded-xl border border-red-100 shadow-sm">⚽</span> Doelpuntenmakers
                      </h3>
                      <ul className="space-y-3">
                        {match.scorers.map((s, i) => (
                          <li key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:bg-red-50 hover:border-red-100">
                            <span className="font-bold text-slate-700">{s.name}</span>
                            <span className="bg-white border border-red-200 text-red-700 px-3 py-1 rounded-lg font-black text-sm shadow-sm">
                              {s.goals}x
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* GALLERY / IMAGES */}
                    <div className="lg:col-span-2">
                      {match.showCloudGallery && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          <div>
                            <h2 className="text-xl font-black text-slate-900">Fotogalerij</h2>
                            <p className="text-slate-500 text-sm font-medium">Foto&apos;s uit de cloud</p>
                          </div>
                          <label className={`mt-4 sm:mt-0 ${isUploading ? 'bg-slate-400 cursor-wait' : 'bg-red-600 hover:bg-red-700 cursor-pointer'} text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md text-sm shrink-0`}>
                            {isUploading ? "Uploaden..." : "+ Foto's toevoegen"}
                            <input type="file" multiple accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => handlePhotoUpload(e, match.cloudinaryTag!)} />
                          </label>
                        </div>
                      )}

                      {!match.showCloudGallery && match.featuredImage && (
                        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          <h2 className="text-xl font-black text-slate-900">Uitgelichte Foto</h2>
                        </div>
                      )}

                      {allPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {allPhotos.map((url, i) => (
                            <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 group bg-slate-200 cursor-pointer">
                              <Image src={url} alt={`Gallery ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                         <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-3xl border border-slate-200 border-dashed">
                           Geen foto's nog.
                         </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* LIGHTBOX FOR THIS MATCH */}
              {isExpanded && lightboxIndex !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
                  <button className="absolute top-6 right-6 text-white text-4xl font-light hover:text-red-500 transition-colors z-50 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full" onClick={() => setLightboxIndex(null)}>
                    &times;
                  </button>
                  
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl p-4 hover:bg-white/10 rounded-full transition-colors z-50 w-14 h-14 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + allPhotos.length) % allPhotos.length); }}>
                    &#10094;
                  </button>
                  
                  <div className="relative w-[90vw] h-[80vh] flex items-center justify-center select-none" onClick={(e) => e.stopPropagation()}>
                    <Image 
                      src={allPhotos[lightboxIndex]} 
                      alt="Enlarged photo" 
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl p-4 hover:bg-white/10 rounded-full transition-colors z-50 w-14 h-14 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % allPhotos.length); }}>
                    &#10095;
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm">
                    {lightboxIndex + 1} / {allPhotos.length}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
