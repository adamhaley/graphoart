<?php
	
	$name = $_GET['name'];
	$address = $_GET['address'];
	$usersubject = $_GET['subject'];
	$usermessage = $_GET['message'];

	$email_copy = $_GET['email_copy'];

	$to = 'sandrasimon76@googlemail.com';
	
	$message = $usermessage;

	if($email_copy == 'on'){
		$to .= ",$address";
	}

	mail($to,'GraphoART.com: ' . $usersubject, $message);
	echo 1;



?>