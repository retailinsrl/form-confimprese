let stepCorrente = 0;
const totaleStep = 11;

async function checkReCaptcha() {
    const turnstileToken = turnstile.getResponse();

    if (!turnstileToken) {
        alert("Per favore, completa la verifica di sicurezza per proseguire.");
        return false; // Blocca qui
    }

    try {
        // Prepariamo i dati da mandare a recaptcha.php
        const datiVerifica = new FormData();
        datiVerifica.append('cf-turnstile-response', turnstileToken);

        // Chiamata immediata al file PHP dedicato
        const risposta = await fetch('recaptcha.php', {
            method: 'POST',
            body: datiVerifica
        });

        const risultato = await risposta.json();

        if (risultato.status !== 'success') {
            alert("Verifica di sicurezza fallita: " + risultato.message);
            turnstile.reset(); // Resetta il widget in caso di fallimento
            return false; // BLOCCHIAMO il cambio step
        }
        
        // Se la risposta è 'success', il codice prosegue ed esegue il cambio step sotto
        return true;

    } catch (errore) {
        console.error("Errore di rete:", errore);
        alert("Errore di connessione durante la verifica di sicurezza.");
        return false; // Blocca in caso di errore di rete
    }
}

// 2. Funzione per navigare tra gli step del form
async function cambiaStep(direzione) {
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

        if (!inputElement.checkValidity() && direzione === 1) {
            inputElement.reportValidity();
            inputElement.classList.add('campo-errore');
            direzione = 0;
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

        // === NUOVA INTEGRAZIONE: VERIFICA SEPARATA LATO SERVER ===
         if (stepCorrente === 0) { 
            // Attende l'esito del server prima di procedere
            const verificaSuperata = await checkReCaptcha();
            
            // Se la verifica fallisce, blocca il cambio step immediatamente
            if (!verificaSuperata) {
                return; 
            }
        }

    }
    // Nascondi lo step corrente
    document.getElementById(`step-${stepCorrente}`).style.display = "none";

    // Aggiorna l'indice dello step
    stepCorrente += direzione;
    
    // Skip step in caso una checkbox sia checked o un text esista
    const mapSkip = [
        {step: 3, id: "input-ck-ref", type: "checkbox"},
        {step: 7, id: "input-m1-nome", type: "text"},
        {step: 8, id: "input-m2-nome", type: "text"},
        {step: 9, id: "input-m3-nome", type: "text"},
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

let intervalloAnimazione = null;
let percentualeVisualizzata = 0; // Tiene traccia del punto in cui si trova visivamente la barra

function aggiornaIndicatori() {
    // 1. Calcola la percentuale target reale dello step
    const percentualeTarget = (stepCorrente / totaleStep) * 100;

    const barFill = document.getElementById("progress-bar-fill");
    const progressText = document.getElementById("progress-text");

    // Interrompe un'eventuale animazione ancora in corso
    if (intervalloAnimazione) clearInterval(intervalloAnimazione);

    // 2. Avvia l'incremento a piccoli passi casuali
    intervalloAnimazione = setInterval(() => {
        // Genera un passo casuale (es. tra 0.5% e 2.5% per ogni frame)
        const passoRandom = (Math.random() * 2) + 0.5;

        if (percentualeVisualizzata < percentualeTarget) {
            percentualeVisualizzata += passoRandom;
            
            // Assicurati di non superare il valore target
            if (percentualeVisualizzata >= percentualeTarget) {
                percentualeVisualizzata = percentualeTarget;
                clearInterval(intervalloAnimazione);
            }
        } else if (percentualeVisualizzata > percentualeTarget) {
            // Gestisce anche la navigazione all'indietro
            percentualeVisualizzata -= passoRandom;
            
            if (percentualeVisualizzata <= percentualeTarget) {
                percentualeVisualizzata = percentualeTarget;
                clearInterval(intervalloAnimazione);
            }
        } else {
            clearInterval(intervalloAnimazione);
        }

        // 3. Aggiorna la barra e il testo
        if (barFill) {
            barFill.style.width = `${percentualeVisualizzata.toFixed(1)}%`;
        }
        if (progressText) {
            progressText.innerText = `${percentualeVisualizzata.toFixed(0)}%`;
        }
    }, 20); // Velocità dell'animazione (ogni 20ms aggiorna)
}

document.getElementById("btn-avanti").addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
});