// Si tu script NO fue creado dentro de la planilla, pegá acá el ID
// (está en la URL del Sheet: docs.google.com/spreadsheets/d/ESTE-ES-EL-ID/edit)
var SHEET_ID = '';

function getUsuariosSheet() {
  var ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Sin acceso a la planilla: configurá SHEET_ID');
  }
  var sheet = ss.getSheetByName('Usuarios');
  if (!sheet) {
    sheet = ss.insertSheet('Usuarios');
    sheet.appendRow(['Fecha', 'Nombre', 'Email', 'Telefono', 'PasswordHash']);
  }
  return sheet;
}

function doPost(e) {
  try {
    var tipo = e.parameter.tipo || 'contacto';

    if (tipo === 'registro') {
      return registrarUsuario(e.parameter);
    }
    if (tipo === 'registro_confirm') {
      return confirmarRegistro(e.parameter);
    }
    if (tipo === 'actualizar_datos') {
      return actualizarDatos(e.parameter);
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

  var sheet = getUsuariosSheet();

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === email) {
      throw new Error('Ese email ya está registrado');
    }
  }

  GmailApp.sendEmail(email, 'Tu código de verificación - DP Soltec',
    'Hola ' + nombre + ', gracias por registrarte en DP Soluciones Tecnológicas. Tu código de verificación es: ' + code + '. Coloca este código en la web para finalizar tu registro. Saludos, DP Soltec');

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

  var sheet = getUsuariosSheet();

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
  if (e && e.parameter.action === 'testmail' && e.parameter.to) {
    try {
      GmailApp.sendEmail(e.parameter.to, 'Prueba DP Soltec', 'El servicio de mail funciona correctamente.');
      out = { status: 'success' };
    } catch (err) {
      out = { status: 'error', message: err.message };
    }
  }
  return ContentService.createTextOutput(cb + '(' + JSON.stringify(out) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function actualizarDatos(p) {
  var email = (p.email || '').trim().toLowerCase();
  var nombre = (p.nombre || '').trim();
  var telefono = (p.telefono || '').trim();
  var direccion = (p.direccion || '').trim();

  if (!email || !nombre || !telefono) {
    throw new Error('Faltan datos');
  }

  var sheet = getUsuariosSheet();
  var headers = sheet.getRange(1, 1, 1, 6).getValues()[0];
  if (!headers[5]) {
    sheet.getRange(1, 6).setValue('Direccion');
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === email) {
      sheet.getRange(i + 1, 2).setValue(nombre);
      sheet.getRange(i + 1, 4).setValue(telefono);
      sheet.getRange(i + 1, 6).setValue(direccion);
      return HtmlService.createHtmlOutput('<script>window.top.postMessage({status:"success"},"*");</script>');
    }
  }
  throw new Error('Usuario no encontrado');
}

function verificarLogin(p) {  var email = (p.email || '').trim().toLowerCase();
  var passHash = (p.passHash || '').trim();
  if (!email || !passHash) {
    return { status: 'error', message: 'Faltan datos.' };
  }
  var sheet = getUsuariosSheet();
  if (!sheet) {
    return { status: 'error', message: 'Email o contraseña incorrectos.' };
  }
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === email) {
      if (String(data[i][4]) === passHash) {
        return { status: 'success', nombre: data[i][1], telefono: data[i][3], direccion: data[i].length > 5 ? data[i][5] : '' };
      }
      return { status: 'error', message: 'Email o contraseña incorrectos.' };
    }
  }
  return { status: 'error', message: 'Email o contraseña incorrectos.' };
}
