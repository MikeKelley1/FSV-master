<?PHP
define('kOptional', true);
define('kMandatory', false);




error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('track_errors', true);

function DoStripSlashes($fieldValue)  { 
// temporary fix for PHP6 compatibility - magic quotes deprecated in PHP6
 if ( function_exists( 'get_magic_quotes_gpc' ) && get_magic_quotes_gpc() ) { 
  if (is_array($fieldValue) ) { 
   return array_map('DoStripSlashes', $fieldValue); 
  } else { 
   return trim(stripslashes($fieldValue)); 
  } 
 } else { 
  return $fieldValue; 
 } 
}

function FilterCChars($theString) {
 return preg_replace('/[\x00-\x1F]/', '', $theString);
}

function CheckEmail($email, $optional) {
 if ( (strlen($email) == 0) && ($optional === kOptional) ) {
  return true;
  } elseif ( preg_match("/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i", $email) == 1 ) {
  return true;
 } else {
  return false;
 }
}


$FTGemail_conf = DoStripSlashes( $_POST['app_email_conf']);

function CheckEqualTo($original, $FTGemail_conf) {
 if ($original == $repeated) {
  return true;
 } else {
  return false;
 }
}



if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
 $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
 $clientIP = $_SERVER['REMOTE_ADDR'];
}
//Basic Info
$FTGnamed = DoStripSlashes( $_POST['app_name'] );
$FTGemailed = DoStripSlashes( $_POST['app_email'] );
$FTGphoned = DoStripSlashes( $_POST['app_phone'] );
$FTGdateRequest = DoStripSlashes( $_POST['app_date']);
$FTGfliers = DoStripSlashes( $_POST['app_fliers']);
//CC Info
$FTGccName = DoStripSlashes( $_POST['ccName']);
$FTGccNumber = DoStripSlashes( $_POST['ccNumber']);
$FTGccExpire = DoStripSlashes( $_POST['ccExpire']);
$FTGccSecurity = DoStripSlashes( $_POST['ccSecurity']);
$FTGccZip = DoStripSlashes( $_POST['ccZip']);
$FTGsubmitted = DoStripSlashes( $_POST['app_submitted'] );



$validationFailed = false;

# Fields Validations


if (!CheckEmail($FTGemailed, kMandatory)) {
 $FTGErrorMessage['emailed'] = 'Check to see that you\'ve typed your email address correctly';
 $validationFailed = true;
}

if (!CheckEqualTo($FTGemaileder, $FTGemailed)) {
 $FTGErrorMessage['emaileder'] = 'These two email fields don\'t match...';
 $validationFailed = true;
}



# Include message in error page and dump it to the browser

if ($validationFailed === true) {

 $errorPage = '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /><title>Error</title></head><body>Errors found: <!--VALIDATIONERROR--></body></html>';

 $errorPage = str_replace('<!--FIELDVALUE:named-->', $FTGnamed, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:emailed-->', $FTGemailed, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:emaileder-->', $FTGemaileder, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:phoned-->', $FTGphoned, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:messaged-->', $FTGmessaged, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:submitted-->', $FTGsubmitted, $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:emailed-->', $FTGErrorMessage['emailed'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:emaileder-->', $FTGErrorMessage['emaileder'], $errorPage);


 $errorList = @implode("<br />\n", $FTGErrorMessage);
 $errorPage = str_replace('<!--VALIDATIONERROR-->', $errorList, $errorPage);



 echo $errorPage;

}

if ( $validationFailed === false ) {

require_once '../vendor/swiftmailer/swiftmailer/lib/swift_required.php';

//Send Email to site owner	

$transport = Swift_SmtpTransport::newInstance('relay.pair.com', 26)
  ->setUsername('info@flysunvalley.com')
  ->setPassword('titus09')
  ;

$mailer = Swift_Mailer::newInstance($transport);

$message = Swift_Message::newInstance('Fly Sun Valley')

->	setSubject('Appointment Request from Fly Sun Valley')
->	setFrom('info@flysunvalley.com')
->	setTo('chuck@flysunvalley.com')
->	setBody(
		"From: $FTGnamed \n".
		"Email: $FTGemailed \n".
		"Phone: $FTGphoned \n".
		"Requested Date: $FTGdateRequest \n".
		"Flyers: $FTGfliers \n".
		"\n".
		"CC Info: \n".
		"Name on Card: $FTGccName \n".
		"Card Number: $FTGccNumber \n".
		"Expiration Date: $FTGccExpire \n".
		"Security Code: $FTGccSecurity \n".
		"Billing Zip: $FTGccZip")
;

$result = $mailer->send($message);

//Send Confirmation Email to User
$transport = Swift_SmtpTransport::newInstance('relay.pair.com', 26)
  ->setUsername('info@flysunvalley.com')
  ->setPassword('titus09')
  ;

$mailer = Swift_Mailer::newInstance($transport);

$message = Swift_Message::newInstance('Fly Sun Valley')

->	setSubject('Appointment Request from Fly Sun Valley')
->	setFrom('chuck@flysunvalley.com')
->	setTo($FTGemailed)
->	setBody(
		"Thank you for requesting an appointment with Fly Sun Valley. We have recieved the Following information: \n".
		"From: $FTGnamed \n".
		"Email: $FTGemailed \n".
		"Phone: $FTGphoned \n".
		"Requested Date: $FTGdateRequest \n".
		"Flyers: $FTGfliers \n".
		"\n".
		"CC Info: \n".
		"Name on Card: $FTGccName \n".
		"Card Number: $FTGccNumber \n".
		"Expiration Date: $FTGccExpire \n".
		"Security Code: $FTGccSecurity \n".
		"Billing Zip: $FTGccZip \n".
		"\n".
		"We will get back to you as soon as possible with confirmation of your appointment. \n".
		"Sincerely, \n".
		"Fly Sun Valley Mailbot")
;

$result = $mailer->send($message);

$successPage = "/success.html";

$successPage = str_replace('<!--FIELDVALUE:named-->', $FTGnamed, $successPage);
$successPage = str_replace('<!--FIELDVALUE:emailed-->', $FTGemailed, $successPage);
$successPage = str_replace('<!--FIELDVALUE:emaileder-->', $FTGemaileder, $successPage);
$successPage = str_replace('<!--FIELDVALUE:phoned-->', $FTGphoned, $successPage);
$successPage = str_replace('<!--FIELDVALUE:messaged-->', $FTGmessaged, $successPage);
$successPage = str_replace('<!--FIELDVALUE:submitted-->', $FTGsubmitted, $successPage);

echo '<META HTTP-EQUIV=REFRESH CONTENT="1; '.$successPage.'">';

}







