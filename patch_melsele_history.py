import re

with open('src/app/laatste-wedstrijd/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

melsele_match = '''const MATCHES = [
  {
    id: -2,
    date: "Zaterdag 3 Oktober — Competitie",
    homeTeam: "Kvk Svelta Melsele",
    awayTeam: "HRS Haasdonk",
    homeScore: 8,
    awayScore: 16,
    scorers: [
      { name: "Lucas", goals: 8 },
      { name: "Viny", goals: 2 },
      { name: "Joachim", goals: 2 },
      { name: "Noah", goals: 2 },
      { name: "Alikerim", goals: 1 },
      { name: "Basiel", goals: 1 },
    ],
    featuredImage: null,
    showCloudGallery: true,
    cloudinaryTag: "melsele"
  },'''

code = code.replace("const MATCHES = [", melsele_match)

# Set expanded match default
code = code.replace("useState<number | null>(-1);", "useState<number | null>(-2);")

# Fix characters if there's any weird encoding
code = code.replace("Zaterdag 26 September ?\" Competitie", "Zaterdag 26 September — Competitie")
code = code.replace("Zaterdag 19 September ?\" Competitie", "Zaterdag 19 September — Competitie")
code = code.replace("?\"", "—")

with open('src/app/laatste-wedstrijd/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
