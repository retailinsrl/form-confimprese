emailjs.init("71SGPlyyS9O_-kf1r"); 

const { PDFDocument } = PDFLib;

let pdfDoc;
let pdfBytesModificato;
let anteprimaUrl = null; // Memorizza l'URL temporaneo per pulire la memoria

window.addEventListener('DOMContentLoaded', () => {
    inizializzaPdf();
});

// 1. CARICAMENTO E PREPARAZIONE DEL PDF
async function inizializzaPdf(){
    try {
        const bytesIniziali = await fetch('modulo_base.pdf').then(res => {
            if (!res.ok) throw new Error("File PDF non trovato.");
            return res.arrayBuffer();
        });
        
        pdfDoc = await PDFDocument.load(bytesIniziali);

        document.getElementById('stato-caricamento').textContent = "PDF Base Caricato con Successo!";
        document.getElementById('btn-revisiona').removeAttribute('disabled');
    } catch (error) {
        document.getElementById('stato-caricamento').style.color = '#c0392b';
        document.getElementById('stato-caricamento').textContent = "Errore nel caricamento del PDF base.";
        console.error(error);
    }
}

// 1. Configura la mappatura dei campi per tutte e 8 le pagine
const campi = [
    // Campi Pagina 1 (Indice pagina: 0)
    { 
        id: "input-nome-societa", x: 100, y: 620, pagina: 0, required: true, step: 1,
        // Questa funzione dice esattamente come renderizzare questo specifico campo
        render: (page, val, c) => {
            const tipo = document.getElementById("input-tipo-societa").value.trim().toUpperCase();
            page.drawText(`${val} ${tipo}`, { x: c.x, y: c.y, size: 8 });
        }
    },
    { id: "input-tipo-societa", required: true, step: 1 },
    { id: "input-sede", x: 100, y: 582, pagina: 0, required: true, step: 1 },
    { 
        id: "input-nome-rappresentante", x: 200, y: 543, pagina: 0, required: true, step: 1,
        render: (page, val, c) => {
            const cognome = document.getElementById("input-cognome-rappresentante").value.trim().toUpperCase();
            page.drawText(`${val} ${cognome}`, { x: c.x, y: c.y, size: 8 });
        }
    },
    { id: "input-cognome-rappresentante", required: true, step: 1 },
    
    // Campi Pagina 2 (Indice pagina: 1)
    { 
        id: "input-nome-ref", x: 128, y: 603, pagina: 1, required: true, step: 2,
        render: (page, val, c) => {
            const cognome = document.getElementById("input-cognome-ref").value.trim().toUpperCase();
            page.drawText(`${val} ${cognome}`, { x: c.x, y: c.y, size: 8 });
        }
    },
    { id: "input-cognome-ref", required: true, step: 2 },
    { id: "input-ruolo-ref", x: 322, y: 603, pagina: 1, required: true, step: 2 },
    { id: "input-email-ref", x: 80, y: 588, pagina: 1, required: true, step: 2 },
    { id: "input-mob-ref", x: 350, y: 588, pagina: 1, required: true, step: 2 },
    { id: "input-sito-ref", x: 110, y: 573, pagina: 1, required: false, step: 2 },
    { id: "input-marchi-ref", x: 80, y: 558, pagina: 1, required: false, step: 2 },
    { id: "input-sdi-ref", x: 230, y: 542, pagina: 1, required: true, step: 2 },
    { id: "input-pec-ref", x: 319, y: 542, pagina: 1, required: true, step: 2 },
    { id: "input-piva-ref", x: 450, y: 542, pagina: 1, required: true, step: 2 },

    { 
        id: "input-nome-rop", x: 128, y: 496, pagina: 1, required: true, step: 3,
        render: (page, val, c) => {
            const cognome = document.getElementById("input-cognome-rop").value.trim().toUpperCase();
            page.drawText(`${val} ${cognome}`, { x: c.x, y: c.y, size: 8 });
        }
    },
    { id: "input-cognome-rop", required: true, step: 3 },
    { id: "input-ruolo-rop", x: 322, y: 496, pagina: 1, required: true, step: 3 },
    { id: "input-email-rop", x: 80, y: 481, pagina: 1, required: true, step: 3 },
    { id: "input-mob-rop", x: 350, y: 481, pagina: 1, required: true, step: 3 },
    // Campi Pagina 3 (Indice pagina: 2)
    
    // ... Aggiungi qui i campi per le pagine da 4 a 8
];

