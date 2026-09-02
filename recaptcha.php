<?php
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
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response === FALSE) {
        return ['success' => false, 'error-codes' => ['internal-error']];
    }

    return json_decode($response, true);

}

// Usage
$secret_key = getenv('TURNSTILE_SECRET_KEY');
$token = $_POST['cf-turnstile-response'] ?? '';
$remoteip = $\_SERVER['HTTP_CF_CONNECTING_IP'] ??
$\_SERVER['HTTP_X_FORWARDED_FOR'] ??
$\_SERVER['REMOTE_ADDR'];

$validation = validateTurnstile($token, $secret_key, $remoteip);

if ($validation['success']) {
// Valid token - process form
echo "Form submission successful!";
// Process your form data here
} else {
// Invalid token - show error
echo "Verification failed. Please try again.";
error_log('Turnstile validation failed: ' . implode(', ', $validation['error-codes']));
}
?>