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
    // Start
    { 
        id: "input-sede-via", x: 100, y: 582, pagina: 0, required: true, step: 1,
        render: (page, val, c) => {
            const nCiv = document.getElementById("input-sede-nciv").value;
            const citta = document.getElementById("input-sede-citta").value.trim().toUpperCase();
            const prov = document.getElementById("input-sede-prov").value.trim().toUpperCase();
            const cap = document.getElementById("input-sede-cap").value.trim().toUpperCase();
            page.drawText(`${val}, ${nCiv} - ${cap} ${citta} (${prov})`, { x: c.x, y: c.y, size: 8 });
        }
    },
    { id: "input-sede-nciv", required: true, step: 1 },
    { id: "input-sede-citta", required: true, step: 1 },
    { id: "input-sede-prov", required: true, step: 1 },
    { id: "input-sede-cap", required: true, step: 1 },
    // End

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
    { id: "input-div-ass", x: 63, y: 362.5, pagina: 2, required: false, step: 4, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                const placeY = c.y - (13.45 * val);
                page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
            });
        }
    },
    { id: "input-altro-ass", x: 170, y: 188, pagina: 2, required: false, step: 4 },
    { id: "input-ccnl", x: 63, y: 143.5, pagina: 2, required: false, step: 4, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-altro-ccnl", x: 170, y: 98, pagina: 2, required: false, step: 4 },

    // Campi Pagina 4 (Indice pagina: 3)
    { id: "input-ndip-sede", x: 140, y: 722, pagina: 3, required: false, step: 5 },
    { id: "input-ndip-pv", x: 210, y: 707, pagina: 3, required: false, step: 5 },
    { id: "input-occ-indiretti", x: 345, y: 692, pagina: 3, required: false, step: 5 },
    { id: "input-fatt-24", x: 150, y: 677, pagina: 3, required: false, step: 5 },
    { id: "input-fatt-23", x: 282, y: 677, pagina: 3, required: false, step: 5 },
    { id: "input-fatt-22", x: 415, y: 677, pagina: 3, required: false, step: 5 },
    { id: "input-varf-24", x: 256, y: 662, pagina: 3, required: false, step: 5 },
    { id: "input-varf-23", x: 345, y: 662, pagina: 3, required: false, step: 5 },
    { id: "input-varf-22", x: 440, y: 662, pagina: 3, required: false, step: 5 },
    { id: "input-sell-out", x: 130, y: 647, pagina: 3, required: false, step: 5 },
    { id: "input-quota-mercato", x: 160, y: 630, pagina: 3, required: false, step: 5 },
    { id: "input-fma-dir", x: 225, y: 615, pagina: 3, required: false, step: 5 },
    { id: "input-fma-franchising", x: 245, y: 601, pagina: 3, required: false, step: 5 },
    // ... Aggiungi qui i campi per le pagine da 4 a 8
    
];

