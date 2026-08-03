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