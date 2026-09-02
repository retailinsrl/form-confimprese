<?php
// 1. Forza la risposta in formato JSON per dialogare correttamente con JavaScript fetch
header('Content-Type: application/json');

// 2. Inserisci qui la tua SECRET KEY privata fornita dalla dashboard di Cloudflare
// NOTA: Se usi un file .env puoi recuperarla con getenv('TURNSTILE_SECRET_KEY')
$secretKey = getenv('TURNSTILE_SECRET_KEY');

// 3. Verifica che la richiesta sia effettivamente di tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Recupera il token inviato dal FormData di JavaScript
    $token = $_POST['cf-turnstile-response'] ?? '';

    // Se il token non è presente nei dati inviati
    if (empty($token)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Token di sicurezza mancante. Riprova.'
        ]);
        exit;
    }

    // 4. Prepara i parametri per l'endpoint di verifica di Cloudflare
    $url = 'https://cloudflare.com';
    $data = [
        'secret'   => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] // Invia l'IP dell'utente per maggiore sicurezza
    ];

    // 5. Esegui la chiamata HTTP POST in background verso Cloudflare usando cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    
    // OPZIONALE (Solo per test in locale / localhost se riscontri errori di certificato SSL):
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    curl_close($ch);

    // 6. Decodifica la risposta JSON nativa di Cloudflare
    $responseData = json_decode($response, true);

    // 7. Controlla il risultato restituito dall'API di Turnstile
    if (isset($responseData['success']) && $responseData['success'] === true) {
        // Verifica superata: l'utente è un umano
        echo json_encode([
            'status' => 'success',
            'message' => 'Verifica di sicurezza completata.'
        ]);
    } else {
        // Verifica fallita: potrebbe essere un bot o il token è scaduto/già usato
        // Recupera i codici di errore se presenti per aiutare il debug
        $errorCodes = isset($responseData['error-codes']) ? implode(', ', $responseData['error-codes']) : 'Sconosciuto';
        
        echo json_encode([
            'status' => 'error',
            'message' => 'Controllo di sicurezza fallito o scaduto. (Codice: ' . $errorCodes . ')'
        ]);
    }
} else {
    // Se qualcuno prova ad accedere direttamente al file tramite browser (GET)
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Metodo di richiesta non consentito.'
    ]);
}
?>