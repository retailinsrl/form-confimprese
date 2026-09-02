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

        //document.getElementById('stato-caricamento').textContent = "PDF Base Caricato con Successo!";
        document.getElementById('stato-caricamento').textContent = "";
        document.getElementById('btn-revisiona').removeAttribute('disabled');
    } catch (error) {
        document.getElementById('stato-caricamento').style.color = '#c0392b';
        document.getElementById('stato-caricamento').textContent = "Errore nel caricamento delle risorse di base, contattare il Supporto Tecnico.";
        console.error(error);
    }
}

// Genera PDF per revisione
async function avviaRevisione() {
    const checkboxIds = ["input-div-ass", "input-rm1-ub-div", "input-rm2-ub-div", "input-rm3-ub-div", "input-rm2-cs-div", "input-rm3-cs-div"];

    // Raccoglie tutti i valori del form
    const valori = campi.map(c => {
        const elemento = document.getElementById(c.id);
        let valoreEstratto;

        if (checkboxIds.includes(c.id))
            // Multi-checkbox
            valoreEstratto = elemento ? Array.from(elemento.querySelectorAll(c.selector), cb => cb.value) : [];
        else if (c.id === "input-radio-est")
            // Radio button specifico
            valoreEstratto = document.querySelector(c.selector)?.value || "";
        else if (elemento?.type === "checkbox")
            // Checkbox singolo: restituisce true se spuntato, false se deselezionato
            valoreEstratto = elemento.checked;
        else
            // Altri campi standard (input, select)
            valoreEstratto = elemento?.value ? elemento.value.toString().trim().toUpperCase() : "";

        return { ...c, valore: valoreEstratto };
    });

    // Verifica che tutti i campi di tutte le pagine siano stati compilati
    if (valori.some(c => c.required && (!c.valore || (Array.isArray(c.valore) && c.valore.length === 0)))) {
        alert("Per favore, compila tutti i campi in tutte le pagine prima di generare il PDF.");
        return;
    }

    const pdfBytes = await fetch("modulo_base.pdf").then(r => r.arrayBuffer());
    pdfDoc = await PDFDocument.load(pdfBytes);

    const pagine = pdfDoc.getPages();

    // Cicla i campi e li scrive sulla rispettiva pagina
    valori.forEach(c => {
        // Se il campo deve essere ignorato nella stampa autonoma, passa oltre
        if (c.x === undefined || c.y === undefined) return;

        // Se la pagina non esiste restituisce errore
        const paginaTarget = pagine[c.pagina]; 
        if (!paginaTarget)
            return console.error(`ERRORE: La pagina con indice ${c.pagina} non esiste nel PDF!`);

        // Se il campo ha un metodo di rendering personalizzato, usa quello
        if (typeof c.render === "function")
            c.render(paginaTarget, c.valore, c);
        else
            // Altrimenti procedi con il posizionamento standard automatico
            paginaTarget.drawText(c.valore, { x: c.x, y: c.y, size: 8});
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

        // ---- NUOVA LOGICA: Recupero e validazione email dinamiche ----
        const inputEmail = document.querySelectorAll("#container-email .input-email-dest");
        const listaEmail = [];
        let emailNonValida = false;

        inputEmail.forEach(input => {
            const email = input.value.trim();
            if (email !== "") {
                // Controllo nativo del browser sul formato email
                if (!input.checkValidity()) {
                    emailNonValida = true;
                    input.reportValidity(); // Mostra il fumetto di errore nativo
                } else {
                    listaEmail.push(email);
                }
            }
        });

        // Se un'email non è formattata correttamente
        if (emailNonValida) {
            btn.textContent = "Conferma e Invia Mail";
            btn.disabled = false;
            return;
        }

        // Se nessuna email è stata inserita
        if (listaEmail.length === 0) {
            alert("Inserisci almeno un indirizzo email valido.");
            btn.textContent = "Conferma e Invia Mail";
            btn.disabled = false;
            return;
        }
        // ------------------------------------------------------------

        // Salva i byte del PDF
        pdfBytesModificato = await pdfDoc.save();

        // 1. Trasformiamo i byte in un vero file binario (Blob)
        const pdfBlob = new Blob([pdfBytesModificato], { type: 'application/pdf' });

        // 2. Creiamo l'oggetto FormData
        const datiForm = new FormData();
        datiForm.append('nomeUtente', nomeUtente);
        
        // Appendiamo ogni email all'array 'email[]' per PHP
        listaEmail.forEach(email => {
            datiForm.append('email[]', email);
        });
        
        // Aggiungiamo il file PDF
        const nomeFile = `modulo_${nomeUtente.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        datiForm.append('filePdf', pdfBlob, nomeFile);

        // 3. Facciamo la richiesta POST a PHP
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

function aggiornaEmail() {
    const container = document.getElementById('container-email');
    const righe = container.querySelectorAll('.email-row');

    righe.forEach((row, index) => {
        const nuovoIndex = index + 1;
        const input = row.querySelector('input[type="email"]');
        let btnRimuovi = row.querySelector('.btn-rimuovi-email');

        // 1. Aggiorna ID e Placeholder
        input.id = `input-email-${nuovoIndex}`;
        input.placeholder = `Indirizzo Email #${nuovoIndex}`;

        // 2. Se c'è solo 1 email, rimuove il cestino e imposta la larghezza al 100%
        if (righe.length === 1) {
            input.style.width = '100%';
            if (btnRimuovi) btnRimuovi.remove();
        } else {
            // Se ci sono più email, assegna larghezza 93% e inserisce il tasto elimina
            input.style.width = '93%';
            
            if (!btnRimuovi) {
                btnRimuovi = document.createElement('button');
                btnRimuovi.type = 'button';
                btnRimuovi.className = 'input-form btn-rimuovi-email';
                btnRimuovi.style.cssText = 'width: 7%; background-color: red; font-weight: bold; margin-top: 0;';
                btnRimuovi.innerHTML = '&#128465;';

                // Listener per la rimozione
                btnRimuovi.addEventListener('click', () => {
                    row.remove();
                    aggiornaEmail(); // Riordina id, placeholder e layout
                });

                row.appendChild(btnRimuovi);
            }
        }
    });
}

