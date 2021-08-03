const { ipcRenderer } = require('electron');

window.onload = function() {
  ipcRenderer.send('get-config');
}

ipcRenderer.on('get-config-response', (event, response) => {
  console.log(response);
  ipcRenderer.send('app-loaded')
});