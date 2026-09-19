import re

with open('src/app/laatste-wedstrijd/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

new_matches = '''const MATCHES = [
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
];'''

# Replace MATCHES array completely (from const MATCHES to ];)
code = re.sub(r'const MATCHES = \[.*?\];', new_matches, code, flags=re.DOTALL)

# Change default expandedMatch from 1 to 0
code = re.sub(r'useState<number \| null>\(1\);', 'useState<number | null>(0);', code)

# Fix weird encoding issue in date string (?") if present in original source
code = code.replace("Zaterdag 12 September ?\" Competitie", "Zaterdag 12 September — Competitie")
code = code.replace("Zaterdag 5 September ?\" Competitie", "Zaterdag 5 September — Competitie")

with open('src/app/laatste-wedstrijd/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
