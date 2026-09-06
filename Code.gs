function doPost(e) {
  try {
    var tipo = e.parameter.tipo || 'contacto';

    if (tipo === 'registro') {
      return registrarUsuario(e.parameter);
    }
    if (tipo === 'registro_confirm') {
      return confirmarRegistro(e.parameter);
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
  var code = (p.code || '').trim();

  if (!nombre || !email || !telefono || !passHash || !code) {
    throw new Error('Faltan datos de registro');
  }
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Código inválido');
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

  GmailApp.sendEmail(email, 'Tu código de verificación - DP Soltec',
    'Hola ' + nombre + ',\n\nGracias por registrarte en DP Soluciones Tecnológicas.\n\nTu código de verificación es: ' + code + '\n\nColoca este código en la web para finalizar tu registro.\n\nSaludos,\nDP Soltec');

  return HtmlService.createHtmlOutput('<script>window.top.postMessage({status:"success"},"*");</script>');
}

function confirmarRegistro(p) {
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

function doGet(e) {
  var cb = (e && e.parameter.callback) || 'callback';
  var out = { status: 'error', message: 'Servicio activo.' };
  if (e && e.parameter.action === 'login') {
    try {
      out = verificarLogin(e.parameter);
    } catch (err) {
      out = { status: 'error', message: err.message };
    }
  }
  return ContentService.createTextOutput(cb + '(' + JSON.stringify(out) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function verificarLogin(p) {
  var email = (p.email || '').trim().toLowerCase();
  var passHash = (p.passHash || '').trim();
  if (!email || !passHash) {
    return { status: 'error', message: 'Faltan datos.' };
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Usuarios');
  if (!sheet) {
    return { status: 'error', message: 'Email o contraseña incorrectos.' };
  }
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === email) {
      if (String(data[i][4]) === passHash) {
        return { status: 'success', nombre: data[i][1] };
      }
      return { status: 'error', message: 'Email o contraseña incorrectos.' };
    }
  }
  return { status: 'error', message: 'Email o contraseña incorrectos.' };
}
