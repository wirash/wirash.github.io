<?php
    error_reporting(0);
    include_once("dataBaseConnect.php");

    $sql = "select * from users order by uid desc";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([]);
    $users = $stmt->fetchAll();

    if($stmt->rowCount() > 0){
        $html_ouput = "";
        foreach($users as $user){
            $expires = substr($user->expires, 0, -3);
            $active = $user->active == '1' ? array("selected","") : array("","selected");
            $created = date('Y-m-d', $user->uid/1000000);
            // $dp_base64 = base64_encode(file_get_contents($user->dp));
            $html_ouput .= "<tr>
                <td></td>
                <td class='uid'>$user->uid</td>
                <td class='profile-picture-container'>
                    <label
                        class='profile-picture toggle btn flex-row'
                        style=--furl:url('assets/profile-picture/$user->dp');--fname:''>
                        <input
                            type='file'
                            accept='image/*'
                            class='profile-picture-input' />
                    </label>
                </td>
                <td class='username'><input type='text' value='$user->username' pattern='[a-z.]{3,20}'/></td>
                <td class='surname'><input type='text' value='$user->surname' pattern='[A-zÀ-ž][A-zÀ-ž ]{3,20}'/></td>
                <td class='name'><input type='text' value='$user->name' pattern='[A-zÀ-ž][A-zÀ-ž ]{3,20}'/></td>
                <td class='created'>
                    <input type='date' value='$created' readonly />
                </td>
                <td class='last-payment'>
                    <input type='date' value='$user->last_payment' readonly />
                </td>
                <td class='expires'><input type='month' value='$expires' /></td>
                <td>
                    <select class='btn status'>
                        <option value='Active' $active[0]>Active</option>
                        <option value='Inactive' $active[1]>Inactive</option>
                    </select>
                </td>
                <td>
                    <div class='actions-container'>
                        <button class='action icon' title='Reset Password'>
                            <svg>
                                <use xlink:href='assets/svg/reset.svg#svg'></use>
                            </svg>
                        </button>
                        <button class='action icon' title='Delete User'>
                            <svg class='red'>
                                <use xlink:href='assets/svg/delete.svg#svg'></use>
                            </svg>
                        </button>
                        <button class='action icon' title='Save Changes'>
                            <svg>
                                <use xlink:href='assets/svg/save.svg#svg'></use>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>";
        }
        echo $html_ouput;
    }
    else header('HTTP/1.0 400 Bad error');
?>