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
        // Ignora i commenti nel file .env
        if (strpos(trim($riga), '#') === 0) continue;

        // Separa la chiave dal valore
        list($chiave, $valore) = explode('=', $riga, 2);
        
        $chiave = trim($chiave);
        $valore = trim($valore);

        // Rimuove eventuali virgolette attorno al valore
        $valore = trim($valore, '"\'');

        // Salva la variabile d'ambiente nel sistema
        putenv(sprintf('%s=%s', $chiave, $valore));
    }
    return true;
}

// Eseguiamo il caricamento del file .env che si trova nella stessa cartella
caricaVariabiliAmbiente(__DIR__ . '/.env');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // 1. Raccogliamo i dati dai normali array di PHP
        $nomeUtente = $_POST['nomeUtente'] ?? 'Utente';
        
        // Rimuovi i caratteri di a capo (\r e \n) per prevenire l'Email Header Injection
        $nomeUtentePulito = str_replace(array("\r", "\n", "%0a", "%0d"), '', $nomeUtente);

        // Limita la lunghezza del testo per evitare attacchi di tipo Buffer Overflow
        $nomeUtentePulito = substr($nomeUtentePulito, 0, 50);

        // Verifichiamo che il file sia arrivato correttamente e senza errori di upload
        if (!isset($_FILES['filePdf']) || $_FILES['filePdf']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Errore nel caricamento del file PDF sul server.'
            ]);
            exit;
        }

        // Controlla l'estensione del file originale
        $estensione = strtolower(pathinfo($_FILES['filePdf']['name'], PATHINFO_EXTENSION));
        if ($estensione !== 'pdf') {
            echo json_encode(['status' => 'error', 'message' => 'Formato file non consentito. Solo PDF.']);
            exit;
        }

        // Verifica il vero tipo MIME del file (non fidarti solo dell'estensione)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $tipoMime = finfo_file($finfo, $_FILES['filePdf']['tmp_name']);
        finfo_close($finfo);

        if ($tipoMime !== 'application/pdf') {
            echo json_encode(['status' => 'error', 'message' => 'Il contenuto del file non è un vero PDF.']);
            exit;
        }

        // Informazioni sul file temporaneo salvato sul server
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

        $mail->setFrom('matteo.spasiano@retailin.it', 'Moduli Confimprese');
        $mail->addAddress('spasiano.matteo02@gmail.com', 'Destinatario');

        $mail->isHTML(true);
        $mail->Subject = "Nuovo modulo PDF da: " . $nomeUtentePulito;

        // Il tag htmlspecialchars neutralizza qualsiasi tentativo di XSS nel corpo della mail
        $mail->Body    = "Buongiorno,<br>in allegato trovi il Modulo di Adesione a Confimprese compilato per conto di <strong>" . htmlspecialchars($nomeUtentePulito, ENT_QUOTES, 'UTF-8') . "</strong>.<br><br>Grazie,<br>Il team Confimprese.";
        $mail->AltBody = "In allegato trovi il Modulo di Adesione a Confimprese compilato per conto di " . $nomeUtentePulito . ".";

        // 3. ALLEGATO: Usiamo addAttachment passando il file temporaneo sul server
        // Parametri: (Percorso file fisico sul server, Nome che vedrà il destinatario)
        $mail->addAttachment($percorsoTemporaneo, $nomeOriginaleFile);

        $mail->send();

        // 4. Risposta di successo
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