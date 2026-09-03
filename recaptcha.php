<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');


function validateTurnstile(string $token, string $secret): array
{
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_POST => true,

        CURLOPT_POSTFIELDS => [
            'secret'   => $secret,
            'response' => $token
        ],

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_TIMEOUT => 10,

        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2
    ]);

    $response = curl_exec($ch);

    if ($response === false) {

        $error = curl_error($ch);

        curl_close($ch);

        return [
            'success' => false,
            'error-codes' => ['curl-error'],
            'debug' => $error
        ];
    }

    $httpCode = curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );

    curl_close($ch);

    $result = json_decode(
        $response,
        true
    );

    if (!is_array($result)) {

        return [
            'success' => false,
            'error-codes' => ['invalid-response'],
            'http-code' => $httpCode,
            'debug' => $response
        ];
    }

    $result['_http_code'] = $httpCode;

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

$secret_key = '0x4AAAAAAEk40V6btqd-nWiWtSv97hsFFNg';//getenv('TURNSTILE_SECRET_KEY');

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
    'message'     => 'Verifica fallita.',
    'error_codes' => $errorCodes,
    'debug'       => $validation['php-error'] ?? null
]);

exit;

?>