# Versioni del documento

| **VERSIONE** | **OWNER** | **AZIENDA** | **DATA** | **NOTE** |
| --- | --- | --- | --- | --- |
| `1.0.0` | Matteo Spasiano | Retail IN S.r.l. | 31/08/2026 | *Prima release* |

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
| **`input-terms-conditions`** | Checkbox di presa visione Note Informative | `checkbox` | 0 | #N/A | ✅ |
| **`input-ck-tdp`** | Checkbox di presa visione Trattamento dei Dati Personali | `checkbox` | 0 | #N/A | ✅ |
| **`data-luogo-pag1`** | Data e luogo di sottoscrizione (Pagina 1) | `auto/text` | 0 | 1 | ❌ |
| **`data-luogo-pag7`** | Data e luogo di sottoscrizione (Pagina 7) | `auto/text` | 0 | 7 | ❌ |
| **`data-luogo-pag8`** | Data e luogo di sottoscrizione (Pagina 8) | `auto/text` | 0 | 8 | ❌ |
| **`input-nome-societa`** | Nome della società | `text` | 1 | 1 | ✅ |
| **`input-tipo-societa`** | Forma giuridica dell’azienda (e.g. S.r.l., S.p.A.) | `select` | 1 | 1 | ✅ |
| **`input-sede-via`** | Indirizzo della sede legale (Via/Piazza) | `text` | 1 | 1 | ✅ |
| **`input-sede-nciv`** | Numero civico della sede legale | `text` | 1 | 1 | ✅ |
| **`input-sede-citta`** | Città della sede legale | `text` | 1 | 1 | ✅ |
| **`input-sede-prov`** | Provincia della sede legale | `text` | 1 | 1 | ✅ |
| **`input-sede-cap`** | CAP della sede legale | `text` | 1 | 1 | ✅ |
| **`input-nome-rappresentante`** | Nome del Rappresentante Legale | `text` | 1 | 1 | ✅ |
| **`input-cognome-rappresentante`** | Cognome del Rappresentante Legale | `text` | 1 | 1 | ✅ |
| **`input-nome-ref`** | Nome del Referente | `text` | 2 | 2 | ✅ |
| **`input-cognome-ref`** | Cognome del Referente | `text` | 2 | 2 | ✅ |
| **`input-ruolo-ref`** | Ruolo del Referente | `text` | 2 | 2 | ✅ |
| **`input-email-ref`** | Email del Referente | `text` | 2 | 2 | ✅ |
| **`input-mob-ref`** | Cellulare del Referente | `text` | 2 | 2 | ✅ |
| **`input-sito-ref`** | Sito web aziendale/referente | `text` | 2 | 2 | ❌ |
| **`input-m1-nome`** | Nome Marchio 1 | `text` | 2 | 2 | ❌ |
| **`input-m2-nome`** | Nome Marchio 2 | `text` | 2 | 2 | ❌ |
| **`input-m3-nome`** | Nome Marchio 3 | `text` | 2 | 2 | ❌ |
| **`input-sdi-ref`** | Codice SDI per fatturazione | `text` | 2 | 2 | ✅ |
| **`input-pec-ref`** | Indirizzo PEC | `text` | 2 | 2 | ✅ |
| **`input-piva-ref`** | Partita IVA | `text` | 2 | 2 | ✅ |
| **`input-nome-rop`** | Nome del Referente Operativo | `text` | 3 | 2 | ✅ |
| **`input-cognome-rop`** | Cognome del Referente Operativo | `text` | 3 | 2 | ✅ |
| **`input-ruolo-rop`** | Ruolo del Referente Operativo | `text` | 3 | 2 | ✅ |
| **`input-email-rop`** | Email del Referente Operativo | `text` | 3 | 2 | ✅ |
| **`input-mob-rop`** | Cellulare del Referente Operativo | `text` | 3 | 2 | ✅ |
| **`input-set0-0`** | Opzione Settore 0 - Item 0 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-1`** | Opzione Settore 0 - Item 1 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-2`** | Opzione Settore 0 - Item 2 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-3`** | Opzione Settore 0 - Item 3 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-4`** | Opzione Settore 0 - Item 4 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-5`** | Opzione Settore 0 - Item 5 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-6`** | Opzione Settore 0 - Item 6 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-7`** | Opzione Settore 0 - Item 7 | `checkbox` | 4 | 2 | ❌ |
| **`input-set0-altro`** | Specifica altro per Settore 0 | `text` | 4 | 2 | ❌ |
| **`input-set1-0`** | Opzione Settore 1 - Item 0 | `checkbox` | 4 | 2 | ❌ |
| **`input-set1-1`** | Opzione Settore 1 - Item 1 | `checkbox` | 4 | 2 | ❌ |
| **`input-set1-2`** | Opzione Settore 1 - Item 2 | `checkbox` | 4 | 2 | ❌ |
| **`input-set2-0`** | Opzione Settore 2 - Item 0 | `checkbox` | 4 | 2 | ❌ |
| **`input-set3-0`** | Opzione Settore 3 - Item 0 | `checkbox` | 4 | 2 | ❌ |
| **`input-set3-1`** | Opzione Settore 3 - Item 1 | `checkbox` | 4 | 2 | ❌ |
| **`input-set3-2`** | Opzione Settore 3 - Item 2 | `checkbox` | 4 | 2 | ❌ |
| **`input-set3-3`** | Opzione Settore 3 - Item 3 | `checkbox` | 4 | 3 | ❌ |
| **`input-set3-4`** | Opzione Settore 3 - Item 4 | `checkbox` | 4 | 3 | ❌ |
| **`input-set3-altro`** | Specifica altro per Settore 3 | `text` | 4 | 3 | ❌ |
| **`input-set4-0`** | Opzione Settore 4 - Item 0 | `checkbox` | 4 | 3 | ❌ |
| **`input-set5-0`** | Opzione Settore 5 - Item 0 | `checkbox` | 4 | 3 | ❌ |
| **`input-set5-1`** | Opzione Settore 5 - Item 1 | `checkbox` | 4 | 3 | ❌ |
| **`input-set5-2`** | Opzione Settore 5 - Item 2 | `checkbox` | 4 | 3 | ❌ |
| **`input-set5-altro`** | Specifica altro per Settore 5 | `text` | 4 | 3 | ❌ |
| **`input-set6-0`** | Opzione Settore 6 - Item 0 | `checkbox` | 4 | 3 | ❌ |
| **`input-set7-0`** | Opzione Settore 7 - Item 0 | `checkbox` | 4 | 3 | ❌ |
| **`input-set7-1`** | Opzione Settore 7 - Item 1 | `checkbox` | 4 | 3 | ❌ |
| **`input-set7-2`** | Opzione Settore 7 - Item 2 | `checkbox` | 4 | 3 | ❌ |
| **`input-set7-altro`** | Specifica altro per Settore 7 | `text` | 4 | 3 | ❌ |
| **`input-set8-0`** | Opzione Settore 8 - Item 0 | `checkbox` | 4 | 3 | ❌ |
| **`input-set8-1`** | Opzione Settore 8 - Item 1 | `checkbox` | 4 | 3 | ❌ |
| **`input-set8-2`** | Opzione Settore 8 - Item 2 | `checkbox` | 4 | 3 | ❌ |
| **`input-set8-3`** | Opzione Settore 8 - Item 3 | `checkbox` | 4 | 3 | ❌ |
| **`input-set8-4`** | Opzione Settore 8 - Item 4 | `checkbox` | 4 | 3 | ❌ |
| **`input-set8-5`** | Opzione Settore 8 - Item 5 | `checkbox` | 4 | 3 | ❌ |
| **`input-set8-altro`** | Specifica altro per Settore 8 | `text` | 4 | 3 | ❌ |
| **`input-competitor`** | Principali concorrenti/competitor | `text` | 5 | 3 | ❌ |
| **`input-div-ass`** | Selezione Associazioni di appartenenza | `checkbox (group)` | 5 | 3 | ❌ |
| **`input-altro-ass`** | Specifica altre Associazioni | `text` | 5 | 3 | ❌ |
| **`input-ccnl`** | Selezione CCNL applicato | `radio (group)` | 5 | 3 | ✅ |
| **`input-altro-ccnl`** | Specifica altro CCNL | `text` | 5 | 3 | ❌ |
| **`input-ndip-sede`** | Numero dipendenti nella sede legale | `text` | 6 | 4 | ✅ |
| **`input-ndip-pv`** | Numero dipendenti nei punti vendita | `text` | 6 | 4 | ❌ |
| **`input-occ-indiretti`** | Occupati indiretti | `text` | 6 | 4 | ❌ |
| **`input-fatt-24`** | Fatturato Anno 2024 | `text` | 6 | 4 | ❌ |
| **`input-fatt-23`** | Fatturato Anno 2023 | `text` | 6 | 4 | ❌ |
| **`input-fatt-22`** | Fatturato Anno 2022 | `text` | 6 | 4 | ❌ |
| **`input-varf-24`** | Variazione Fatturato % 2024 | `text` | 6 | 4 | ❌ |
| **`input-varf-23`** | Variazione Fatturato % 2023 | `text` | 6 | 4 | ❌ |
| **`input-varf-22`** | Variazione Fatturato % 2022 | `text` | 6 | 4 | ❌ |
| **`input-sell-out`** | Valore Sell-out | `text` | 6 | 4 | ❌ |
| **`input-quota-mercato`** | Stima Quota di Mercato % | `text` | 6 | 4 | ❌ |
| **`input-fma-dir`** | Fatturato Medio Aziendale - Punti Diretti | `text` | 6 | 4 | ❌ |
| **`input-fma-franchising`** | Fatturato Medio Aziendale - Franchising | `text` | 6 | 4 | ❌ |
| **`input-rm1-nome`** | Rete/Marchio 1 - Nome | `text` | 7 | 4 | ❌ |
| **`input-rm1-anno`** | Rete/Marchio 1 - Anno avvio | `text` | 7 | 4 | ❌ |
| **`input-rm1-npv-dir`** | Rete/Marchio 1 - N. Punti Vendita Diretti | `text` | 7 | 4 | ❌ |
| **`input-rm1-npv-fr`** | Rete/Marchio 1 - N. Punti Vendita Franchising | `text` | 7 | 4 | ❌ |
| **`input-rm1-npv-altro`** | Rete/Marchio 1 - N. Punti Vendita Altri | `text` | 7 | 4 | ❌ |
| **`input-rm1-ub-div`** | Rete/Marchio 1 - Ubicazioni PV | `checkbox (group)` | 7 | 4 | ❌ |
| **`input-rm1-ub-altro`** | Rete/Marchio 1 - Specifica altre ubicazioni | `text` | 7 | 4 | ❌ |
| **`input-rm1-mq-dir`** | Rete/Marchio 1 - Mq Medi Punti Diretti | `radio (group)` | 7 | 4 | ❌ |
| **`input-rm1-mq-fr`** | Rete/Marchio 1 - Mq Medi Franchising | `radio (group)` | 7 | 4 | ❌ |
| **`input-rm1-ps-dir`** | Rete/Marchio 1 - Personale per PV Diretto | `text` | 7 | 4 | ❌ |
| **`input-rm1-ps-fr`** | Rete/Marchio 1 - Personale per PV Franchising | `text` | 7 | 4 | ❌ |
| **`input-rm1-cs-0`** | Rete/Marchio 1 - Canale Sviluppo Option 0 | `checkbox` | 7 | 4 | ❌ |
| **`input-rm1-cs-1`** | Rete/Marchio 1 - Canale Sviluppo Option 1 | `checkbox` | 7 | 4 | ❌ |
| **`input-rm1-cs-2`** | Rete/Marchio 1 - Canale Sviluppo Option 2 | `checkbox` | 7 | 5 | ❌ |
| **`input-rm1-cs-3`** | Rete/Marchio 1 - Canale Sviluppo Option 3 | `checkbox` | 7 | 5 | ❌ |
| **`input-rm1-cs-4`** | Rete/Marchio 1 - Canale Sviluppo Option 4 | `checkbox` | 7 | 5 | ❌ |
| **`input-rm2-nome`** | Rete/Marchio 2 - Nome | `text` | 8 | 5 | ❌ |
| **`input-rm2-anno`** | Rete/Marchio 2 - Anno avvio | `text` | 8 | 5 | ❌ |
| **`input-rm2-npv-dir`** | Rete/Marchio 2 - N. Punti Vendita Diretti | `text` | 8 | 5 | ❌ |
| **`input-rm2-npv-fr`** | Rete/Marchio 2 - N. Punti Vendita Franchising | `text` | 8 | 5 | ❌ |
| **`input-rm2-npv-altro`** | Rete/Marchio 2 - N. Punti Vendita Altri | `text` | 8 | 5 | ❌ |
| **`input-rm2-ub-div`** | Rete/Marchio 2 - Ubicazioni PV | `checkbox (group)` | 8 | 5 | ❌ |
| **`input-rm2-ub-altro`** | Rete/Marchio 2 - Specifica altre ubicazioni | `text` | 8 | 5 | ❌ |
| **`input-rm2-mq-dir`** | Rete/Marchio 2 - Mq Medi Punti Diretti | `radio (group)` | 8 | 5 | ❌ |
| **`input-rm2-mq-fr`** | Rete/Marchio 2 - Mq Medi Franchising | `radio (group)` | 8 | 5 | ❌ |
| **`input-rm2-ps-dir`** | Rete/Marchio 2 - Personale per PV Diretto | `text` | 8 | 5 | ❌ |
| **`input-rm2-ps-fr`** | Rete/Marchio 2 - Personale per PV Franchising | `text` | 8 | 5 | ❌ |
| **`input-rm2-cs-div`** | Rete/Marchio 2 - Canali di Sviluppo | `checkbox (group)` | 8 | 5 | ❌ |
| **`input-rm3-nome`** | Rete/Marchio 3 - Nome | `text` | 9 | 6 | ❌ |
| **`input-rm3-anno`** | Rete/Marchio 3 - Anno avvio | `text` | 9 | 6 | ❌ |
| **`input-rm3-npv-dir`** | Rete/Marchio 3 - N. Punti Vendita Diretti | `text` | 9 | 6 | ❌ |
| **`input-rm3-npv-fr`** | Rete/Marchio 3 - N. Punti Vendita Franchising | `text` | 9 | 6 | ❌ |
| **`input-rm3-npv-altro`** | Rete/Marchio 3 - N. Punti Vendita Altri | `text` | 9 | 6 | ❌ |
| **`input-rm3-ub-div`** | Rete/Marchio 3 - Ubicazioni PV | `checkbox (group)` | 9 | 6 | ❌ |
| **`input-rm3-ub-altro`** | Rete/Marchio 3 - Specifica altre ubicazioni | `text` | 9 | 6 | ❌ |
| **`input-rm3-mq-dir`** | Rete/Marchio 3 - Mq Medi Punti Diretti | `radio (group)` | 9 | 6 | ❌ |
| **`input-rm3-mq-fr`** | Rete/Marchio 3 - Mq Medi Franchising | `radio (group)` | 9 | 6 | ❌ |
| **`input-rm3-ps-dir`** | Rete/Marchio 3 - Personale per PV Diretto | `text` | 9 | 6 | ❌ |
| **`input-rm3-ps-fr`** | Rete/Marchio 3 - Personale per PV Franchising | `text` | 9 | 6 | ❌ |
| **`input-rm3-cs-div`** | Rete/Marchio 3 - Canali di Sviluppo | `checkbox (group)` | 9 | 6 | ❌ |
| **`input-radio-est`** | Presenza/Attività all'estero (Sì/No) | `radio (group)` | 10 | 7 | ❌ |
| **`input-paesi-estero`** | Paesi esteri di presenza | `text` | 10 | 7 | ❌ |
| **`input-est-dir`** | N. Punti vendita Diretti all'estero | `text` | 10 | 7 | ❌ |
| **`input-est-fr`** | N. Punti vendita Franchising all'estero | `text` | 10 | 7 | ❌ |
| **`input-est-altro`** | Altra tipologia punti vendita all'estero | `text` | 10 | 7 | ❌ |
| **`input-est-plan`** | Piani di espansione all'estero | `text` | 10 | 7 | ❌ |
| **`input-plan-dir`** | Pianificazione PV Diretti | `text` | 10 | 7 | ❌ |
| **`input-plan-fr`** | Pianificazione PV Franchising | `text` | 10 | 7 | ❌ |
| **`input-plan-altro`** | Pianificazione altre tipologie PV | `text` | 10 | 7 | ❌ |

## Firma

Il metodo di firma e validazione giuridica del documento non è ancora stato concordato con Confimprese.

## Invio via mail

La logica di invio mail è stata implementata tramite script PHP che utilizza la libreria `PHPMailer` .

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