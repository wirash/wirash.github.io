<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="assets/php/save_user_changes.php" method="POST" enctype="multipart/form-data">
        <input type="text" name="uid" value="1673228696304400"/>
        <input type="text" name="username" value="w.ganesh"/>
        <input type="text" name="surname" value="Ganesh"/>
        <input type="text" name="name" value="Wirash"/>
        <input type="month" value="2023-02" name="expires"/>
        <select name="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
        </select>
        <!-- <input type="file" accept="image/*" name="dp"/> -->
        <input type="submit">
    </form>
</body>
</html>