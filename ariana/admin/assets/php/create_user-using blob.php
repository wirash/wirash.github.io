<?php
    include_once("dataBaseConnect.php");

    $username = $_POST['username'];
    $surname = $_POST['surname'];
    $name = $_POST['name'];
    $expires = $_POST['expires'] . "-01";

    if(!empty($_FILES) && isset($_FILES["dp"])){
        $dp = $_FILES["dp"];

        $dp_ext = pathinfo($dp["name"])['extension'];
        $dp_new_path = $username . "." . $dp_ext;

        $fileTypes = array("image/bmp",	"image/gif", "image/jpeg", "image/png",	"image/webp");
        $extTypes = array('bmp','gif','jpg','jpeg','png','webp');

        if (in_array($dp["type"], $fileTypes) && $dp['size']<= 16777215 && $dp["error"] == 0 && preg_match("/^[a-z.]{3,20}$/", $username) && in_array($dp_ext, $extTypes)) {
            $dp_blob = addslashes(file_get_contents($dp["tmp_name"]));
            
            if(isset($dp_blob) && !empty($dp_blob)){
                $sql = "insert into users (uid, username, dp, surname, name, last_payment, expires) values (round(unix_timestamp(now(6))*1000000), ?, ?, ?, ?, CURDATE(), ?)";
                $stmt = $pdo->prepare($sql);
                $success = $stmt->execute([$username, $dp_blob, $surname, $name, $expires]);

                if($success == false || $stmt->rowCount() == 0) header('HTTP/1.0 400 Bad error');
            }
            else header('HTTP/1.0 400 Bad error');
        }
        else header('HTTP/1.0 400 Bad error');
    }
    else header('HTTP/1.0 400 Bad error');
?>