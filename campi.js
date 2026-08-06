const oggi = new Intl.DateTimeFormat("it-IT", { 
    day: "2-digit", 
    month: "long", 
    year: "numeric" 
}).format(new Date()).toUpperCase();

const testoData = `MILANO, ${oggi}`;

const campi = [
    // Luogo e data per firme
    { 
        id: "data-luogo-pag1", x: 45, y: 152, pagina: 0, required: false, step: 1,
        render: (page, val, c) => {
            page.drawText(testoData, { x: c.x, y: c.y, size: 10 });
        }
    },
    { 
        id: "data-luogo-pag7", x: 45, y: 362, pagina: 6, required: false,
        render: (page, val, c) => {
            page.drawText(testoData, { x: c.x, y: c.y, size: 10 });
        }
    },
    { 
        id: "data-luogo-pag8", x: 80, y: 302, pagina: 7, required: false,
        render: (page, val, c) => {
            page.drawText(testoData, { x: c.x, y: c.y, size: 10 });
        }
    },
    
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

    { 
        id: "input-nome-rappresentante", x: 200, y: 543, pagina: 0, required: true, step: 1,
        render: (page, val, c) => {
            const cognome = document.getElementById("input-cognome-rappresentante").value.trim().toUpperCase();
            
            var carica;
            switch(document.getElementById("input-tipo-societa").value) {
                case "SRL":
                case "SRLS":
                case "SB":  carica = "AMM. UNICO";
                            break;
                case "SPA": carica = "AMM. DELEGATO";
                            break;
                case "SAPA":
                case "SAS": carica = "SOCIO ACCOMANDATARIO";
                            break;
                case "SNC":
                case "SS":  carica = "SOCIO AMM.";
                            break;
                case "DI":
                case "IF":  carica = "TITOLARE";
                            break;
                case "COOP":carica = "PRES. CDA";
                            break;
                    
                default:    carica = "";
            }


            page.drawText(`${val} ${cognome} - ${carica}`, { x: c.x, y: c.y, size: 8 });
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
    { 
        id: "input-m1-nome", x: 80, y: 558, pagina: 1, required: false, step: 2,
        render: (page, val, c) => {
            const el2 = document.getElementById("input-m2-nome");
            const el3 = document.getElementById("input-m3-nome");

            const m1 = val ? val.trim().toUpperCase() : "";
            const m2 = el2 ? el2.value.trim().toUpperCase() : "";
            const m3 = el3 ? el3.value.trim().toUpperCase() : "";

            // Unisce i marchi esistenti con una virgola e uno spazio
            const testoCompleto = [m1, m2, m3].filter(Boolean).join(", ");

            if (testoCompleto) {
                page.drawText(testoCompleto, { x: c.x, y: c.y, size: 8 });
            }
        }
    },
    { id: "input-m2-nome", required: false, step: 2 },
    { id: "input-m3-nome", required: false, step: 2 },
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
    { id: "input-competitor", x: 63, y: 423, pagina: 2, required: false, step: 4},
    { id: "input-div-ass", selector: 'input[name="associazioni[]"]:checked', x: 63, y: 362.5, pagina: 2, required: false, step: 4, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                // 1. Convertiamo il valore in un numero intero
                const index = parseInt(val, 10);

                // Evitiamo calcoli se la conversione fallisce
                if (isNaN(index)) return;

                // 2. Calcoliamo la Y corretta
                const placeY = c.y - (13.45 * index);
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
    
    { id: "input-rm1-nome", x: 130, y: 534, pagina: 3, required: false, step: 6 },
    { id: "input-rm1-anno", x: 230, y: 519, pagina: 3, required: false, step: 6 },
    { id: "input-rm1-npv-dir", x: 115, y: 504, pagina: 3, required: false, step: 6 },
    { id: "input-rm1-npv-fr", x: 243, y: 504, pagina: 3, required: false, step: 6 },
    { id: "input-rm1-npv-altro", x: 440, y: 504, pagina: 3, required: false, step: 6 },
    
    { id: "input-rm1-ub-div", selector: 'input[name="ubicazioni1[]"]:checked', x: 55.5, y: 456, pagina: 3, required: false, step: 6, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                // 1. Convertiamo il valore in un numero intero
                const index = parseInt(val, 10);

                // Evitiamo calcoli se la conversione fallisce
                if (isNaN(index)) return;

                // 2. Calcoliamo la Y corretta
                const placeY = c.y - (13.45 * index);
                page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
            });
        }
    },
    { id: "input-rm1-ub-altro", x: 170, y: 365, pagina: 3, required: false, step: 6 },
    { id: "input-rm1-mq-dir", x: 63, y: 315, pagina: 3, required: false, step: 6, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-rm1-mq-fr", x: 63, y: 237.5, pagina: 3, required: false, step: 6, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-rm1-ps-dir", x: 170, y: 161.5, pagina: 3, required: false, step: 6 },
    { id: "input-rm1-ps-fr", x: 200, y: 145.5, pagina: 3, required: false, step: 6 },
    
    { id: "input-rm1-cs-0", x: 63, y: 98.5, pagina: 3, required: false, step: 6, 
        render: (page, val, c) => {
            if(val) page.drawText(`X`, { x: c.x, y: c.y, size: 10 });
        }
    },
    { id: "input-rm1-cs-1", x: 63, y: 83, pagina: 3, required: false, step: 6, 
        render: (page, val, c) => {
            if(val) page.drawText(`X`, { x: c.x, y: c.y, size: 10 });
        }
    },

    // Campi Pagina 5 (Indice pagina: 4)
    { id: "input-rm1-cs-2", x: 63, y: 738.5, pagina: 4, required: false, step: 6, 
        render: (page, val, c) => {
            if(val) page.drawText(`X`, { x: c.x, y: c.y, size: 10 });
        }
    },
    { id: "input-rm1-cs-3", x: 63, y: 723, pagina: 4, required: false, step: 6, 
        render: (page, val, c) => {
            if(val) page.drawText(`X`, { x: c.x, y: c.y, size: 10 });
        }
    },
    { id: "input-rm1-cs-4", x: 63, y: 708, pagina: 4, required: false, step: 6, 
        render: (page, val, c) => {
            if(val) page.drawText(`X`, { x: c.x, y: c.y, size: 10 });
        }
    },

    { id: "input-rm2-nome", x: 130, y: 663, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-anno", x: 230, y: 648, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-npv-dir", x: 115, y: 633, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-npv-fr", x: 243, y: 633, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-npv-altro", x: 440, y: 633, pagina: 4, required: false, step: 7 },
    
    { id: "input-rm2-ub-div", selector: 'input[name="ubicazioni2[]"]:checked', x: 55.5, y: 585, pagina: 4, required: false, step: 7, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                // 1. Convertiamo il valore in un numero intero
                const index = parseInt(val, 10);

                // Evitiamo calcoli se la conversione fallisce
                if (isNaN(index)) return;

                // 2. Calcoliamo la Y corretta
                const placeY = c.y - (13.45 * index);
                page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
            });
        }
    },
    { id: "input-rm2-ub-altro", x: 170, y: 492, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-mq-dir", x: 63, y: 443, pagina: 4, required: false, step: 7, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-rm2-mq-fr", x: 63, y: 365.5, pagina: 4, required: false, step: 7, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-rm2-ps-dir", x: 170, y: 289.5, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-ps-fr", x: 200, y: 274.5, pagina: 4, required: false, step: 7 },
    { id: "input-rm2-cs-div", selector: 'input[name="canali2[]"]:checked', x: 63, y: 226.5, pagina: 4, required: false, step: 7, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                // 1. Convertiamo il valore in un numero intero
                const index = parseInt(val, 10);

                // Evitiamo calcoli se la conversione fallisce
                if (isNaN(index)) return;

                // 2. Calcoliamo la Y corretta
                const placeY = c.y - (15.45 * index);
                page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
            });
        }
    },


    // Campi Pagina 6 (Indice pagina: 5)
    { id: "input-rm3-nome", x: 130, y: 725, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-anno", x: 230, y: 710, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-npv-dir", x: 115, y: 695, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-npv-fr", x: 243, y: 695, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-npv-altro", x: 440, y: 695, pagina: 5, required: false, step: 7 },

    { id: "input-rm3-ub-div", selector: 'input[name="ubicazioni3[]"]:checked', x: 55.5, y: 647, pagina: 5, required: false, step: 7, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                // 1. Convertiamo il valore in un numero intero
                const index = parseInt(val, 10);

                // Evitiamo calcoli se la conversione fallisce
                if (isNaN(index)) return;

                // 2. Calcoliamo la Y corretta
                const placeY = c.y - (13.45 * index);
                page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
            });
        }
    },
    { id: "input-rm3-ub-altro", x: 170, y: 554, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-mq-dir", x: 63, y: 505, pagina: 5, required: false, step: 7, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-rm3-mq-fr", x: 63, y: 427.5, pagina: 5, required: false, step: 7, 
        render: (page, val, c) => {
            const placeY = c.y - (15.45 * val);
            page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
        }
    },
    { id: "input-rm3-ps-dir", x: 170, y: 351.5, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-ps-fr", x: 200, y: 336.5, pagina: 5, required: false, step: 7 },
    { id: "input-rm3-cs-div", selector: 'input[name="canali3[]"]:checked', x: 63, y: 288.5, pagina: 5, required: false, step: 7, 
        render: (page, valArray, c) => {
            if (!valArray || !Array.isArray(valArray)) return; 

            valArray.forEach(val => {
                // 1. Convertiamo il valore in un numero intero
                const index = parseInt(val, 10);

                // Evitiamo calcoli se la conversione fallisce
                if (isNaN(index)) return;

                // 2. Calcoliamo la Y corretta
                const placeY = c.y - (15.45 * index);
                page.drawText(`X`, { x: c.x, y: placeY, size: 10 });
            });
        }
    },

    // Campi Pagina 7 (Indice pagina: 6)
    { id: "input-radio-est", selector: 'input[name="input-radio-est-selected"]:checked', x: 212, y: 705.3, pagina: 6, required: false, step: 9,
        render: (page, val, c) => {
            // 1. Convertiamo il valore in un numero intero
            const index = parseInt(val, 10);

            // Evitiamo calcoli se la conversione fallisce
            if (isNaN(index)) return;

            // 2. Calcoliamo la Y corretta
            const placeX = c.x - (34 * index);
            page.drawText(`X`, { x: placeX, y: c.y, size: 10 });
        }
    },
    { id: "input-paesi-estero", x: 63, y: 660, pagina: 6, required: false, step: 9 },
    { id: "input-est-dir", x: 110, y: 602, pagina: 6, required: false, step: 9 },
    { id: "input-est-fr", x: 235, y: 602, pagina: 6, required: false, step: 9 },
    { id: "input-est-altro", x: 405, y: 602, pagina: 6, required: false, step: 9 },
    { id: "input-est-plan", x: 63, y: 557, pagina: 6, required: false, step: 9 },
    { id: "input-plan-dir", x: 115, y: 512, pagina: 6, required: false, step: 9 },
    { id: "input-plan-fr", x: 130, y: 497, pagina: 6, required: false, step: 9 },
    { id: "input-plan-altro", x: 150, y: 482, pagina: 6, required: false, step: 9 },
];