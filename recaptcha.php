<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');


function validateTurnstile(string $token, string $secret): array
{
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    $data = [
        'secret'   => $secret,
        'response' => $token
    ];

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($data),
            'timeout' => 10
        ]
    ];

    $context = stream_context_create($options);

    $response = @file_get_contents(
        $url,
        false,
        $context
    );

    if ($response === false) {
        return [
            'success' => false,
            'error-codes' => ['network-error']
        ];
    }

    $result = json_decode($response, true);

    if (!is_array($result)) {
        return [
            'success' => false,
            'error-codes' => ['invalid-cloudflare-response']
        ];
    }

    return $result;
}


// ============================================================
// 1. CONTROLLO SESSIONE
// ============================================================

if (
    isset($_SESSION['turnstile_verificato']) &&
    $_SESSION['turnstile_verificato'] === true
) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Verifica già effettuata in precedenza.'
    ]);

    exit;
}


// ============================================================
// 2. SECRET KEY
// ============================================================

// SOLO PER IL TEST CON LE CHIAVI DUMMY DI CLOUDFLARE
$secret_key = getenv('TURNSTILE_SECRET_KEY');


// ============================================================
// 3. RECUPERO TOKEN
// ============================================================

$token = $_POST['cf-turnstile-response'] ?? '';

if (empty($token)) {

    echo json_encode([
        'status'  => 'error',
        'message' => 'Token Turnstile mancante.',
        'error_codes' => 'missing-input-response'
    ]);

    exit;
}


// ============================================================
// 4. VERIFICA CON CLOUDFLARE
// ============================================================

$validation = validateTurnstile(
    $token,
    $secret_key
);


// ============================================================
// 5. RISULTATO
// ============================================================

if (
    isset($validation['success']) &&
    $validation['success'] === true
) {

    $_SESSION['turnstile_verificato'] = true;
    $_SESSION['turnstile_data'] = time();

    echo json_encode([
        'status'  => 'success',
        'message' => 'Verifica completata con successo!'
    ]);

    exit;
}


// ============================================================
// 6. ERRORE
// ============================================================

$errorCodes = 'Sconosciuto';

if (
    isset($validation['error-codes']) &&
    is_array($validation['error-codes'])
) {
    $errorCodes = implode(', ', $validation['error-codes']);
}

error_log(
    'Validazione Turnstile fallita: ' . $errorCodes
);

echo json_encode([
    'status'      => 'error',
    'message'     => 'Verifica fallita o scaduta. Riprova.',
    'error_codes' => $errorCodes
]);

exit;

?>