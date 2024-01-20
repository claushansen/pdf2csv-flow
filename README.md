# pdf2csv-flow

## Beskrivelse

Dette projekt er lavet som en løsning til at udtrække data fra kursisttilmeldinger i pdf-filer. Løsningen er en kombination af et flow til Microsoft Power Automate Desktop (PAD) og et NodeJS script.

## Forudsætninger før brug

Før du starter, sørg for at:

1. Installer **Power Automate Desktop**, som er et gratis program fra Office 365.
   [Download her](https://apps.microsoft.com/detail/9NFTCH6J7FHV?SilentAuth=1&hl=da-dk&gl=DA) (https://apps.microsoft.com/detail/9NFTCH6J7FHV?SilentAuth=1&hl=da-dk&gl=DA)
2. Installer **NodeJS**, som er et open source-cross-platform-runtime-system.
   [Download her](https://nodejs.org/en/download) (https://nodejs.org/en/download)

Denne pakke indeholder en mappe/filstruktur som skal bibeholdes, for at PAD-flowet fungerer korrekt.

## Opsætning af flow på Power Automate Desktop

For at opsætte flowet:

1. Tryk "Nyt flow" og giv det et navn, for at oprette flow.
2. Kopier teksten fra filen `PA-Desktop-export.txt`, som er i denne mappe, og indsæt med ctrl-Z i hovedvinduet på Power Automate.
3. Et flow-forløb vil blive oprettet fra det indsatte. Ignorer evt. fejlmeddelelser om manglende variabler.
4. Tryk på plustegnet under "Input/output-variabler" og vælg input i dropdown.
5. Udfyld både Variabelnavn og Eksternt navn med: `ProjectPath`, Datatype: Tekst, Standardværdi: Absolut sti til denne mappe. (fx: C:\Users\Claus\Desktop\extract-data-from-pdf)
6. Tryk gem og fejlmedelelserne forsvinder.
7. Gem Flowet.

## Dagligt brug

For daglig brug af systemet:

1. Kopier de filer der skal udtrækkes data fra til mappen: `nye-pdf-filer`.
   (det er vigtigt at de er navngivet korrekt som `[Navn][Mellemrum][DL][Mellemrum][Sted][Mellemrum][retning][Mellemrum][Periode]`)
2. Kør flowet i Power Automate.
3. Data er nu udtrukket til filen `Output.csv`.
4. Opdater evt. kilden til de powerQuery forespørgsler i den medfølgende Excel Workbook: `Data.xlsx`, for en opsat visning.
