const { ipcRenderer } = require('electron');

window.onload = function() {
  ipcRenderer.send("get-config");
}

ipcRenderer.on('get-config-response', (event, response) => {
  console.log(response);
})

const loginBtn = document.getElementById('loginBtn');
const username = document.getElementById('username');
const password = document.getElementById('password');

const error_title = document.getElementById('err_title');
const error_body = document.getElementById('err_body');

loginBtn.addEventListener('click', login);



function login() {
  ipcRenderer.send('check-db', {Test: 123});
  console.log('Loggin In...')
  console.log(verifyInputs());

  if(verifyInputs() === true) {
    const data = {
      Username: username.value,
      Password: password.value
    }
  
    console.log(data);
  } else {
    
  }
}

function verifyInputs() {
  var inputsEntered = true; 


  if(username.value === '') {
    inputsEntered = false;
    return inputsEntered;
  }

  if(password.value === '') {
    inputsEntered = false;
    return inputsEntered;
  }

  return inputsEntered;
}