<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// --- FUNZIONE PER CARICARE IL FILE .ENV ---
function caricaVariabiliAmbiente($percorso) {
    if (!file_exists($percorso)) {
        return false;
    }

    $righe = file($percorso, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($righe as $riga) {
        if (strpos(trim($riga), '#') === 0) continue;

        list($chiave, $valore) = explode('=', $riga, 2);
        
        $chiave = trim($chiave);
        $valore = trim($valore);

        $valore = trim($valore, '"\'');

        putenv(sprintf('%s=%s', $chiave, $valore));
    }
    return true;
}

caricaVariabiliAmbiente(__DIR__ . '/.env');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // =============================================================
        // === INTEGRAZIONE CLOUDFLARE TURNSTILE ===
        // =============================================================
        $turnstileResponse = $_POST['cf-turnstile-response'] ?? '';
        $secretKey = getenv('TURNSTILE_SECRET_KEY');

        // Se non usi il file .env per questa chiave, puoi decommentare la riga sotto:
        // $secretKey = "LA_TUA_SECRET_KEY_PRIVATA_DI_RETE";

        if (empty($turnstileResponse)) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Verifica di sicurezza mancante. Riprova.'
            ]);
            exit;
        }

        // Richiesta di verifica a Cloudflare
        $url = 'https://cloudflare.com';
        $data = [
            'secret'   => $secretKey,
            'response' => $turnstileResponse,
            'remoteip' => $_SERVER['REMOTE_ADDR']
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        $response = curl_exec($ch);
        curl_close($ch);

        $responseData = json_decode($response, true);

        // Se la validazione fallisce, blocca subito tutto
        if (!$responseData['success']) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Verifica di sicurezza fallita (Turnstile). Riprova.'
            ]);
            exit;
        }
        // =============================================================

        // 1. Raccogliamo i dati dai normali array di PHP
        $nomeUtente = $_POST['nomeUtente'] ?? 'Utente';
        
        $nomeUtentePulito = str_replace(array("\r", "\n", "%0a", "%0d"), '', $nomeUtente);
        $nomeUtentePulito = substr($nomeUtentePulito, 0, 50);

        // ---- INIZIO CONTROLLI EMAIL ----
        $destinatari = isset($_POST['email']) ? $_POST['email'] : [];
        
        if (!is_array($destinatari) || empty($destinatari)) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Nessun indirizzo email specificato.'
            ]);
            exit;
        }

        if (!isset($_FILES['filePdf']) || $_FILES['filePdf']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Errore nel caricamento del file PDF sul server.'
            ]);
            exit;
        }

        $estensione = strtolower(pathinfo($_FILES['filePdf']['name'], PATHINFO_EXTENSION));
        if ($estensione !== 'pdf') {
            echo json_encode(['status' => 'error', 'message' => 'Formato file non consentito. Solo PDF.']);
            exit;
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $tipoMime = finfo_file($finfo, $_FILES['filePdf']['tmp_name']);
        finfo_close($finfo);

        if ($tipoMime !== 'application/pdf') {
            echo json_encode(['status' => 'error', 'message' => 'Il contenuto del file non è un vero PDF.']);
            exit;
        }

        $percorsoTemporaneo = $_FILES['filePdf']['tmp_name'];
        $nomeOriginaleFile  = $_FILES['filePdf']['name'];

        // 2. Configurazione PHPMailer
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host       = getenv('SMTP_HOST'); 
        $mail->SMTPAuth   = true;
        $mail->Username   = getenv('SMTP_USER');
        $mail->Password   = getenv('SMTP_PASS');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = intval(getenv('SMTP_PORT'));

        $mail->setFrom(getenv('SMTP_USER'), 'Moduli Confimprese');

        $emailAggiunte = 0;
        foreach ($destinatari as $email) {
            $emailPulita = str_replace(array("\r", "\n", "%0a", "%0d"), '', trim($email));
            
            if (filter_var($emailPulita, FILTER_VALIDATE_EMAIL)) {
                $mail->addAddress($emailPulita);
                $emailAggiunte++;
            }
        }

        if ($emailAggiunte === 0) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Nessun indirizzo email fornito risulta valido.'
            ]);
            exit;
        }

        $mail->isHTML(true);
        $mail->Subject = "Nuovo modulo PDF da: " . $nomeUtentePulito;

        $mail->Body    = "Buongiorno,<br>in allegato trovi il Modulo di Adesione a Confimprese compilato per conto di <strong>" . htmlspecialchars($nomeUtentePulito, ENT_QUOTES, 'UTF-8') . "</strong>.<br><br>Grazie,<br>Il team Confimprese.";
        $mail->AltBody = "In allegato trovi il Modulo di Adesione a Confimprese compilato per conto di " . $nomeUtentePulito . ".";

        $mail->addAttachment($percorsoTemporaneo, $nomeOriginaleFile);

        $mail->send();

        echo json_encode([
            'status' => 'success',
            'message' => 'Email inviata con successo con il PDF allegato!'
        ]);

    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Errore PHPMailer: ' . $mail->ErrorInfo
        ]);
    } catch (\Throwable $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Errore interno: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Metodo non consentito.'
    ]);
}
?>
