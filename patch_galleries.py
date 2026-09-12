import re

with open('src/app/laatste-wedstrijd/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update MATCHES array
matches_str = '''const MATCHES = [
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
];'''

code = re.sub(r'const MATCHES = \[\s*\{.*showCloudGallery: false\s*\}\s*\];', matches_str, code, flags=re.DOTALL)

# 2. Update states and useEffect
state_and_effect_old = '''  const [expandedMatch, setExpandedMatch] = useState<number | null>(1); // 1 expanded by default
  const [cloudPhotos, setCloudPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
  }, []);'''

state_and_effect_new = '''  const [expandedMatch, setExpandedMatch] = useState<number | null>(1);
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
  }, []);'''

code = code.replace(state_and_effect_old, state_and_effect_new)

# 3. Update handlePhotoUpload signature and logic
upload_old = '''  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const filesArray = Array.from(e.target.files);
    const newUrls: string[] = [];
    
    for (const file of filesArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Haasdonk");
        formData.append("tags", "haasdonk");'''

upload_new = '''  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const filesArray = Array.from(e.target.files);
    const newUrls: string[] = [];
    
    for (const file of filesArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Haasdonk");
        formData.append("tags", tag);'''

code = code.replace(upload_old, upload_new)

update_state_old = '''    if (newUrls.length > 0) {
      setCloudPhotos(prev => [...newUrls, ...prev]);
    }
    
    setIsUploading(false);
  };'''

update_state_new = '''    if (newUrls.length > 0) {
      setGalleries(prev => ({ 
        ...prev, 
        [tag]: [...newUrls, ...(prev[tag] || [])] 
      }));
    }
    
    setIsUploading(false);
  };'''

code = code.replace(update_state_old, update_state_new)

# 4. Render loop
render_old = '''          let allPhotos: string[] = [];
          if (match.featuredImage) allPhotos.push(match.featuredImage);
          if (match.showCloudGallery) allPhotos = [...allPhotos, ...cloudPhotos];'''

render_new = '''          let allPhotos: string[] = [];
          if (match.featuredImage) allPhotos.push(match.featuredImage);
          if (match.showCloudGallery && match.cloudinaryTag) {
            allPhotos = [...allPhotos, ...(galleries[match.cloudinaryTag] || [])];
          }'''

code = code.replace(render_old, render_new)

# 5. Input onChange
input_old = '''onChange={handlePhotoUpload} />'''
input_new = '''onChange={(e) => handlePhotoUpload(e, match.cloudinaryTag!)} />'''

code = code.replace(input_old, input_new)

with open('src/app/laatste-wedstrijd/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
