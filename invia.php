<?php
// Disabilitiamo la visualizzazione degli errori HTML per non corrompere il JSON di risposta
ini_set('display_errors', 0);
error_reporting(0);

// Permetti la ricezione di dati da JavaScript
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Leggiamo i dati inviati dal JavaScript
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (!$input || !isset($input['pdfBase64'])) {
    echo json_encode(["status" => "error", "message" => "Dati mancanti dal client."]);
    exit;
}

$nomeUtente = $input['nomeUtente'] ?? 'Utente Anonimo';
$pdfBase64 = $input['pdfBase64'];

// Configurazione Email
$to = "spasiano.matteo02@gmail.com";
$subject = "Nuovo PDF Compilato da " . $nomeUtente;
$senderMail = "matteo.spasiano@retailin.it"; // Mittente fittizio per il test locale

// Creazione di un ID univoco per separare il testo dall'allegato (Boundary)
$boundary = md5(time());

// Intestazioni (Headers) dell'e-mail
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: " . $senderMail . "\r\n";
$headers .= "Reply-To: " . $senderMail . "\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

// Corpo dell'e-mail (Testo + Allegato)
$body = "--" . $boundary . "\r\n";
$body .= "Content-Type: text/html; charset=\"UTF-8\"\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= "<p>Ciao,</p><p>In allegato trovi il documento PDF compilato e bloccato da <b>" . htmlspecialchars($nomeUtente) . "</b>.</p>\r\n\r\n";

// Sezione dell'allegato PDF
$body .= "--" . $boundary . "\r\n";
$body .= "Content-Type: application/pdf; name=\"documento_compilato.pdf\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n";
$body .= "Content-Disposition: attachment; filename=\"documento_compilato.pdf\"\r\n\r\n";
$body .= chunk_split($pdfBase64) . "\r\n";
$body .= "--" . $boundary . "--";

// Invio effettivo tramite il server mail di PHP
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(["status" => "success", "message" => "E-mail inviata con successo via PHP!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Il server locale non è riuscito a processare la funzione mail()."]);
}
?>