let stepCorrente = 0;
const totaleStep = 4; // Modifica in 8 quando avrai aggiunto tutti gli step

// 2. Funzione per navigare tra gli step del form
function cambiaStep(direzione) {
    // Verifica che i campi obblicatori dello step corrente siano stati compilati
    // Raccoglie tutti i valori del form
    const valori = campi
        .filter(c => c.required === true && c.step === stepCorrente)
        .map(c => ({
            ...c,
            valore: document.getElementById(c.id).value.trim().toUpperCase()
        }));

    valori.forEach(c => { 
        const inputElement = document.getElementById(c.id);
        if (inputElement) {
            inputElement.classList.remove('campo-errore');
        }
    });

    if(direzione === 1) {
        
        const campiVuoti = valori.filter(c => !c.valore);
        
        if (campiVuoti.length > 0) {
            campiVuoti.forEach(c => {
                const inputElement = document.getElementById(c.id);
                if (inputElement) {
                    inputElement.classList.add('campo-errore');
                    console.error(inputElement);
                }
            });
            
            alert("Per favore, compila tutti i campi in questa pagina prima di proseguire.");
            return;
        }
    }


    // Nascondi lo step corrente
    document.getElementById(`step-${stepCorrente}`).style.display = "none";

    if(document.getElementById("input-ck-ref").checked && stepCorrente === 2 && direzione === 1) direzione++;

    // Aggiorna l'indice dello step
    stepCorrente += direzione;
    
    // Mostra il nuovo step
    document.getElementById(`step-${stepCorrente}`).style.display = "block";
    
    // Gestione della visibilità dei bottoni
    document.getElementById("btn-indietro").style.display = stepCorrente === 1 ? "none" : "inline-block";
    
    if (stepCorrente === totaleStep) {
        document.getElementById("btn-avanti").style.display = "none";
        document.getElementById("btn-revisiona").style.display = "inline-block";
    } else {
        document.getElementById("btn-avanti").style.display = "inline-block";
        document.getElementById("btn-revisiona").style.display = "none";
    }

    // Aggiorna l'indicatore visivo dello step attivo (opzionale)
    aggiornaIndicatori();
}

function aggiornaIndicatori() {
    // 1. Calcola la percentuale di completamento
    const percentuale = (stepCorrente / totaleStep) * 100;
    
    // 2. Aggiorna la larghezza della barra colorata
    const barFill = document.getElementById("progress-bar-fill");
    if (barFill) {
        barFill.style.width = `${percentuale}%`;
    }
    
    // 3. Aggiorna il testo descrittivo (es. "Pagina 2 di 8")
    const progressText = document.getElementById("progress-text");
    if (progressText) {
        progressText.innerText = `${percentuale.toFixed(0)}%`;
    }
}

// Genera PDF per revisione
async function avviaRevisione() {
    // Raccoglie tutti i valori del form
    const valori = campi.map(c => ({
        ...c,
        valore: document.getElementById(c.id).value.trim().toUpperCase()
    }));

    // Verifica che tutti i campi di tutte le pagine siano stati compilati
    if (valori.some(c => !c.valore && c.required)) {
        alert("Per favore, compila tutti i campi in tutte le pagine prima di generare il PDF.");
        return;
    }

    const pdfBytes = await fetch("modulo_base.pdf").then(r => r.arrayBuffer());
    pdfDoc = await PDFDocument.load(pdfBytes);

    const pagine = pdfDoc.getPages();

    // Aggiungi data sulla pagina 1 (indice 0)
    const oggi = new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date()).toUpperCase();

    pagine[0].drawText(`MILANO, ${oggi}`, {
        x: 45,
        y: 152,
        size: 10
    });

    // Cicla i campi e li scrive sulla rispettiva pagina
    valori.forEach(c => {
        // Se il campo deve essere ignorato nella stampa autonoma, passa oltre
        if (!c.x) return;

        // Se la pagina non esiste restituisce errore
        const paginaTarget = pagine[c.pagina]; 
        if (!paginaTarget) {
            console.error(`ERRORE: La pagina con indice ${c.pagina} non esiste nel PDF!`);
            return;
        }

        // Se il campo ha un metodo di rendering personalizzato, usa quello
        if (typeof c.render === "function") {
            c.render(paginaTarget, c.valore, c);
        } else {
            // Altrimenti procedi con il posizionamento standard automatico
            paginaTarget.drawText(c.valore, {
                x: c.x,
                y: c.y,
                size: 8
            });
        }
    });

    // Avvia la revisione finale a schermo
    await revisionaModuli();
}

