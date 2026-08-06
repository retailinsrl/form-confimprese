!image.png

# Indice

# Versioni del documento

| **VERSIONE** | **OWNER** | **AZIENDA** | **DATA** | **NOTE** |
| --- | --- | --- | --- | --- |
| `1.0.0` | Matteo Spasiano | Retail IN S.r.l. | 24/07/2026 | *Prima release* |

---

# Scopo

Lo scopo del progetto è digitalizzare l’attuale modulo di adesione a Confimprese, trasformandolo in un documento compilabile attraverso un’interfaccia Web intuitiva e di facile utilizzo. La soluzione consentirà agli utenti di gestire l’intero processo di compilazione in modo semplice, rapido e sicuro, offrendo le seguenti funzionalità:

- compilazione guidata del modulo mediante inserimento dei dati richiesti;
- anteprima del documento con possibilità di revisionare e modificare le informazioni inserite prima della conferma;
- apposizione di una firma digitale, in conformità alle normative vigenti, al fine di garantire l’integrità del documento e la sua validità legale;
- invio automatico del modulo compilato tramite posta elettronica ai destinatari previsti.

# Soluzione adottata

Di seguito viene riportata nel dettaglio la soluzione adottata nella fase di sviluppo del progetto.

## L’interfaccia web

È stata implementata una pagina HTML unica divisa per step.

È possibile muoversi tra gli step tramite i pulsanti sottostanti al form **Indietro** e **Avanti**.

Al termine del form:

- viene richiesto di inserire un indirizzo e-mail a cui inviare una copia compilata del modulo;
- il pulsante **Avanti** viene sostituito da **Genera Anteprima PDF**.

Una volta cliccato il pulsante **Genera Anteprima PDF**, sotto ai pulsanti comparirà un’anteprima del modulo PDF compilato coi valori precedentemente inseriti.

È possibile revisionare il PDF e, qualora un campo risulti da modificare:

- tornare indietro allo step desiderato;
- modificare il campo;
- tornare in fondo al form e rigenerare l’anteprima.

Una volta soddisfatti, cliccare su **Conferma e Invia** per inviare il form tramite mail a Confimprese e all’indirizzo e-mail indicato.

### Mapping dei campi presenti nel form

Di seguito vengono riportati i campi implementati nel form, con il relativo componente:

