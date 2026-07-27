# Versioni del documento

| **VERSIONE** | **OWNER** | **AZIENDA** | **DATA** | **NOTE** |
| --- | --- | --- | --- | --- |
| `1.0.0` | Matteo Spasiano | Retail IN S.r.l. | 01/09/2026 | *Prima release* |

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

| **COMPONENTE** | **DESCRIZIONE** | **TIPO** | **STEP** | **PAGINA** | **OBBLIGATORIO** |
| --- | --- | --- | --- | --- | --- |
| `input-terms-conditions` | Checkbox di presa visione Note Informative | `checkbox` | 0 | #N/A | ✅ |
| `input-ck-tdp` | Checkbox di presa visione Trattamento dei Dati Personali | `checkbox` | 0 | #N/A | ✅ |
| `input-nome-societa` | Nome della società | `text` | 1 | 0 | ✅ |
| `input-tipo-societa` | Forma giuridica dell’azienda (e.g. S.r.l.) | `select` | 1 | 0 | ✅ |
| `input-sede-via` | Via dell’azienda | `text` | 1 | 0 | ✅ |
| `input-sede-nciv` | Numero civico relativo alla via dell’azienda | `number` | 1 | 0 | ✅ |
| `input-sede-prov` | Provincia in cui si trova la sede dell’azienda | `text` | 1 | 0 | ✅ |
| `input-sede-citta` | Città in cui è situata l’azienda | `text` | 1 | 0 | ✅ |
| `input-sede-cap` | CAP della città in cui è situata l’azienda | `number` | 1 | 0 | ✅ |
| `input-nome-rappresentante` | Nome del rappresentante aziendale | `text` | 1 | 0 | ✅ |
| `input-cognome-rappresentante` | Cognome del rappresentante aziendale | `text` | 1 | 0 | ✅ |
| `input-nome-ref`  | Nome del referente per Confimprese | `text`  | 2 | 1 | ✅ |
| `input-cognome-ref` | Cognome del referente per Confimprese | `text` | 2 | 1 | ✅ |
| `input-ruolo-ref` | Ruolo in azienda del referente per Confimprese | `text` | 2 | 1 | ✅ |
| `input-email-ref` | Email del referente per Confimprese | `email` | 2 | 1 | ✅ |
| `input-mob-ref` | Recapito telefonico del referente per Confimprese | `number` | 2 | 1 | ✅ |
| `input-sito-ref` | Sito aziendale | `text` | 2 | 1 |  |
| `input-marchi-ref` | Marchi posseduti dall’azienda | `text` | 2 | 1 |  |
| `input-sdi-ref` | Codice SDI dell’azienda | `text` | 2 | 1 | ✅ |
| `input-pec-ref` | Indirizzo PEC dell’azienda | `email` | 2 | 1 | ✅ |
| `input-piva-ref` | Partita IVA dell’azienda | `text` | 2 | 1 | ✅ |
| `input-nome-rop` | Nome del referente operativo | `text`  | 3 | 1 | ✅ |
| `input-cognome-rop` | Cognome del referente operativo | `text` | 3 | 1 | ✅ |
| `input-ruolo-rop` | Ruolo in azienda del referente operativo | `text` | 3 | 1 | ✅ |
| `input-email-rop` | Email del referente operativo | `email` | 3 | 1 | ✅ |
| `input-mob-rop` | Recapito telefonico del referente operativo | `number` | 3 | 1 | ✅ |
| `input-email` | Email a cui inviare una copia del modulo compilato | `email`  | 4 | #N/A |  |

## Firma

Firma ancora da implementare.

## Invio via mail

La logica di invio mail è stata implementata tramite script PHP che utilizza la libreria `PHPMailer`.

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
| `main`  | Main branch | Produzione |
| `dev-matteo`  | Branch di test | Collaudo |

# URL Form

È possibile raggiungere il form tramite i seguenti URL:

| URL | AMBIENTE |
| --- | --- |
|  | Produzione |
| https://coll.confimprese.retailin.it/ | Collaudo |
