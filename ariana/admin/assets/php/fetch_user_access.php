<?php
    error_reporting(0);
    include_once("dataBaseConnect.php");

    $uid = $_POST['uid'];

    $sql = "select uid, dp, surname, name, expires from users where uid = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$uid]);
    $access = $stmt->fetch();
    
    if($stmt->rowCount() == 1){
        $html_ouput = "";
        $expires = date('F Y',strtotime($access->expires)); //substr($access->expires, 0, -3);
        $expired = date('Y-m-d') > date('Y-m-d',strtotime($access->expires));

        $just_got_access = false;
        if($expired == false){
            $sql = "INSERT INTO attendance (uid) SELECT ? WHERE ? NOT IN (SELECT uid FROM attendance WHERE uid = ? AND DATE(time) = CURRENT_DATE() and TIME(time + INTERVAL 10 MINUTE) >= TIME(NOW()))";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$access->uid, $access->uid, $access->uid]);

            if($success){
                if($stmt->rowCount() == 0) $just_got_access = true;
            }
            else {
                header('HTTP/1.0 400 Bad error');
                die();
            }
        }
        else{
            $sql = "SELECT uid FROM attendance WHERE uid = ? AND DATE(time) = CURRENT_DATE() AND TIME(time + INTERVAL 10 MINUTE) >= TIME(NOW())";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$uid]);

            if($stmt->rowCount() >= 1) $just_got_access = true;
        }

        $expired_attr;
        $expired_text;

        if($just_got_access == true){
            $expired_attr = "justgotaccess";
            $expired_text = "Already scanned";
        }
        else{
            $expired_attr = $expired  == false ? "" : "expired";
            $expired_text = ($expired == false ? "Expires" : "Expired") . " " . $expires;
        }

        $html_ouput .= "
            <img
                src='assets/profile-picture/$access->dp'
                alt='user profile picture'
                class='udp'
                tabindex='-1' uid='$access->uid'/>
            <a class='uname'>$access->surname $access->name</a>
            <a class='uexpire' $expired_attr>$expired_text</a>
            <a class='access-status' $expired_attr></a>
        " . ($expired && ($just_got_access == false) ? "
            <button class='allow-access icon-btn' uid='$access->uid'>
                <svg>
                    <use xlink:href='assets/svg/shield-checkmark.svg#svg'></use>
                </svg>
                Grant Access
            </button>" : "");
        echo $html_ouput;
    }
    else header('HTTP/1.0 400 Bad error');
?>