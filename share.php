<?php
/* Check for legitimate levelcode */
// Get maze height
$b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
$h = strpos($b64s, $_GET['code'][0]);
// Even if legit, ignore if <8 characters
// Check proper encoding
// Check for valid length (must be len%h==0 or ==1 where len excludes the 'height' character)
if (
	strlen($_GET['code']) < 8
	or preg_match('[^0-9A-Za-z]', $_GET['code'])
	or (strlen($_GET['code']) - 1) % $h > 1
) {
	print json_encode(false);
	exit;
}

// Init database
try {
	$config = explode("\n", file_get_contents('sharecodes_db.txt'));
	$db = new PDO("mysql:host={$db[0]};dbname={$db[1]};port={$db[2]}", $db[3], $db[4]);
} catch (\PDOException $e) {
	error_log($e->getMessage());
}

/* Process levelcode */
// Check if code was already recorded
$sh = $db->prepare('SELECT share FROM codes WHERE code=?;');
$sh->execute([$_GET['code']]);
$share = $sh->fetchColumn();
if ($share) {
	print json_encode($share);
	exit;
}

// If not, make sharecode
$rnd = rand();
do {
	$share = substr(md5($rnd++), 0, 6);
	$sh = $db->prepare('INSERT INTO codes (share, code) VALUES (?,?);');
	$success = $sh->execute([$share, $_GET['code']]);	// `share` must be unique key
} while (!$success);

print json_encode($share);
exit;
?>
