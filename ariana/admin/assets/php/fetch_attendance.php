<?php
    error_reporting(0);
    include_once("dataBaseConnect.php");

    $sql = "select date_format(time, '%H:%i:%s') as time, a.uid as uid, dp, username, surname, name, expires from attendance a, users u where a.uid = u.uid and date(time) = CURRENT_DATE() order by time desc";
    //$sql = "select date_format(time, '%H:%i:%s') as time, a.uid as uid, dp, username, surname, name, expires from attendance a, users u where a.uid = u.uid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([]);
    $attendances = $stmt->fetchAll();

    if($stmt->rowCount() > 0){
        $html_ouput = "";
        foreach($attendances as $attendance){
            $expires = substr($attendance->expires, 0, -3);
            $html_ouput .= "<tr>
                <td><input type='time' value='$attendance->time' readonly /></td>
                <td class='uid'>$attendance->uid</td>
                <td>
                    <img src='assets/profile-picture/$attendance->dp' alt='dp' tabindex='-1' />
                </td>
                <td class='username'>$attendance->username</td>
                <td class='surname'>$attendance->surname</td>
                <td class='name'>$attendance->name</td>
                <td class='expires'>
                    <input type='month' value='$expires' readonly />
                </td>
            </tr>";
        }
        echo $html_ouput;
    }
    else header('HTTP/1.0 400 Bad error');
?>