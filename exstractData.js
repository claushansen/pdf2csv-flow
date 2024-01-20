// Importerer de nødvendige Node.js moduler for filsystem og sti håndtering.
const fs = require('fs');
const path = require('path');

// Funktion til at udtrække 'sted' og 'retning' fra et filnavn.
function extractStedRetningFromFilename(filename) {
    // Definerer et regulært udtryk til at identificere mønsteret i filnavne.
    const pattern = /DL\s+([A-Za-zÆØÅæøå]+)\s+([A-Za-zÆØÅæøå]+)/;
    // Matcher det definerede mønster med det givne filnavn.
    const match = pattern.exec(filename);
    // Returnerer et objekt med 'sted' og 'retning' hvis match findes, ellers tomme strenge.
    return match ? { sted: match[1], retning: match[2] } : { sted: '', retning: '' };
}

// Funktion til at ekstrahere data til brug i Excel ud fra tekst, sted og retning.
function extractDataForExcel(text, sted, retning) {
    // Definerer regulære udtryk for at matche CPR-nummer og navn.
    const cprAndNameRegex = /(\d{6}-\d{4})\s+([^\n]+?)(?=\n|\r\n)/;
    // Definerer regulært udtryk for at matche telefonnummer.
    const phoneRegex = /Kursist tlf\. nr\.:\s+([0-9]+)/;
    // Definerer regulært udtryk for at matche e-mail.
    const emailRegex = /Kursist email:\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    // Definerer regulært udtryk for at matche arbejdsgivers telefonnummer.
    const employerPhoneRegex = /Arbejdsgiver tlf\.nr\.:\s+([0-9]+)/;
    // Definerer regulært udtryk for at matche arbejdsgivers e-mail.
    const employerEmailRegex = /Arbejdsgiver email:\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    // Definerer regulært udtryk for at matche betaler.
    const payerRegex = /Betaler\*:\s*([^\n\r]+)(?=\n|\r\n)/;
    // Definerer regulært udtryk for at matche arbejdsgivers CVR-nummer og navn.
    const employerCvrRegex = /Arbejdsadresse CVR-nr:\s*(\d{8})\s*([^\n\r]*)/;
    // Definerer regulært udtryk for at matche kursusdata.
    const dataRegex = /(\d{5}-)\s+(\d+,\d)\s+(\d{2}\/\d{2}-\d{4})\s+(\d{2}\/\d{2}-\d{4})/g;

    let result = '';

    // Matcher CPR-nummer og navn i den givne tekst.
    let cprAndNameMatch = cprAndNameRegex.exec(text);
    if (cprAndNameMatch) {
        // Udtrækker CPR-nummer og navn, og formaterer navnet.
        const cpr = cprAndNameMatch[1];
        let name = cprAndNameMatch[2].trim().replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim();

        // Matcher og udtrækker yderligere information fra teksten.
        const phoneMatch = phoneRegex.exec(text);
        const emailMatch = emailRegex.exec(text);
        const employerPhoneMatch = employerPhoneRegex.exec(text);
        const employerEmailMatch = employerEmailRegex.exec(text);
        const payerMatch = payerRegex.exec(text);
        let employerCvrMatch = employerCvrRegex.exec(text);

        // Tilskriver udtrukket information til variabler.
        const phone = phoneMatch ? phoneMatch[1] : '';
        const email = emailMatch ? emailMatch[1] : '';
        const employerPhone = employerPhoneMatch ? employerPhoneMatch[1] : '';
        const employerEmail = employerEmailMatch ? employerEmailMatch[1] : '';
        const payer = payerMatch ? payerMatch[1].trim() : '';
        const cvrNummer = employerCvrMatch ? employerCvrMatch[1] : '';
        const firmaNavn = employerCvrMatch ? employerCvrMatch[2].trim() : '';

        // Matcher og behandler kursusdata i en løkke.
        let dataMatches;
        while ((dataMatches = dataRegex.exec(text)) !== null) {
            // Sammensætter en streng af alle de matchede data adskilt af semikolon.
            result += [cpr, name, email, phone, sted, retning, employerEmail, employerPhone, payer, cvrNummer, firmaNavn, dataMatches[1], dataMatches[2], dataMatches[3], dataMatches[4]].join(';') + '\n';
        }
    }

    // Returnerer den sammensatte resultatstreng.
    return result;
}

// Funktion til at behandle filer i en bestemt mappe.
function processFilesInDirectory(directoryPath) {
    // Læser filer fra den angivne mappe.
    fs.readdir(directoryPath, (err, files) => {
        // Håndterer fejl under læsningen af mappen.
        if (err) {
            console.error("Fejl ved læsning af mappen:", err);
            return;
        }

        // Definerer header for den samlede datastreng.
        let allData = "CPR;Navn;Email;Telefonnummer;Sted;Retning;Arbejdsgiver Email;Arbejdsgiver Telefonnummer;Betaler;CVR;FirmaNavn;Fagkode;Varighed;Startdato;Slutdato\n";

        // Behandler hver fil i mappen.
        files.forEach(file => {
            // Sammensætter den fulde sti til filen.
            const filePath = path.join(directoryPath, file);
            // Læser filens indhold.
            const fileData = fs.readFileSync(filePath, 'utf8');
            // Udtrækker 'sted' og 'retning' fra filnavnet.
            const { sted, retning } = extractStedRetningFromFilename(file);
            // Tilføjer data ekstraheret fra filen til den samlede datastreng.
            allData += extractDataForExcel(fileData, sted, retning);
        });

        // Definerer stien til output-filen.
        const outputFile = path.join(__dirname, 'output.csv');
        // Skriver den samlede datastreng til output-filen.
        fs.writeFileSync(outputFile, allData, 'utf8');
        // Logger en besked når processen er færdig.
        console.log("Alle data er blevet samlet i output.csv");
    });
}

// Definerer stien til den mappe, der skal behandles.
const directoryPath = path.join(__dirname, 'temp-txt-files');
// Starter behandlingen af filerne i den angivne mappe.
processFilesInDirectory(directoryPath);
