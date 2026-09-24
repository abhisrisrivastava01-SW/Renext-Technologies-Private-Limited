<?php
/**
 * Renext Technologies — enquiry endpoint.
 *
 * Accepts POST (JSON or form-encoded). Validates, rate-limits, and appends the
 * enquiry to a JSONL file OUTSIDE the web root. Optionally sends a notification
 * email with PHP mail() when a mail transport is configured on the server.
 *
 * Success ("ok": true) is returned ONLY after the enquiry is written to disk.
 *
 * Optional config (never commit it): <site root>/config/enquiry.php returning:
 *   return [
 *     'storage_dir' => '/var/www/renexttechnologies/storage',
 *     'notify_to'   => 'info@renexttechnologies.com',
 *     'notify_from' => 'website@renexttechnologies.com',
 *     'send_mail'   => true,   // only after sendmail/msmtp is set up
 *   ];
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// ---- Config -----------------------------------------------------------------
$siteRoot = dirname(__DIR__, 2); // /var/www/renexttechnologies when api/ sits in public/
$config = [
    'storage_dir' => $siteRoot . '/storage',
    'notify_to'   => 'info@renexttechnologies.com',
    'notify_from' => 'website@renexttechnologies.com',
    'send_mail'   => false,
    'max_per_hour'=> 5,
];
$configFile = $siteRoot . '/config/enquiry.php';
if (is_file($configFile)) {
    $loaded = include $configFile;
    if (is_array($loaded)) { $config = array_merge($config, $loaded); }
}
$override = getenv('RENEXT_ENQUIRY_STORAGE');
if ($override) { $config['storage_dir'] = $override; }

// ---- Input ------------------------------------------------------------------
$raw = file_get_contents('php://input', false, null, 0, 20000) ?: '';
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$in = stripos($ctype, 'application/json') !== false ? (json_decode($raw, true) ?: []) : $_POST;
if (!is_array($in)) { $in = []; }

$clean = static function ($v, int $max): string {
    $v = is_string($v) ? $v : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
};
$oneLine = static fn(string $v): string => trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');

$data = [
    'name'    => $oneLine($clean($in['name'] ?? '', 120)),
    'email'   => $oneLine($clean($in['email'] ?? '', 200)),
    'phone'   => $oneLine($clean($in['phone'] ?? '', 40)),
    'company' => $oneLine($clean($in['company'] ?? '', 200)),
    'topic'   => $oneLine($clean($in['topic'] ?? '', 160)),
    'message' => $clean($in['message'] ?? '', 5000),
    'page'    => $oneLine($clean($in['page'] ?? '', 200)),
];

// Honeypot + minimum fill time (bots). Pretend success to avoid tipping them off,
// but never store. Real users never see this path.
$honeypot = $clean($in['website'] ?? '', 200);
$elapsed = (int)($in['elapsed_ms'] ?? 0);
if ($honeypot !== '' || ($elapsed > 0 && $elapsed < 2500)) {
    respond(200, ['ok' => true, 'id' => 'ignored']);
}

$errors = [];
if (mb_strlen($data['name']) < 2) { $errors['name'] = 'Please enter your name.'; }
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'Please enter a valid email address.'; }
if (mb_strlen($data['message']) < 10) { $errors['message'] = 'Please add a few words about what you need.'; }
if ($data['phone'] !== '' && !preg_match('/^[0-9+()\-\s.]{6,40}$/', $data['phone'])) { $errors['phone'] = 'Please check the phone number.'; }
if ($errors) { respond(422, ['ok' => false, 'error' => 'validation', 'fields' => $errors]); }

// ---- Storage ----------------------------------------------------------------
$dir = rtrim((string)$config['storage_dir'], '/');
if (!is_dir($dir) && !@mkdir($dir, 0750, true)) {
    error_log('[renext-enquiry] storage dir unavailable: ' . $dir);
    respond(503, ['ok' => false, 'error' => 'storage_unavailable']);
}

// Rate limit per IP (hashed; raw IP stored only with the enquiry itself).
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateFile = $dir . '/ratelimit.json';
$fh = @fopen($rateFile, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $now = time();
    $state = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    foreach ($state as $k => $times) {
        $state[$k] = array_values(array_filter((array)$times, fn($t) => $t > $now - 3600));
        if (!$state[$k]) { unset($state[$k]); }
    }
    $key = hash('sha256', $ip);
    if (count($state[$key] ?? []) >= (int)$config['max_per_hour']) {
        flock($fh, LOCK_UN); fclose($fh);
        respond(429, ['ok' => false, 'error' => 'rate_limited']);
    }
    $state[$key][] = $now;
    ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($state));
    fflush($fh); flock($fh, LOCK_UN); fclose($fh);
}

$id = 'RNX-' . gmdate('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$record = $data + [
    'id'         => $id,
    'received_at'=> gmdate('c'),
    'ip'         => $ip,
    'user_agent' => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 300),
];
$file = $dir . '/enquiries-' . gmdate('Y-m') . '.jsonl';
$line = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
if (@file_put_contents($file, $line, FILE_APPEND | LOCK_EX) !== strlen($line)) {
    error_log('[renext-enquiry] write failed: ' . $file);
    respond(503, ['ok' => false, 'error' => 'storage_unavailable']);
}
@chmod($file, 0640);

// ---- Optional notification (best effort; storage already succeeded) ---------
$notified = false;
if (!empty($config['send_mail']) && function_exists('mail')) {
    $subject = 'Website enquiry ' . $id . ' — ' . ($data['topic'] ?: 'General');
    $body = "New enquiry from renexttechnologies.com\n\n"
          . "ID: {$id}\nName: {$data['name']}\nEmail: {$data['email']}\nPhone: {$data['phone']}\n"
          . "Company/brand: {$data['company']}\nTopic: {$data['topic']}\nPage: {$data['page']}\n\n"
          . "Message:\n{$data['message']}\n";
    $headers = implode("\r\n", [
        'From: Renext Website <' . $oneLine((string)$config['notify_from']) . '>',
        'Reply-To: ' . $data['email'],
        'Content-Type: text/plain; charset=UTF-8',
    ]);
    $notified = @mail((string)$config['notify_to'], $oneLine($subject), $body, $headers);
    if (!$notified) { error_log('[renext-enquiry] mail() failed for ' . $id); }
}

respond(200, ['ok' => true, 'id' => $id, 'notified' => $notified]);
