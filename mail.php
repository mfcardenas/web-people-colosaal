<?php

$notify = "0";

if (isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    $name =     filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email =     filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);
    $message =     filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    $phone =     filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);

    $a = "marlonca@ucm.es";
    $asunto = "Este mensaje es de prueba";
    $cuerpo = '<html> 
                    <head> 
                        <title>Web Hack4People</title> 
                    </head> 
                    <body> 
                        <h1>Solicitud de Información desde la Web Hack4People</h1> 
                        <p> 
                            <b>' . ucwords($name) . ' </b>. realiza la siguiente petición:<br/>' . $message . '. 
                        </p>
                        <p>
                            Datos suministrados:<br/>
                            <b>Email: ' . $email. '</b><br/>
                            <b>Teléfono: ' . $phone. '</b><br/>
                        </p>
                    </body> 
                </html>';

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
    // R emitente
    $headers .= "From: Web Hack4People <marlonca@ucm.es>\r\n";

    // Dirección de respuesta (puede ser distinta que la del remitente)
    $headers .= "Reply-To: marlon.cb@gmail.es\r\n";

    // Ruta del mensaje desde origen a destino
    $headers .= "Return-path: marlon.cb@gmail.es\r\n";

    // Con copia a
    $headers .= "Cc: marlon.cb@gmail.com\r\n";

    // Con copia oculta
    $headers .= "Bcc: marlon.cb@gmail.com\r\n";

    if (mail($a, $asunto, $cuerpo, $headers)){
        $notify = "1";
    } else {
        $notify = "2";
    }

} else {
    $notify = "3";
}

header("Location:contacta.html?notify=" . $notify);