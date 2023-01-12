<?php
    // round(unix_timestamp(now(6))*1000000) -> mysql generate uid from current time with microsecond precision

    error_reporting(0);
    include_once("dataBaseConnect.php");

    $username = $_POST['username'];
    $surname = $_POST['surname'];
    $name = $_POST['name'];
    $expires = $_POST['expires'] . "-01";

    if(!empty($_FILES) && isset($_FILES["dp"])){
        $dp = $_FILES["dp"];

        ini_set("precision", 16); // setting the precision to 16
        $uid = microtime(true)*1000000;
        $dp_ext = pathinfo($dp["name"])['extension'];
        $dp_new_name = $uid . "." . $dp_ext;
        $dp_new_path = "../profile-picture/" . $dp_new_name;

        $fileTypes = array("image/bmp",	"image/gif", "image/jpeg", "image/png",	"image/webp");
        $extTypes = array('bmp','gif','jpg','jpeg','png','webp');

        if (in_array($dp["type"], $fileTypes) && $dp['size']<= 8000000 && $dp["error"] == 0 && preg_match("/^[a-z.]{3,20}$/", $username) && in_array($dp_ext, $extTypes) && !file_exists($dp_new_path)) {
            $sql = "insert into users (uid, username, dp, surname, name, last_payment, expires) values (?, ?, ?, ?, ?, CURDATE(), ?)";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$uid, $username, $dp_new_name, $surname, $name, $expires]);
            
            if($success && $stmt->rowCount() == 1) {
                if(!move_uploaded_file($dp['tmp_name'], $dp_new_path)) header('HTTP/1.0 400 Bad error');
            }
            else header('HTTP/1.0 400 Bad error');
        }
        else header('HTTP/1.0 400 Bad error');
    }
    else header('HTTP/1.0 400 Bad error');
?>