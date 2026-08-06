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

let stepCorrente = 0;
const totaleStep = 10;

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

    // Aggiorna l'indice dello step
    stepCorrente += direzione;
    
    // Skip step in caso una checkbox sia checked o un text esista
    const mapSkip = [
        {step: 3, id: "input-ck-ref", type: "checkbox"},
        {step: 6, id: "input-m1-nome", type: "text"},
        {step: 7, id: "input-m2-nome", type: "text"},
        {step: 8, id: "input-m3-nome", type: "text"},
    ];

    mapSkip.forEach(c => {
        if (
            c.step === stepCorrente && (
                (c.type === "checkbox" && document.getElementById(c.id).checked) || 
                (c.type === "text" && ( !document.getElementById(c.id) || document.getElementById(c.id).value === "")
            )))
            cambiaStep(direzione);
    })

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

// Funzione per aggiornare i numeri dei placeholder
function aggiornaMarchi() {
    const container = document.getElementById('container-marchi');
    const righe = container.querySelectorAll('.flex-form');

    righe.forEach((row, index) => {
        const nuovoIndex = index + 1;
        const inputM = row.querySelector('input[type="text"]');
        let btnRimuovi = row.querySelector('.btn-rimuovi-marchio');

        // 1. Aggiorna ID e Placeholder di inputM
        inputM.id = `input-m${nuovoIndex}-nome`;
        inputM.placeholder = `Nome Marchio #${nuovoIndex}`;

        // 2. Gestione del pulsante di rimozione e del layout
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

            // IMPORTANTE: Aggiorniamo SEMPRE l'evento click per riflettere la riga e l'indice corretti
            btnRimuovi.onclick = () => {
                row.remove();

                // Ricalcola tutti gli ID, placeholder e associazioni
                aggiornaMarchi();
            };
        }
    });
}

document.getElementById('btn-aggiungi-marchio').addEventListener('click', () => {
    const container = document.getElementById('container-marchi');
    const righeAttuali = container.querySelectorAll('.flex-form').length;

    // Limite massimo 3
    if (righeAttuali >= 3) {
        alert('Puoi inserire al massimo 3 marchi.');
        return;
    }

    // Crea la nuova riga (vuota, se ne occupa aggiornaMarchi)
    const row = document.createElement('div');
    row.className = 'flex-form marchi-row';
    row.innerHTML = `<input type="text" class="input-form">`;

    container.appendChild(row);

    // Aggiorna subito ID, placeholder, bottoni di eliminazione e larghezze
    aggiornaMarchi();
});

// 1. Attiva/Disattiva il campo di testo "Altro" in base alla checkbox
function attivaAltroUbicazione(checkbox, i) {
    const inputAltro = document.getElementById(`input-rm${i}-ub-altro`);
    
    inputAltro.disabled = !checkbox.checked;
    
    // Se viene deselezionata, pulisce il campo di testo
    if (!checkbox.checked) {
        inputAltro.value = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Usiamo indici da 1 a 3 (1, 2, 3) per coincidere con ID (input-m1-nome, input-m2-nome, ...)
    [1, 2, 3].forEach(i => {
        const inputSource = document.getElementById(`input-m${i}-nome`);
        const inputTarget = document.getElementById(`input-rm${i}-nome`);

        // Sincronizza da input-mX a input-rmX
        if (inputSource && inputTarget) {
            inputSource.addEventListener("input", () => {
                inputTarget.value = inputSource.value;
            });

            // Sincronizza bidirezionale (da input-rmX a input-mX)
            inputTarget.addEventListener("input", () => {
                inputSource.value = inputTarget.value;
            });
        }
    });
});