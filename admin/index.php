<?php
$images = array(
    'jpg',
    'jpeg',
    'png',
    'gif'
);

$pdo = new PDO('sqlite:messages.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE,
                   PDO::ERRMODE_EXCEPTION);

if (isset($_POST['id'])) {
    $stmt = $pdo->prepare('UPDATE Message SET enabled = 1 WHERE id = ?;');
    $stmt->execute([$_POST['id']]);
}
?>

<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>

<body>
    <div id="container">
        <?php   
        $stmt = $pdo->prepare('SELECT * FROM Message WHERE enabled = 0;');
        $stmt->execute();
        $messages = $stmt->fetchAll();

        for ($i = 0; $i < count($messages); $i++) { ?>
        <div class="messageBox">
            <form action="index.php" method="post">
                <input name="id" type="hidden" value="<?php echo $messages[$i]['id']; ?>" />
                <textarea class="message"><?php echo $messages[$i]['message']; ?></textarea>
                <?php
                    $ext = pathinfo($messages[$i]['file'], PATHINFO_EXTENSION);
                    if (in_array($ext, $images)) { ?>
                <img src="Media/<?php echo $messages[$i]['file']; ?>" width="100%" />
                <?php
                    } else {
                    ?>
                <video width="100%" height="240px" controls>
                    <source src="Media/<?php echo $messages[$i]['file']; ?>" />
                </video>
                <?php } ?>
                <label for="twitter">Twitter</label>
                <input type="text" name="twitter" class="username" value="<?php echo $messages[$i]['twitter']; ?>" />
                <label for="instagram">Instagram</label>
                <input type="text" name="instagram" class="username"
                    value="<?php echo $messages[$i]['instagram']; ?>" />
                <label for="tumblr">Tumblr</label>
                <input type="test" name="tumblr" class="username" value="<?php echo $messages[$i]['tumblr']; ?>" />
                <input type="submit" name="submit" value="Enable" />
            </form>
        </div>
        <br>
        <?php
        }
        ?>
    </div>
</body>

</html>