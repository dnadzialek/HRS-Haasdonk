import re

with open('src/app/laatste-wedstrijd/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add states
code = re.sub(
    r'const \[isUploading, setIsUploading\] = useState\(false\);',
    r'const [isUploading, setIsUploading] = useState(false);\n  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);',
    code
)

# Add allPhotos variable before return
code = re.sub(
    r'return \(',
    r'''const allPhotos = ["/images/match1.jpg", ...cloudPhotos];

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % allPhotos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + allPhotos.length) % allPhotos.length);
  };

  return (''',
    code
)

# Replace the gallery rendering with mapping over allPhotos and adding onClick
code = re.sub(
    r'<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">[\s\S]*?</div>\s*</div>\s*\);\s*}',
    r'''<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
        {allPhotos.map((url, i) => (
          <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 group bg-slate-200 cursor-pointer">
            <Image src={url} alt={`Gallery ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-6 right-6 text-white text-4xl font-light hover:text-red-500 transition-colors z-50 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full" onClick={() => setLightboxIndex(null)}>
            &times;
          </button>
          
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl p-4 hover:bg-white/10 rounded-full transition-colors z-50 w-14 h-14 flex items-center justify-center" onClick={prevPhoto}>
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
          
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl p-4 hover:bg-white/10 rounded-full transition-colors z-50 w-14 h-14 flex items-center justify-center" onClick={nextPhoto}>
            &#10095;
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm">
            {lightboxIndex + 1} / {allPhotos.length}
          </div>
        </div>
      )}
    </div>
  );
}''',
    code
)

with open('src/app/laatste-wedstrijd/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