| COMPONENTE | DESCRIZIONE | TIPO | STEP | PAGINA | OBBLIGATORIO |
| --- | --- | --- | --- | --- | --- |
| `input-terms-conditions` | Checkbox di presa visione Note Informative | checkbox | 0 | #N/A | ✅ |
| `input-ck-tdp` | Checkbox di presa visione Trattamento dei Dati Personali | checkbox | 0 | #N/A | ✅ |
| `data-luogo-pag1` | Data e luogo di sottoscrizione (Pagina 1) | auto/text | N/A | 0 | ❌ |
| `input-nome-societa` | Nome della società | text | 1 | 0 | ✅ |
| `input-tipo-societa` | Forma giuridica dell’azienda (e.g. S.r.l., S.p.A.) | select | 1 | 0 | ✅ |
| `input-sede-via` | Indirizzo della sede legale (Via/Piazza) | text | 1 | 0 | ✅ |
| `input-sede-nciv` | Numero civico della sede legale | text | 1 | 0 | ✅ |
| `input-sede-citta` | Città della sede legale | text | 1 | 0 | ✅ |
| `input-sede-prov` | Provincia della sede legale (Sigla) | text | 1 | 0 | ✅ |
| `input-sede-cap` | CAP della sede legale | text | 1 | 0 | ✅ |
| `input-nome-rappresentante` | Nome del Legale Rappresentante | text | 1 | 0 | ✅ |
| `input-cognome-rappresentante` | Cognome del Legale Rappresentante | text | 1 | 0 | ✅ |
| `input-nome-ref` | Nome del Referente Aziendale | text | 2 | 1 | ✅ |
| `input-cognome-ref` | Cognome del Referente Aziendale | text | 2 | 1 | ✅ |
| `input-ruolo-ref` | Ruolo / Carica del Referente | text | 2 | 1 | ✅ |
| `input-email-ref` | Email del Referente | email | 2 | 1 | ✅ |
| `input-mob-ref` | Telefono cellulare del Referente | tel | 2 | 1 | ✅ |
| `input-sito-ref` | Sito web aziendale | text | 2 | 1 | ❌ |
| `input-m1-nome` | Nome Marchio 1 | text | 2 | 1 | ❌ |
| `input-m2-nome` | Nome Marchio 2 | text | 2 | 1 | ❌ |
| `input-m3-nome` | Nome Marchio 3 | text | 2 | 1 | ❌ |
| `input-sdi-ref` | Codice Destinatario SDI | text | 2 | 1 | ✅ |
| `input-pec-ref` | Indirizzo PEC | email | 2 | 1 | ✅ |
| `input-piva-ref` | Partita IVA / Codice Fiscale | text | 2 | 1 | ✅ |
| `input-nome-rop` | Nome Responsabile Operativo (ROP) | text | 3 | 1 | ✅ |
| `input-cognome-rop` | Cognome Responsabile Operativo (ROP) | text | 3 | 1 | ✅ |
| `input-ruolo-rop` | Ruolo Responsabile Operativo | text | 3 | 1 | ✅ |
| `input-email-rop` | Email Responsabile Operativo | email | 3 | 1 | ✅ |
| `input-mob-rop` | Telefono cellulare Responsabile Operativo | tel | 3 | 1 | ✅ |
| `input-competitor` | Principali concorrenti / Competitor | text | 4 | 2 | ❌ |
| `input-div-ass` | Selezione Associazioni di categoria | checkbox (array) | 4 | 2 | ❌ |
| `input-altro-ass` | Altre associazioni (specificare) | text | 4 | 2 | ❌ |
| `input-ccnl` | Contratto Collettivo Nazionale del Lavoro (CCNL) applicato | select/radio | 4 | 2 | ❌ |
| `input-altro-ccnl` | Altro CCNL (specificare) | text | 4 | 2 | ❌ |
| `input-ndip-sede` | Numero dipendenti nella sede centrale | number | 5 | 3 | ❌ |
| `input-ndip-pv` | Numero dipendenti nei punti vendita | number | 5 | 3 | ❌ |
| `input-occ-indiretti` | Occupati indiretti / Collaboratori | number | 5 | 3 | ❌ |
| `input-fatt-24` | Fatturato anno 2024 | number/currency | 5 | 3 | ❌ |
| `input-fatt-23` | Fatturato anno 2023 | number/currency | 5 | 3 | ❌ |
| `input-fatt-22` | Fatturato anno 2022 | number/currency | 5 | 3 | ❌ |
| `input-varf-24` | Variazione % Fatturato 2024 | number/percentage | 5 | 3 | ❌ |
| `input-varf-23` | Variazione % Fatturato 2023 | number/percentage | 5 | 3 | ❌ |
| `input-varf-22` | Variazione % Fatturato 2022 | number/percentage | 5 | 3 | ❌ |
| `input-sell-out` | Valore Sell-out complessivo | number/currency | 5 | 3 | ❌ |
| `input-quota-mercato` | Quota di mercato stimata (%) | number/percentage | 5 | 3 | ❌ |
| `input-fma-dir` | Fatturato Medio Annuo punti vendita diretti | number/currency | 5 | 3 | ❌ |
| `input-fma-franchising` | Fatturato Medio Annuo punti vendita franchising | number/currency | 5 | 3 | ❌ |
| `input-rm1-nome` | Nome Rete/Marchio 1 | text | 6 | 3 | ❌ |
| `input-rm1-anno` | Anno di avvio Rete/Marchio 1 | number | 6 | 3 | ❌ |
| `input-rm1-npv-dir` | N° punti vendita diretti (Rete 1) | number | 6 | 3 | ❌ |
| `input-rm1-npv-fr` | N° punti vendita franchising (Rete 1) | number | 6 | 3 | ❌ |
| `input-rm1-npv-altro` | N° altri punti vendita (Rete 1) | number | 6 | 3 | ❌ |
| `input-rm1-ub-div` | Ubicazioni punti vendita (Rete 1) | checkbox (array) | 6 | 3 | ❌ |
| `input-rm1-ub-altro` | Altra ubicazione Rete 1 (specificare) | text | 6 | 3 | ❌ |
| `input-rm1-mq-dir` | Superficie media (mq) PV diretti (Rete 1) | select/radio | 6 | 3 | ❌ |
| `input-rm1-mq-fr` | Superficie media (mq) PV franchising (Rete 1) | select/radio | 6 | 3 | ❌ |
| `input-rm1-ps-dir` | Personale medio PV diretti (Rete 1) | number | 6 | 3 | ❌ |
| `input-rm1-ps-fr` | Personale medio PV franchising (Rete 1) | number | 6 | 3 | ❌ |
| `input-rm1-cs-0` | Canale di sviluppo Rete 1 - Opzione 1 | checkbox | 6 | 3 | ❌ |
| `input-rm1-cs-1` | Canale di sviluppo Rete 1 - Opzione 2 | checkbox | 6 | 3 | ❌ |
| `input-rm1-cs-2` | Canale di sviluppo Rete 1 - Opzione 3 | checkbox | 6 | 4 | ❌ |
| `input-rm1-cs-3` | Canale di sviluppo Rete 1 - Opzione 4 | checkbox | 6 | 4 | ❌ |
| `input-rm1-cs-4` | Canale di sviluppo Rete 1 - Opzione 5 | checkbox | 6 | 4 | ❌ |
| `input-rm2-nome` | Nome Rete/Marchio 2 | text | 7 | 4 | ❌ |
| `input-rm2-anno` | Anno di avvio Rete/Marchio 2 | number | 7 | 4 | ❌ |
| `input-rm2-npv-dir` | N° punti vendita diretti (Rete 2) | number | 7 | 4 | ❌ |
| `input-rm2-npv-fr` | N° punti vendita franchising (Rete 2) | number | 7 | 4 | ❌ |
| `input-rm2-npv-altro` | N° altri punti vendita (Rete 2) | number | 7 | 4 | ❌ |
| `input-rm2-ub-div` | Ubicazioni punti vendita (Rete 2) | checkbox (array) | 7 | 4 | ❌ |
| `input-rm2-ub-altro` | Altra ubicazione Rete 2 (specificare) | text | 7 | 4 | ❌ |
| `input-rm2-mq-dir` | Superficie media (mq) PV diretti (Rete 2) | select/radio | 7 | 4 | ❌ |
| `input-rm2-mq-fr` | Superficie media (mq) PV franchising (Rete 2) | select/radio | 7 | 4 | ❌ |
| `input-rm2-ps-dir` | Personale medio PV diretti (Rete 2) | number | 7 | 4 | ❌ |
| `input-rm2-ps-fr` | Personale medio PV franchising (Rete 2) | number | 7 | 4 | ❌ |
| `input-rm2-cs-div` | Canali di sviluppo (Rete 2) | checkbox (array) | 7 | 4 | ❌ |
| `input-rm3-nome` | Nome Rete/Marchio 3 | text | 7 | 5 | ❌ |
| `input-rm3-anno` | Anno di avvio Rete/Marchio 3 | number | 7 | 5 | ❌ |
| `input-rm3-npv-dir` | N° punti vendita diretti (Rete 3) | number | 7 | 5 | ❌ |
| `input-rm3-npv-fr` | N° punti vendita franchising (Rete 3) | number | 7 | 5 | ❌ |
| `input-rm3-npv-altro` | N° altri punti vendita (Rete 3) | number | 7 | 5 | ❌ |
| `input-rm3-ub-div` | Ubicazioni punti vendita (Rete 3) | checkbox (array) | 7 | 5 | ❌ |
| `input-rm3-ub-altro` | Altra ubicazione Rete 3 (specificare) | text | 7 | 5 | ❌ |
| `input-rm3-mq-dir` | Superficie media (mq) PV diretti (Rete 3) | select/radio | 7 | 5 | ❌ |
| `input-rm3-mq-fr` | Superficie media (mq) PV franchising (Rete 3) | select/radio | 7 | 5 | ❌ |
| `input-rm3-ps-dir` | Personale medio PV diretti (Rete 3) | number | 7 | 5 | ❌ |
| `input-rm3-ps-fr` | Personale medio PV franchising (Rete 3) | number | 7 | 5 | ❌ |
| `input-rm3-cs-div` | Canali di sviluppo (Rete 3) | checkbox (array) | 7 | 5 | ❌ |
| `data-luogo-pag7` | Data e luogo di sottoscrizione (Pagina 7) | auto/text | N/A | 6 | ❌ |
| `input-radio-est` | Presenza all'estero (Sì / No) | radio | 9 | 6 | ❌ |
| `input-paesi-estero` | Elenco Paesi esteri di presenza | text | 9 | 6 | ❌ |
| `input-est-dir` | N° punti vendita diretti all'estero | number | 9 | 6 | ❌ |
| `input-est-fr` | N° punti vendita franchising all'estero | number | 9 | 6 | ❌ |
| `input-est-altro` | Altre forme di presenza all'estero | text | 9 | 6 | ❌ |
| `input-est-plan` | Piani di espansione all'estero | text | 9 | 6 | ❌ |
| `input-plan-dir` | Target sviluppi diretti estero | number | 9 | 6 | ❌ |
| `input-plan-fr` | Target sviluppi franchising estero | number | 9 | 6 | ❌ |
| `input-plan-altro` | Altri piani di sviluppo estero | text | 9 | 6 | ❌ |
| `data-luogo-pag8` | Data e luogo di sottoscrizione (Pagina 8) | auto/text | N/A | 7 | ❌ |

## Firma

Descrivi il metodo di firma…

## Invio via mail

La logica di invio mail è stata implementata tramite script PHP che utilizza la libreria `PHPMailer` .

## Integrazione reCAPTCHA

Si può integrare con:

https://www.gianlucaghettini.net/integrazione-di-recaptcha-v3-in-un-sito-web-guida-html-js-php

# Tecnologie utilizzate

Di seguito vengono riportate le tecnologie utilizzate nel corso degli sviluppi.

## Front-end

- HTML
- CSS
- JavaScript

## Back-end

- PHP

# Repository

Puoi trovare il repository di questo progetto al seguente link:

https://github.com/retailinsrl/form-confimprese

Le branch sono così divise:

| BRANCH | DESCRIZIONE | AMBIENTE |
| --- | --- | --- |
| `main`  | main branch | Produzione |
| `dev-matteo`  | Codice in collaudo | Sviluppo |

# URL Form

È possibile raggiungere il form tramite i seguenti URL:

| URL | AMBIENTE |
| --- | --- |
| https://coll.confimprese.retailin.it/ | Collaudo |
|  |  |