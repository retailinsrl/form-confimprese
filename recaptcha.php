
<?php
// 1. Avvia la sessione PHP (deve essere la primissima istruzione del file)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Forza la risposta in formato JSON per dialogare correttamente con JavaScript
header('Content-Type: application/json');

// 2. Inserisci qui la tua SECRET KEY privata di Cloudflare
$secretKey = getenv('TURNSTILE_SECRET_KEY');

// 3. Verifica se l'utente ha GIÀ superato il controllo in precedenza (Evita controlli duplicati)
if (isset($_SESSION['turnstile_verificato']) && $_SESSION['turnstile_verificato'] === true) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Verifica già effettuata in precedenza.'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Recupera il token inviato dal FormData di JavaScript
    $token = $_POST['cf-turnstile-response'] ?? '';

    if (empty($token)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Token di sicurezza mancante. Riprova.'
        ]);
        exit;
    }

    // 4. Parametri per l'endpoint di Cloudflare
    $url = 'https://cloudflare.com';
    $data = [
        'secret'   => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    // 5. Chiamata HTTP POST via cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    
    // Decommenta le due righe sotto se testi in localhost e ricevi errori SSL:
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);

    // === INTEGRAZIONE PER IL DEBUG ===
    if ($response === false) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Errore di rete cURL: ' . curl_error($ch)
        ]);
        curl_close($ch);
        exit;
    }
// =================================

    curl_close($ch);

    $responseData = json_decode($response, true);

    // 6. Controlla l'esito della verifica
    if (isset($responseData['success']) && $responseData['success'] === true) {
        
        // --- SALVATAGGIO IN SESSIONE ---
        $_SESSION['turnstile_verificato'] = true;
        $_SESSION['turnstile_data']       = time(); // Salva il momento esatto della verifica
        $_SESSION['turnstile_ip']         = $_SERVER['REMOTE_ADDR']; // Salva l'IP per controlli futuri
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Verifica di sicurezza completata con successo.'
        ]);
    } else {
        $errorCodes = isset($responseData['error-codes']) ? implode(', ', $responseData['error-codes']) : 'Sconosciuto';
        
        echo json_encode([
            'status' => 'error',
            'message' => 'Controllo di sicurezza fallito o scaduto. (Codice: ' . $errorCodes . ')'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Metodo di richiesta non consentito.'
    ]);
}
?>