let stepCorrente = 0;
const totaleStep = 6; // Modifica in 8 quando avrai aggiunto tutti gli step

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
    const valori = campi.map(c => {
        const elemento = document.getElementById(c.id);
        let valoreEstratto;

        if (c.id === "input-div-ass") {
            // Se l'elemento non esiste nella pagina per sicurezza evitiamo crash
            if (!elemento) {
                valoreEstratto = [];
            } else {
                // Raccoglie l'array di checkbox selezionate
                const checkboxSpuntate = elemento.querySelectorAll('input[name="associazioni[]"]:checked');
                valoreEstratto = Array.from(checkboxSpuntate).map(cb => cb.value);
            }
        } else {
            // Per tutti gli altri campi standard (input, select) estrae la stringa pulita
            valoreEstratto = elemento && elemento.value ? elemento.value.toString().trim().toUpperCase() : "";
        }

        return {
            ...c,
            valore: valoreEstratto
        };
    });

    // Verifica che tutti i campi di tutte le pagine siano stati compilati
    if (valori.some(c => c.required && (!c.valore || (Array.isArray(c.valore) && c.valore.length === 0)))) {
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
async function confermaEInvia(event) {
    const btn = event.target;
    try {
        btn.textContent = "Attendere...";
        btn.disabled = true;
        
        const form = pdfDoc.getForm();
        const nomeUtente = document.getElementById("input-nome-societa").value.trim().toUpperCase() || "UTENTE";

        // ---- NUOVA LOGICA: Recupero email dinamiche ----
        const inputEmail = document.querySelectorAll(".input-email-dest");
        const listaEmail = [];
        
        inputEmail.forEach(input => {
            const email = input.value.trim();
            if (email !== "") {
                listaEmail.push(email);
            }
        });

        if (listaEmail.length === 0) {
            alert("Inserisci almeno un indirizzo email valido.");
            btn.textContent = "Conferma e Invia Mail";
            btn.disabled = false;
            return;
        }
        // ------------------------------------------------

        // Salva i byte del PDF
        pdfBytesModificato = await pdfDoc.save();

        // 1. Trasformiamo i byte in un vero file binario (Blob)
        const pdfBlob = new Blob([pdfBytesModificato], { type: 'application/pdf' });

        // 2. Creiamo l'oggetto FormData
        const datiForm = new FormData();
        datiForm.append('nomeUtente', nomeUtente);
        
        // Appendiamo ogni email all'array 'email[]'
        listaEmail.forEach(email => {
            datiForm.append('email[]', email);
        });
        
        // Aggiungiamo il file PDF
        const nomeFile = `modulo_${nomeUtente.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        datiForm.append('filePdf', pdfBlob, nomeFile);

        // 3. Facciamo la richiesta POST
        const risposta = await fetch('invia.php', {
            method: 'POST',
            body: datiForm 
        });

        const risultato = await risposta.json();

        if (risultato.status === 'success') {
            alert(risultato.message);
            btn.textContent = "Inviato ✓";
        } else {
            alert('Errore dal server: ' + risultato.message);
            btn.textContent = "Conferma e Invia Mail";
            btn.disabled = false;
        }

    } catch (err) {
        console.error(err);
        alert("Errore di connessione con il server PHP.");
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

var count = 0;
function clickTerminiCondizioni(checkbox) {
    count = checkbox.checked ? count+1 : count-1;
    document.getElementById("btn-avanti").disabled = count < 2;
}

const campiRef= ["nome", "cognome", "ruolo", "email", "mob"];
function stessoReferente() {
    campiRef.forEach(c => {
        document.getElementById(`input-${c}-rop`).value = document.getElementById("input-ck-ref").checked ? document.getElementById(`input-${c}-ref`).value : "";
    });
}
document.addEventListener("DOMContentLoaded", () => {
    campiRef.forEach(c => {
        // Ascolta ogni singolo carattere digitato (evento 'input')
        document.getElementById(`input-${c}-ref`).addEventListener("input", stessoReferente);
    });
});

// Database completo delle province italiane per regione
const provincePerRegione = {
    "abruzzo": [
        { sigla: "CH", nome: "Chieti" }, { sigla: "AQ", nome: "L'Aquila" }, 
        { sigla: "PE", nome: "Pescara" }, { sigla: "TE", nome: "Teramo" }
    ],
    "basilicata": [
        { sigla: "MT", nome: "Matera" }, { sigla: "PZ", nome: "Potenza" }
    ],
    "calabria": [
        { sigla: "CZ", nome: "Catanzaro" }, { sigla: "CS", nome: "Cosenza" }, 
        { sigla: "KR", nome: "Crotone" }, { sigla: "RC", nome: "Reggio Calabria" }, 
        { sigla: "VV", nome: "Vibo Valentia" }
    ],
    "campania": [
        { sigla: "AV", nome: "Avellino" }, { sigla: "BN", nome: "Benevento" }, 
        { sigla: "CE", nome: "Caserta" }, { sigla: "NA", nome: "Napoli" }, 
        { sigla: "SA", nome: "Salerno" }
    ],
    "emilia-romagna": [
        { sigla: "BO", nome: "Bologna" }, { sigla: "FE", nome: "Ferrara" }, 
        { sigla: "FC", nome: "Forlì-Cesena" }, { sigla: "MO", nome: "Modena" }, 
        { sigla: "PR", nome: "Parma" }, { sigla: "PC", nome: "Piacenza" }, 
        { sigla: "RA", nome: "Ravenna" }, { sigla: "RE", nome: "Reggio Emilia" }, 
        { sigla: "RN", nome: "Rimini" }
    ],
    "friuli-venezia-giulia": [
        { sigla: "GO", nome: "Gorizia" }, { sigla: "PN", nome: "Pordenone" }, 
        { sigla: "TS", nome: "Trieste" }, { sigla: "UD", nome: "Udine" }
    ],
    "lazio": [
        { sigla: "FR", nome: "Frosinone" }, { sigla: "LT", nome: "Latina" }, 
        { sigla: "RI", nome: "Rieti" }, { sigla: "RM", nome: "Roma" }, 
        { sigla: "VT", nome: "Viterbo" }
    ],
    "liguria": [
        { sigla: "GE", nome: "Genova" }, { sigla: "IM", nome: "Imperia" }, 
        { sigla: "SP", nome: "La Spezia" }, { sigla: "SV", nome: "Savona" }
    ],
    "lombardia": [
        { sigla: "BG", nome: "Bergamo" }, { sigla: "BS", nome: "Brescia" }, 
        { sigla: "CO", nome: "Como" }, { sigla: "CR", nome: "Cremona" }, 
        { sigla: "LC", nome: "Lecco" }, { sigla: "LO", nome: "Lodi" }, 
        { sigla: "MB", nome: "Monza e della Brianza" }, { sigla: "MI", nome: "Milano" }, 
        { sigla: "MN", nome: "Mantova" }, { sigla: "PV", nome: "Pavia" }, 
        { sigla: "SO", nome: "Sondrio" }, { sigla: "VA", nome: "Varese" }
    ],
    "marche": [
        { sigla: "AN", nome: "Ancona" }, { sigla: "AP", nome: "Ascoli Piceno" }, 
        { sigla: "FM", nome: "Fermo" }, { sigla: "MC", nome: "Macerata" }, 
        { sigla: "PU", nome: "Pesaro e Urbino" }
    ],
    "molise": [
        { sigla: "CB", nome: "Campobasso" }, { sigla: "IS", nome: "Isernia" }
    ],
    "piemonte": [
        { sigla: "AL", nome: "Alessandria" }, { sigla: "AT", nome: "Asti" }, 
        { sigla: "BI", nome: "Biella" }, { sigla: "CN", nome: "Cuneo" }, 
        { sigla: "NO", nome: "Novara" }, { sigla: "TO", nome: "Torino" }, 
        { sigla: "VB", nome: "Verbano-Cusio-Ossola" }, { sigla: "VC", nome: "Vercelli" }
    ],
    "puglia": [
        { sigla: "BA", nome: "Bari" }, { sigla: "BT", nome: "Barletta-Andria-Trani" }, 
        { sigla: "BR", nome: "Brindisi" }, { sigla: "FG", nome: "Foggia" }, 
        { sigla: "LE", nome: "Lecce" }, { sigla: "TA", nome: "Taranto" }
    ],
    "sardegna": [
        { sigla: "CA", nome: "Cagliari" }, { sigla: "NU", nome: "Nuoro" }, 
        { sigla: "OR", nome: "Oristano" }, { sigla: "SS", nome: "Sassari" },
        { sigla: "SU", nome: "Sud Sardegna" }
    ],
    "sicilia": [
        { sigla: "AG", nome: "Agrigento" }, { sigla: "CL", nome: "Caltanissetta" }, 
        { sigla: "CT", nome: "Catania" }, { sigla: "EN", nome: "Enna" }, 
        { sigla: "ME", nome: "Messina" }, { sigla: "PA", nome: "Palermo" }, 
        { sigla: "RG", nome: "Ragusa" }, { sigla: "SR", nome: "Siracusa" }, 
        { sigla: "TP", nome: "Trapani" }
    ],
    "toscana": [
        { sigla: "AR", nome: "Arezzo" }, { sigla: "FI", nome: "Firenze" }, 
        { sigla: "GR", nome: "Grosseto" }, { sigla: "LI", nome: "Livorno" }, 
        { sigla: "LU", nome: "Lucca" }, { sigla: "MS", nome: "Massa-Carrara" }, 
        { sigla: "PI", nome: "Pisa" }, { sigla: "PT", nome: "Pistoia" }, 
        { sigla: "PO", nome: "Prato" }, { sigla: "SI", nome: "Siena" }
    ],
    "trentino-alto-adige": [
        { sigla: "BZ", nome: "Bolzano" }, { sigla: "TN", nome: "Trento" }
    ],
    "umbria": [
        { sigla: "PG", nome: "Perugia" }, { sigla: "TR", nome: "Terni" }
    ],
    "valle-d-aosta": [
        { sigla: "AO", nome: "Aosta" }
    ],
    "veneto": [
        { sigla: "BL", nome: "Belluno" }, { sigla: "PD", nome: "Padova" }, 
        { sigla: "RO", nome: "Rovigo" }, { sigla: "TV", nome: "Treviso" }, 
        { sigla: "VE", nome: "Venezia" }, { sigla: "VR", nome: "Verona" }, 
        { sigla: "VI", nome: "Vicenza" }
    ]
};

// Logica per aggiornare la select delle province
document.getElementById('input-regione').addEventListener('change', function() {
    const selectProvincia = document.getElementById('input-sede-prov');
    const regioneSelezionata = this.value;

    // Svuota le opzioni precedenti
    selectProvincia.innerHTML = '<option value="" disabled selected>Seleziona una provincia</option>';

    if (regioneSelezionata && provincePerRegione[regioneSelezionata]) {
        // Popola la select con le province della regione scelta
        provincePerRegione[regioneSelezionata].forEach(provincia => {
            const option = document.createElement('option');
            option.value = provincia.sigla; // Memorizza la sigla (es: "MI")
            option.textContent = `${provincia.nome} (${provincia.sigla})`; // Mostra "Milano (MI)"
            selectProvincia.appendChild(option);
        });

        // Abilita la select delle province
        selectProvincia.disabled = false;
    } else {
        // Se non c'è una regione valida, disabilita la select
        selectProvincia.disabled = true;
    }
});

// [Mantieni qui il codice dell'oggetto "provincePerRegione" del passaggio precedente]

// 1. Quando cambia la REGIONE -> Aggiorna le PROVINCE
document.getElementById('input-regione').addEventListener('change', function() {
    const selectProvincia = document.getElementById('input-sede-prov');
    const regioneSelezionata = this.value;

    // Resetta sia le province che le città
    selectProvincia.innerHTML = '<option value="" disabled selected>Provincia</option>';

    if (regioneSelezionata && provincePerRegione[regioneSelezionata]) {
        provincePerRegione[regioneSelezionata].forEach(provincia => {
            const option = document.createElement('option');
            option.value = provincia.sigla;
            option.textContent = `${provincia.nome} (${provincia.sigla})`;
            selectProvincia.appendChild(option);
        });
        selectProvincia.disabled = false;
    } else {
        selectProvincia.disabled = true;
    }
});

document.getElementById("input-ccnl").addEventListener('change', function() {
    // Attiva se selezionato "Altro", disattiva se selezionato qualsiasi altro valore
    document.getElementById("input-altro-ccnl").disabled = document.getElementById("input-ccnl").value != 3;
    
    // Se viene selezionato un altro valore, pulisce il testo digitato in precedenza
    if(document.getElementById("input-altro-ccnl").disabled)
        document.getElementById("input-altro-ccnl").value = "";
})

function attivaAltro(checkbox) {
    // Attiva se selezionato, disattiva se deselezionato
    document.getElementById("input-altro-ass").disabled = !checkbox.checked;
    
    // Se viene deselezionato, pulisce il testo digitato in precedenza
    if (!checkbox.checked) {
        document.getElementById("input-altro-ass").value = "";
    }
}

function getAssociazioni() {
    // Prende solo le checkbox spuntate dentro quel div specifico
    const checkboxSpuntate = document.querySelectorAll('#input-div-ass input[name="associazioni[]"]:checked');
    
    // Mappa le checkbox nei rispettivi valori
    const valArray = Array.from(checkboxSpuntate).map(cb => cb.value);

    return valArray;
}

// 3. (Opzionale) Se vuoi ascoltare i cambiamenti in tempo reale nel div
document.getElementById('input-div-ass').addEventListener('change', function(e) {
    // Ogni volta che l'utente clicca una checkbox aggiorna l'array
    if (e.target.name === 'associazioni[]' /*|| e.target.id === 'input-altro-ass'*/){
        const selezioniAggiornate = getAssociazioni();
    }
});

// Ascolta anche la digitazione in tempo reale nel campo "Altro"
document.getElementById('input-altro-ass').addEventListener('input', getAssociazioni);

document.getElementById('btn-aggiungi-email').addEventListener('click', () => {
    const container = document.getElementById('container-email');
    
    // Crea la nuova riga
    const row = document.createElement('div');
    row.className = 'flex-form';
    //row.style.marginBottom = '0px'; // Aggiunge un po' di spazio sotto la riga (visto che flex-form ha margin-bottom: 0)
    
    // Inserisce l'input (con style="flex: 1" per espandersi) e il bottone
    row.innerHTML = `
        <input type="email" class="input-form input-email-dest" placeholder="Indirizzo Email" style="width: 93%">
        <button type="button" class="input-form btn-rimuovi-email" style="width: 7%; background-color: red; font-weight: bold; margin-top: 0">&#128465;</button>
    `;
    
    // Gestione della rimozione del campo
    row.querySelector('.btn-rimuovi-email').addEventListener('click', () => row.remove());
    
    container.appendChild(row);
});