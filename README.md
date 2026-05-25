# Milo: Skyggesagen

> Et filosofisk mysterium om sandhed, skygger og gode spørgsmål.

Et spilbaseret læringsunivers til børn 10-12 år, hvor de bliver Milo mågens detektivmakker og lærer om filosofi, Platon og hulelignelsen gennem et lille mystery-spil.

Bygget med Vite + React. Ingen backend, ingen database, ingen login.

## Hvad er det?

Barnet:

- åbner en sagsmappe
- undersøger spor i en scene
- sorterer dem som gæt, spor, beviser eller filosofiske spørgsmål
- finder det "gode spørgsmål" der åbner sagen
- bygger en filosofisk forklaring i rigtig rækkefølge
- afslører "skyggen" og får sin egen detektivrapport

Læringen er skjult i oplevelsen: barnet tænker først *"jeg spiller et mysterium"* — og bagefter *"jeg har faktisk lært noget om filosofi."*

## Installation

Kræver Node.js 18+.

```bash
npm install
```

## Kørsel

Udviklingsserver:

```bash
npm run dev
```

Den åbner som standard på `http://localhost:5173`.

## Build

Statisk produktions-build:

```bash
npm run build
```

Output ligger i `dist/`. Du kan teste det lokalt med:

```bash
npm run preview
```

## Milo-assets

Milos billeder ligger i `public/assets/milo/` (kopieres til `dist/assets/milo/` ved build):

- `milo.png` — neutral guide
- `milo-waving.png` — start og onboarding
- `milo-watching.png` — undersøgelse, briefing, vidner, spørgsmål
- `milo-run.png` — tidslinje, næste skridt, start-animation
- `milo-flying.png` — belønning, hulelignelse, mærker
- `milo-adore.png` — overraskelse / opdagelse
- `milo-thumbs-hover.png` — korrekt valg / ros
- `milo-glitter.png` — reserve / fejring
- `milo-side.png` — forklaringer
- `milo-poses.png` — reserve
- `find-spor.png`, `spor.png` — scenespor
- `milo-klassekammerat.png`, `milo-lærer.png`, `milo-ven.png` — vidner
- `i-hulen.png`, `vender-sig.png`, `mod-udgangen.png`, `ude-i-solen.png` — hulelignelse

Brug i kode: `<Milo pose="watching" />` — se `POSE_TO_FILE` i `src/components/Milo.jsx`.

Hvis et asset mangler, falder appen tilbage til en simpel tegnet "MILO"-cirkel — den crasher ikke.

## Lyd

Lydfeedback bygges på Web Audio API og er små syntetiske toner. Der er ingen eksterne lydfiler.

- Lyden afspilles aldrig før første brugerinteraktion (browser-policy).
- Brugerens valg af lyd til/fra gemmes i `localStorage`.
- Hvis Web Audio API ikke virker, kører appen videre uden fejl.

## localStorage

Al fremdrift gemmes lokalt under nøglen `milo-skyggesagen:v1`:

- detektivnavn og symbol
- sidste skærm (genoptagelse ved reload)
- lydpræference og effekter til/fra
- fundne spor
- sorterede kort
- gode spørgsmål, forklaring, skygge-status
- badges
- detektivrapport

På lærersiden kan progression nulstilles med knappen *"Nulstil spil"*.

## Begrænsninger

- Ingen backend, ingen database — al state er lokal.
- Designet er bedst på mobil; desktop viser appen i en centreret mobil-frame.
- Ingen indbyggede tests; manuel afprøvning anbefales.
- Tekst er på dansk, designet til 10-12 år.
