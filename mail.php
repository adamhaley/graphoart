<?php
	
	$name = $_GET['name'];
	$address = $_GET['email_address'];
	$usersubject = $_GET['subject'];
	$usermessage = $_GET['message'];

	$email_copy = $_GET['email_copy'];

	$to = 'sandrasimon76@googlemail.com';
	// $to = 'adamhaley@gmail.com';

	$headers = "From: $address" . "\r\n"; 


	$message = $usermessage;

	if($email_copy=='on'){
		$to .= ",$address";
	}

	mail($to,'GraphoART.com: ' . $usersubject, $message,$headers);
	echo 1;



?>