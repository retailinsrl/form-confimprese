<?php
// 1. Avvia la sessione PHP per ricordare la verifica
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Forza la risposta in formato JSON per dialogare correttamente con JavaScript fetch
header('Content-Type: application/json');

function validateTurnstile($token, $secret, $remoteip = null) {
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    $data = [
        'secret' => $secret,
        'response' => $token
    ];

    if ($remoteip) {
        $data['remoteip'] = $remoteip;
    }

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'timeout' => 10
        ],
        'ssl' => [
            'verify_peer' => false, // Evita blocchi SSL in ambiente di test/localhost
            'verify_peer_name' => false,
        ]
    ];

    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);

    if ($response === FALSE) {
        return ['success' => false, 'error-codes' => ['internal-error']];
    }

    return json_decode($response, true);
}

// CONTROLLO PREVENTIVO: Se l'utente è già verificato in sessione, rispondi subito OK
if (isset($_SESSION['turnstile_verificato']) && $_SESSION['turnstile_verificato'] === true) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Verifica già effettuata in precedenza.'
    ]);
    exit;
}

// Sostituisci con getenv('TURNSTILE_SECRET_KEY') o metti la tua stringa segreta reale
$secret_key = getenv('TURNSTILE_SECRET_KEY') ?: 'LA_TUA_SECRET_KEY_REALE';

$token = $_POST['cf-turnstile-response'] ?? '';

// === CORREZIONE ERRORE 500: Rimosse le barre \ errate ===
$remoteip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];

$validation = validateTurnstile($token, $secret_key, $remoteip);

if ($validation['success']) {
    // --- SALVATAGGIO IN SESSIONE ---
    $_SESSION['turnstile_verificato'] = true;
    $_SESSION['turnstile_data']       = time();
    
    // RISPOSTA JSON PER JAVASCRIPT
    echo json_encode([
        'status' => 'success',
        'message' => 'Verifica completata con successo!'
    ]);
    exit;
} else {
    $errorCodes = isset($validation['error-codes']) ? implode(', ', $validation['error-codes']) : 'Sconosciuto';
    error_log('Turnstile validation failed: ' . $errorCodes);

    // RISPOSTA JSON DI ERRORE PER JAVASCRIPT
    echo json_encode([
        'status' => 'error',
        'message' => 'Verifica fallita. Per favore riprova.',
        'error_codes' => $errorCodes
    ]);
    exit;
}
?>
