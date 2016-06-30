<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

//	$first = $_POST['first'];
//	$last = $_POST['last'];
//      $json = json_encode($_POST);
//  file_put_contents('new_json.json', $json, FILE_APPEND); 

    $data = $_POST;
    $inp = file_get_contents('places.json');
    $tempArray = json_decode($inp);
    array_push($tempArray, $data);
    $jsonData = json_encode($tempArray);
    file_put_contents('places.json', $jsonData);
}
?>