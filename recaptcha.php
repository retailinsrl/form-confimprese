<?php
// 1. Avvia la sessione PHP
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Forza la risposta in formato JSON
header('Content-Type: application/json');

function validateTurnstile($token, $secret) {
    // URL di produzione ufficiale per siteverify
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    $data = [
        'secret'   => $secret,
        'response' => $token
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'timeout' => 10
        ],
        'ssl' => [
            'verify_peer'      => true, // Disabilita rigorosità SSL per XAMPP/Localhost
            'verify_peer_name' => true,
        ]
    ];

    $context = stream_context_create($options);
    
    // Usiamo @ per nascondere eventuali warning nativi di PHP che sporcano il JSON
    $response = @file_get_contents($url, false, $context);

    if ($response === FALSE) {
        return ['success' => false, 'error-codes' => ['network-or-ssl-error']];
    }

    return json_decode($response, true);
}

// CONTROLLO SESSIONE PREVENTIVO
if (isset($_SESSION['turnstile_verificato']) && $_SESSION['turnstile_verificato'] === true) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Verifica già effettuata in precedenza.'
    ]);
    exit;
}

// RECUPERO CHIAVI (Usa la variabile d'ambiente o inserisci la stringa)
//$secret_key = getenv('TURNSTILE_SECRET_KEY');

// Se sei in XAMPP locale e vuoi forzare il superamento del test per fare debug del form, 
// usa le chiavi di test di Cloudflare inserendo la riga sotto:
$secret_key = '1x000000000000000000000000000000AA';

$token = $_POST['cf-turnstile-response'] ?? '';

$validation = validateTurnstile($token, $secret_key);

if (isset($validation['success']) && $validation['success'] === true) {
    $_SESSION['turnstile_verificato'] = true;
    $_SESSION['turnstile_data']       = time();
    
    echo json_encode([
        'status'  => 'success',
        'message' => 'Verifica completata con successo!'
    ]);
    exit;
} else {
    $errorCodes = isset($validation['error-codes']) ? implode(', ', $validation['error-codes']) : 'Sconosciuto';
    
    error_log('Validazione Turnstile fallita: ' . $errorCodes);

    echo json_encode([
        'status'      => 'error',
        'message'     => 'Verifica fallita o scaduta. Riprova.',
        'error_codes' => $errorCodes
    ]);
    exit;
}
?>
