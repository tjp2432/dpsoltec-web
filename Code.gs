function doPost(e) {
  try {
    var tipo = e.parameter.tipo || 'contacto';

    if (tipo === 'registro') {
      return registrarUsuario(e.parameter);
    }

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

function registrarUsuario(p) {
  var nombre = (p.nombre || '').trim();
  var email = (p.email || '').trim().toLowerCase();
  var telefono = (p.telefono || '').trim();
  var passHash = (p.passHash || '').trim();

  if (!nombre || !email || !telefono || !passHash) {
    throw new Error('Faltan datos de registro');
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Usuarios');
  if (!sheet) {
    sheet = ss.insertSheet('Usuarios');
    sheet.appendRow(['Fecha', 'Nombre', 'Email', 'Telefono', 'PasswordHash']);
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === email) {
      throw new Error('Ese email ya está registrado');
    }
  }

  sheet.appendRow([new Date(), nombre, email, telefono, passHash]);

  GmailApp.sendEmail('info@dpsoltec.com', 'NUEVO REGISTRO WEB DP SOLTEC',
    'Nombre: ' + nombre + '\nEmail: ' + email + '\nTelefono: ' + telefono);

  return HtmlService.createHtmlOutput('<script>window.top.postMessage({status:"success"},"*");</script>');
}

function doGet() {
  return HtmlService.createHtmlOutput('Servicio activo.');
}
