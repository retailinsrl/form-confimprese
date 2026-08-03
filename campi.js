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
    { id: "input-competitor", x: 63, y: 443, pagina: 2, required: false, step: 4},
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
    
    // Campi Pagina 5 (Indice pagina: 4)

    // Campi Pagina 6 (Indice pagina: 5)

    // Campi Pagina 7 (Indice pagina: 6)
    { id: "input-radio-est", x: 212, y: 705.3, pagina: 6, required: false, step: 6,
        render: (page, val, c) => {
            const placeX = c.x - (33.5 * parseInt(val));
            page.drawText(`X`, { x: placeX, y: c.y, size: 10 });
        }
    },
    { id: "input-paesi-estero", x: 63, y: 660, pagina: 6, required: false, step: 6 },
    { id: "input-est-dir", x: 110, y: 602, pagina: 6, required: false, step: 6 },
    { id: "input-est-fr", x: 235, y: 602, pagina: 6, required: false, step: 6 },
    { id: "input-est-altro", x: 405, y: 602, pagina: 6, required: false, step: 6 },
    { id: "input-est-plan", x: 63, y: 557, pagina: 6, required: false, step: 6 },
    { id: "input-plan-dir", x: 115, y: 512, pagina: 6, required: false, step: 6 },
    { id: "input-plan-fr", x: 130, y: 497, pagina: 6, required: false, step: 6 },
    { id: "input-plan-altro", x: 150, y: 482, pagina: 6, required: false, step: 6 },
];