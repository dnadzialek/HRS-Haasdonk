import re

with open('src/app/laatste-wedstrijd/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

bornem_match = '''const MATCHES = [
  {
    id: -1,
    date: "Zaterdag 26 September — Competitie",
    homeTeam: "Ksv Bornem",
    awayTeam: "HRS Haasdonk",
    homeScore: 6,
    awayScore: 14,
    scorers: [
      { name: "Gaston", goals: 7 },
      { name: "Noah", goals: 3 },
      { name: "Lukas", goals: 3 },
      { name: "Tristan", goals: 1 },
      { name: "Basiel", goals: 1 },
      { name: "Alikerim", goals: 1 },
      { name: "Jules", goals: 1 },
    ],
    featuredImage: null,
    showCloudGallery: true,
    cloudinaryTag: "bornem"
  },'''

code = code.replace("const MATCHES = [", bornem_match)

# Default expanded to -1
code = code.replace("useState<number | null>(0);", "useState<number | null>(-1);")

# Fix characters
code = code.replace("Zaterdag 19 September ?\" Competitie", "Zaterdag 19 September — Competitie")
code = code.replace("Zaterdag 12 September ?\" Competitie", "Zaterdag 12 September — Competitie")
code = code.replace("Zaterdag 5 September ?\" Competitie", "Zaterdag 5 September — Competitie")
code = code.replace("?\"", "—")

with open('src/app/laatste-wedstrijd/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