document.getElementById('btn-aggiungi-email').addEventListener('click', () => {
    const container = document.getElementById('container-email');
    const righeAttuali = container.querySelectorAll('.email-row').length;

    // Limite massimo 5 email
    if (righeAttuali >= 5) {
        alert('Puoi inserire al massimo 5 indirizzi email.');
        return;
    }

    // Crea la nuova riga
    const row = document.createElement('div');
    row.className = 'email-row flex-form';
    row.innerHTML = `<input type="email" class="input-form input-email-dest">`;

    container.appendChild(row);

    // Riorfana ID, placeholder e cestini
    aggiornaEmail();
});

document.getElementById("input-radio-est").addEventListener('change', (event) => {
    document.getElementById("input-div-est").style.display = event.target.value === "0" ? "none" : "block";
});

// 1. Funzione helper per sincronizzare due input tramite i loro ID
function legaSincronizzazione(idSource, idTarget) {
    const inputSource = document.getElementById(idSource);
    const inputTarget = document.getElementById(idTarget);

    if (inputSource && inputTarget) {
        // Usa una flag per evitare loop infiniti tra gli eventi input dei due campi
        inputSource.oninput = () => { inputTarget.value = inputSource.value; };
        inputTarget.oninput = () => { inputSource.value = inputTarget.value; };

        // Sincronizza subito il valore iniziale se uno dei due ne ha già uno
        if (inputSource.value) inputTarget.value = inputSource.value;
    }
}

// 2. Sincronizza tutti gli input attualmente presenti nel DOM (fino a 3)
function sincronizzaTuttiMarchi() {
    [1, 2, 3].forEach(i => {
        legaSincronizzazione(`input-m${i}-nome`, `input-rm${i}-nome`);
    });
}

function aggiornaMarchi() {
    const container = document.getElementById('container-marchi');
    const righe = container.querySelectorAll('.flex-form');

    righe.forEach((row, index) => {
        const nuovoIndex = index + 1;
        const inputM = row.querySelector('input[type="text"]');
        let btnRimuovi = row.querySelector('.btn-rimuovi-marchio');

        // Aggiorna ID e Placeholder di inputM
        inputM.id = `input-m${nuovoIndex}-nome`;
        inputM.placeholder = `Nome Marchio #${nuovoIndex}`;

        // Gestione pulsante rimozione e layout
        if (righe.length === 1) {
            inputM.style.width = '100%';
            if (btnRimuovi) btnRimuovi.remove();
        } else {
            inputM.style.width = '93%';
            
            if (!btnRimuovi) {
                btnRimuovi = document.createElement('button');
                btnRimuovi.type = 'button';
                btnRimuovi.className = 'input-form btn-rimuovi-marchio';
                btnRimuovi.style.cssText = 'width: 7%; background-color: red; font-weight: bold; margin-top: 0;';
                btnRimuovi.innerHTML = '&#128465;';

                row.appendChild(btnRimuovi);
            }

            btnRimuovi.onclick = () => {
                row.remove();
                aggiornaMarchi();
            };
        }
    });

    // NUOVO: Ri-applica i listener di sincronizzazione ogni volta che cambia la struttura/gli ID
    sincronizzaTuttiMarchi();
}

// Inizializzazione al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    // Prima sincronizzazione per le righe già presenti nel DOM
    sincronizzaTuttiMarchi();
});

// Listener del bottone "Aggiungi"
document.getElementById('btn-aggiungi-marchio').addEventListener('click', () => {
    const container = document.getElementById('container-marchi');
    const righeAttuali = container.querySelectorAll('.flex-form').length;

    if (righeAttuali >= 3) {
        alert('Puoi inserire al massimo 3 marchi.');
        return;
    }

    const row = document.createElement('div');
    row.className = 'flex-form marchi-row';
    row.innerHTML = `<input type="text" class="input-form">`;

    container.appendChild(row);

    // Aggiorna ID, layout, eliminazioni E risincronizza gli input
    aggiornaMarchi();
});

/*
[0, 1, 2, 3].forEach(i => {
    document.getElementById(`input-radio-org${i}`).addEventListener('change', (event) => {
        document.getElementById(`input-div-org${i}`).style.display = event.target.value === "0" ? "none" : "block";
    });
});
*/

function attivaAltro(checkbox, settore) {
    // Attiva se selezionato, disattiva se deselezionato
    document.getElementById(`input-set${settore}-altro`).disabled = !checkbox.checked;
    
    // Se viene deselezionato, pulisce il testo digitato in precedenza
    if (!checkbox.checked) {
        document.getElementById(`input-set${settore}-altro`).value = "";
    }
}    