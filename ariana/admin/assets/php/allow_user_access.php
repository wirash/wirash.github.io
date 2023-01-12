<?php
    error_reporting(0);
    include_once("dataBaseConnect.php");

    $uid = $_POST['uid'];
    
    // $sql = "SET @uid = ?; INSERT INTO attendance (uid) SELECT @uid WHERE @uid NOT IN (SELECT uid FROM attendance WHERE uid = @uid and DATE(time) = CURRENT_DATE() AND TIME(time + INTERVAL 10 MINUTE) >= TIME(NOW())) AND @uid IN (SELECT uid FROM users WHERE uid = @uid)";
    $sql = "INSERT INTO attendance (uid) SELECT ? WHERE ? NOT IN (SELECT uid FROM attendance WHERE uid = ? and DATE(time) = CURRENT_DATE() AND TIME(time + INTERVAL 10 MINUTE) >= TIME(NOW())) AND ? IN (SELECT uid FROM users WHERE uid = ?)";
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([$uid, $uid, $uid, $uid, $uid]);

    if($success == false || $stmt->rowCount() == 0){
        header('HTTP/1.0 400 Bad error');
    }
?>