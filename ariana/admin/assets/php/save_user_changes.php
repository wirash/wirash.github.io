<?php
    error_reporting(0);
    include_once("dataBaseConnect.php");

    $username = $_POST['username'];
    $surname = $_POST['surname'];
    $name = $_POST['name'];
    $expires = $_POST['expires'] . "-01";
    $status = $_POST['status'];
    $uid = $_POST['uid'];

    $active = $status == 'Inactive' ? 0 : 1;
    $last_payment = $expires ? ", last_payment = CURRENT_DATE()" : "";

    if(empty($_FILES) || !isset($_FILES["dp"])){
        if (preg_match("/^[a-z.]{3,20}$/", $username)) {
            $sql = "UPDATE users SET username = ?, surname = ?, name = ?, expires = ?, active = ? $last_payment WHERE uid = ?";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$username, $surname, $name, $expires, $active, $uid]);
            
            if($success == false || $stmt->rowCount() == 0) header('HTTP/1.0 400 Bad error');
        }
        else header('HTTP/1.0 400 Bad error');
    }
    else {
        $dp = $_FILES["dp"];
        $dp_ext = pathinfo($dp["name"])['extension'];
        $dp_new_name = $uid . "." . $dp_ext;
        $dp_new_path = "../profile-picture/" . $dp_new_name;

        $fileTypes = array("image/bmp",	"image/gif", "image/jpeg", "image/png",	"image/webp");
        $extTypes = array('bmp','gif','jpg','jpeg','png','webp');

        if (in_array($dp["type"], $fileTypes) && $dp['size']<= 8000000 && $dp["error"] == 0 && preg_match("/^[a-z.]{3,20}$/", $username) && in_array($dp_ext, $extTypes)) {
            $sql = "UPDATE users SET username = ?, dp = ?, surname = ?, name = ?, expires = ?, active = ? $last_payment WHERE uid = ?";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$username, $dp_new_name, $surname, $name, $expires, $active, $uid]);
            
            if($success == true && $stmt->rowCount() == 1) {
                if(move_uploaded_file($dp['tmp_name'], $dp_new_path)) {
                    foreach(array_diff($extTypes, [$dp_ext]) as $ext){
                        if(unlink("../profile-picture/" . $uid . "." . $ext)) break;
                    }
                }
                else header('HTTP/1.0 400 Bad error');
            }
            else header('HTTP/1.0 400 Bad error');
        }
        else header('HTTP/1.0 400 Bad error');
    }
?>