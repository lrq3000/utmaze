<?php
function dbInit() {
	try {
		$cfg = explode("\n", file_get_contents('sharecode_db.txt'));
		$db = new PDO("mysql:host={$cfg[0]};dbname={$cfg[1]};port={$cfg[2]}", $cfg[3], $cfg[4]);
		return $db;
	} catch (\PDOException $e) {
		error_log($e->getMessage());
	}
}

/* Check if request is for sharecode or levelcode */
if ($_GET['code']) {
	/* Check for legitimate levelcode */
	// Get maze height
	$b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	$h = 1 + strpos($b64s, $_GET['code'][0]);
	// Even if legit, ignore if <8 characters
	// Check proper encoding
	// Check for valid length (must be len%h==0 or ==1 where len excludes the 'height' character)
	if (
		strlen($_GET['code']) < 8
		or preg_match('[^0-9A-Za-z_-]', $_GET['code'])
		or (strlen($_GET['code']) - 1) % $h > 1
	) {
		print json_encode(false);
		exit;
	}

	// Init database
	$db = dbInit();

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
}
elseif ($_GET['share']) {
	$db = dbInit();
	$sh = $db->prepare('SELECT code FROM codes WHERE share=?;');
	if ($sh->execute([$_GET['share']]))
		print json_encode($sh->fetchColumn());
	else
		print json_encode(false);
	exit;
}
?>
