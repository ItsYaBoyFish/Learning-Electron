// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const fs = require('fs');
const path = require('path');
const Color = require('cli-color');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // This and Context Isolation lets us use ipcRenderer in our web page js files.
      contextIsolation: false,
    },
    show: false,// We set this to false, and the use maximize below to take up the whole screen. We then call show after wards to prevent user from seeing anything on load.
  })

  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadFile('./client/LandingPage/LandingPage.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('check-db', (event, info) => {
  console.log(info);

  const models = require('./DB/models/EXPORTS');

  models.Users.findAll().then(results => {
    event.reply('check-db-response', results);
  })
});


ipcMain.on('get-config', (event, info) => {
  if(fs.existsSync(path.join(__dirname, 'Training-Config.json')) === false) {
    createConfigurationFile(event);
  } else {
    var config = require('./config.json');
    event.reply('get-config-response', config);
  }
})


function createConfigurationFile(event) {
  console.log('Creating File.')
  const configurationTemplate = {
    Test: 123
  }

  fs.writeFile('config.json', JSON.stringify(configurationTemplate, null, 2), function(err) {
    if(err) {
      console.log(Color.red('There was an error creating the Configuration File.'));
      return;
    }
    console.log(Color.green("Configuration File Was Successfully Created..."));
    var config = require('./config.json');
    event.reply('get-config-response', config);
  });
}