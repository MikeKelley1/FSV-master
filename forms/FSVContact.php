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






if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
 $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
 $clientIP = $_SERVER['REMOTE_ADDR'];
}

$FTGnamed = DoStripSlashes( $_POST['named'] );
$FTGemailed = DoStripSlashes( $_POST['emailed'] );
$FTGphoned = DoStripSlashes( $_POST['phoned'] );
$FTGmessaged = DoStripSlashes( $_POST['messaged'] );
$FTGsubmitted = DoStripSlashes( $_POST['submitted'] );



$validationFailed = false;


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

 # Email to Form Owner
  
 $emailSubject = FilterCChars("You have a lead from the Fly Sun Valley website");
  
 $emailBody = "Name : $FTGnamed\n"
  . "From : $FTGemailed\n"
  . "Phone : $FTGphoned\n"
  . "Message : $FTGmessaged\n"
  . "\n"
  . "submitted from: $clientIP\n"
  . "at: " . date('Y-m-d H:i:s') . "";
  $emailTo = 'chuck@flysunvalley.com';
   
  $emailFrom = FilterCChars("info@flysunvalley.com");
   
$emailHeaders = 'MIME-Version: 1.0';
$emailHeaders = 'Content-type: text/html; charset=iso-8859-1';
$emailHeaders = "From: mailbot@flysunvalley.com\r\n";
   
  
  mail($emailTo, $emailSubject, $emailBody, $emailHeaders);
  
  
 # Confirmation Email to User
  
 $confEmailTo = FilterCChars($FTGemailed);
  
 $confEmailSubject = FilterCChars("Thanks for clicking the Send button. Your message is being delivered to the fine folks at Fly Sun Valley.");
  
 $confEmailBody = "It appears you've just clicked the \"submit\" button on our contact form at Fly Sun Valley. The information we've forwarded to the office contains the following information:\n"
  . "\n"
  . "Name : $FTGnamed\n"
  . "Email : $FTGemailed\n"
  . "Phone : $FTGphoned\n"
  . "Message : $FTGmessaged\n"
  . "\n"
  . "\n"
  . "Thanks for contacting Fly Sun Valley. We'll get back to you as soon as possible.\n"
  . "\n"
  . "Sincerely,\n"
  . "Fly Sun Valley Forms Bot";
  

$confHeaders = 'MIME-Version: 1.0';
$confHeaders = 'Content-type: text/html; charset=iso-8859-1';
$confHeaders = "From: info@flysunvalley.com\r\n";
 
 

  
 mail($confEmailTo, $confEmailSubject, $confEmailBody, $confHeaders);

# Include message in the success page and dump it to the browser

$successPage = "/success.html";

$successPage = str_replace('<!--FIELDVALUE:named-->', $FTGnamed, $successPage);
$successPage = str_replace('<!--FIELDVALUE:emailed-->', $FTGemailed, $successPage);
$successPage = str_replace('<!--FIELDVALUE:emaileder-->', $FTGemaileder, $successPage);
$successPage = str_replace('<!--FIELDVALUE:phoned-->', $FTGphoned, $successPage);
$successPage = str_replace('<!--FIELDVALUE:messaged-->', $FTGmessaged, $successPage);
$successPage = str_replace('<!--FIELDVALUE:submitted-->', $FTGsubmitted, $successPage);

echo '<META HTTP-EQUIV=REFRESH CONTENT="1; '.$successPage.'">';

}

?>