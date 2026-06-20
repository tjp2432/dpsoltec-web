function doPost(e) {
  try {
    var nombre = e.parameter.nombre || '';
    var email = e.parameter.email || '';
    var empresa = e.parameter.empresa || '(no especificó)';
    var mensaje = e.parameter.mensaje || '';
    var asunto = e.parameter.asunto || 'CONSULTA WEB DP SOLTEC';

    var body = 'Nombre: ' + nombre + '\nEmail: ' + email + '\nEmpresa: ' + empresa + '\nMensaje: ' + mensaje;

    GmailApp.sendEmail('info@dpsoltec.com', asunto, body);

    return HtmlService.createHtmlOutput('<script>window.top.postMessage({status:"success"},"*");</script>');
  } catch (err) {
    return HtmlService.createHtmlOutput('<script>window.top.postMessage({status:"error",message:"' + err.message + '"},"*");</script>');
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('Servicio activo.');
}
