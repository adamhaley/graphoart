<?php
$dir = $_GET['dir'];

if ($handle = opendir($dir)) {
    
    $entries = array();   
    while (false !== ($entry = readdir($handle))) {
        if(!preg_match("/^\./",$entry)){
            $entries[] = "$entry";
        }
    }	
    closedir($handle);

    header('Content-type:application/json');
    echo "{";
    echo "\"files\":";
    echo json_encode($entries);
    echo "}";
}

?>