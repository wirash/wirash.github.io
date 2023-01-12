<?php
    error_reporting(0);
    include_once("dataBaseConnect.php");

    $uid = $_POST['uid'];

    $sql = "UPDATE users SET password=default where uid = ?";
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([$uid]);
    
    if($success == false || $stmt->rowCount() == 0){
        header('HTTP/1.0 400 Bad error');
        die();
    }
?>