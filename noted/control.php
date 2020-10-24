<?php
date_default_timezone_set('Asia/Jakarta');
$tanggal = date("l, G:i:s d-m-Y");
$file_name = "content.json";

if (isset($_POST['submit']) && isset($_POST['title']) && isset($_POST['content'])) {
    $json = new stdClass;
    $json->id = generateRandomString(20);
    $json->datetime = $tanggal;
    $json->title = $_POST['title'];
    $json->content = $_POST['content'];

    //get file
    $my_file = file_get_contents($file_name);

    //decode
    $fileDecode = json_decode($my_file);

    //add value to json
    array_push($fileDecode, $json);

    //to save
    file_put_contents($file_name, json_encode($fileDecode));

    echo "ok";
} else if (isset($_POST['refresh'])) {
    if (file_exists($file_name)) {
        echo file_get_contents($file_name);
    } else {
        $myfile = fopen($file_name, "w") or die("aku di sini");
        $txt = "[]";
        fwrite($myfile, $txt);
        fclose($myfile);

        echo file_get_contents($file_name);
    }
} else if (isset($_POST['delete']) && isset($_POST['id'])) {
    $post_id = $_POST['id'];

    //get file
    $my_file = file_get_contents($file_name);

    //decode
    $fileDecode = json_decode($my_file);

    //foreach
    $newJson = array();
    foreach ($fileDecode as $element) {
        //check the property of every element
        if ($post_id != $element->id) {
            array_push($newJson, [
                'id' => $element->id,
                'datetime' => $element->datetime,
                'title' => $element->title,
                'content' => $element->content,
            ]);
        } else {
            $title = $element->title;
        }
    }

    //to save
    file_put_contents($file_name, json_encode($newJson));

    header('Content-Type: application/json'); // <-- header declaration
    echo json_encode([
        'status' => 'ok',
        'title' => $title,
    ]);
} else if (isset($_GET['pass'])) {
    if ($_GET['pass'] == "jefripunza") {
        $status = "ok";
    } else {
        die();
    }

    header('Content-Type: application/json'); // <-- header declaration
    echo json_encode([
        "status" => $status,
    ]);
}
function generateRandomString($length = 10)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