// 2. FASE DI REVISIONE: Genera i byte aggiornati e mostra l'anteprima nel browser
async function revisionaModuli(){
    // Revoca il vecchio URL se l'utente clicca più volte (ottimizzazione memoria)
    if (anteprimaUrl) {
        URL.revokeObjectURL(anteprimaUrl);
    }

    // Salviamo lo stato attuale del PDF per l'anteprima
    pdfBytesModificato = await pdfDoc.save();

    // Creiamo un Blob (Binary Large Object) dai byte del PDF
    const blob = new Blob([pdfBytesModificato], { type: 'application/pdf' });
    
    // Generiamo un URL temporaneo locale del browser (es: blob:http://localhost/...)
    anteprimaUrl = URL.createObjectURL(blob);

    // Aggiorniamo l'interfaccia inserendo un iframe che punta all'URL del PDF appena generato
    document.getElementById('anteprima-revisione').innerHTML = `
        <h3>Controlla il PDF compilato prima di inviare:</h3>
        <p>Verifica che i dati nel documento qui sotto siano corretti. Se è tutto a posto, clicca su "Conferma e Invia".</p>
        
        <div class="pdf-viewer-container">
            <iframe src="${anteprimaUrl}"></iframe>
        </div>
        
        <button onclick="confermaEInvia(event)" style="background-color: #2ecc71; margin-top: 15px;">Conferma e Invia Mail</button>
    `;
}

// 3. CONFERMA E INVIO VIA PHP (Senza limiti di peso!)
async function confermaEInvia(event){
    const btn = event.target;
    try {
        btn.textContent = "Attendere...";
        btn.disabled = true;
        
        const form = pdfDoc.getForm();
        const nomeUtente = document.getElementById("input-nome-societa")?.value.trim() || "Utente";

        // Appiattiamo il PDF (lo rendiamo non modificabile)
        //form.flatten();

        pdfBytesModificato = await pdfDoc.save();

        // Convertiamo in Base64
        const pdfBase64 = btoa(
            new Uint8Array(pdfBytesModificato)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Prepariamo i dati da inviare al server PHP
        const datiDaInviare = {
            nomeUtente: nomeUtente,
            pdfBase64: pdfBase64
        };

        // Facciamo una richiesta POST a invia.php nella stessa cartella
        const risposta = await fetch('invia.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datiDaInviare)
        });

        const risultato = await risposta.json();

        if (risultato.status === 'success') {
            alert(risultato.message);
            btn.textContent = "Inviato ✓";
        } else {
            alert('Errore dal server: ' + risultato.message);
            // Ripristino pulsante in caso di errore
            btn.textContent = "Conferma e Invia Mail";
            btn.disabled = false;
        }

    } catch (err) {
        console.error(err);
        alert("Errore di connessione con il server PHP.");
        // Ripristino pulsante in caso di errore
        btn.textContent = "Conferma e Invia Mail";
        btn.disabled = false;
    }
}

// Funzione di utilità opzionale per scaricare fisicamente il file sul PC/Smartphone dell'utente
function scaricaPdfLocale(bytes, nomeFile) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeFile;
    link.click();
    URL.revokeObjectURL(link.href);
}

function clickTerminiCondizioni(checkbox) {
    document.getElementById("btn-avanti").disabled = !checkbox.checked;
}

function stessoReferente(checkbox) {
    ["nome", "cognome", "ruolo", "email", "mob"].forEach(c => {
        document.getElementById(`input-${c}-rop`).value = checkbox.checked ? document.getElementById(`input-${c}-ref`).value : "";
    });
}
