// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification, ipcRenderer } = require('electron')
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
  });

  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadFile('./client/LandingPage/LandingPage.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createLoadingWindow() {
  const loadingWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    webPreferences: {
      nodeIntegration: true, // This and Context Isolation lets us use ipcRenderer in our web page js files.
      contextIsolation: false,
      show: false,
    },
  });

  loadingWindow.once('ready-to-show', () => {
    loadingWindow.show()
  })

  // and load the index.html of the app.
  loadingWindow.loadFile('./client/LoadingPage/LoadingPage.html');

  loadingWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // createWindow();
  createLoadingWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)   createLoadingWindow();
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

ipcMain.on('app-loaded', (event, info) => {
  // Create Application Window
  createWindow();
  // Close the loading window.
  BrowserWindow.fromId(event.frameId).destroy();
})


ipcMain.on('get-config', (event, info) => {
  // Check to see if the resources folder exists.
  if(fs.existsSync(path.join(__dirname, './resources')) === true) {
    // Check to if the configuration file already exists.
    if(fs.existsSync(path.join(__dirname, '/resources/config.json')) === true) {
      console.log('Configuration Already Exists.')
      var config = require('./resources/config.json');
      event.reply('get-config-response', config);
    } else {
      createConfigurationFile(event, false);
    }
  } else {
    // Check to if the configuration file already exists.
    if(fs.existsSync(path.join(__dirname, '/config.json')) === true) {
      console.log('Configuration Already Exists.')
      var config = require('./config.json');
      event.reply('get-config-response', config);
    } else {
      createConfigurationFile(event, true);
    }
  }
});


function createConfigurationFile(event, InDevelopment) {
  console.log('Creating File.')
  console.log(InDevelopment);
  const configurationTemplate = {
    Test: 123
  }

  if(InDevelopment === true) {
    var errFound;
    fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(configurationTemplate, null, 2), (err) => {
      // If err then send this response.
      if(err) {
        errFound = err 
        var data = {
          Success: false,
          Error: errFound
        }
      };

    // Else set data.
      var data = {
        // Config: require('./config.json'),
        Success: true,
      }
      event.reply('get-config-response', data);
    })
  } else {
    fs.writeFile(path.join(__dirname, '/resources/config.json'), JSON.stringify(configurationTemplate, null, 2), (err) => {
      // If err then send this response.
      if(err) {
        errFound = err 
        var data = {
          Success: false,
          Error: errFound
        }
      };

    // Else set data.
      var data = {
        // Config: require('./config.json'),
        Success: true,
      }
      event.reply('get-config-response', data);
    })
  }
}