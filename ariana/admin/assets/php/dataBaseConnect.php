<?php
    /* $host = 'sql203.epizy.com'; //'localhost';
    $user = 'epiz_31326963'; //'root';
    $password = 'Gzl4HTxqvx';
    $dbname = 'epiz_31326963_dagstaten'; //'digitalDagstaten'; */
	
	$host = 'localhost';
    $user = 'root';
    $password = '';
    $dbname = 'ariana-gym';

    $dsn = 'mysql:host=' . $host . ';dbname=' . $dbname . ';charset=utf8;';

    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
?>