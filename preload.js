const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ffmpeg', {
  convert: (message) => ipcRenderer.invoke('convert', message)
})

ipcRenderer.on('stdout', (event, data) => {
  console.log('stdout: ', data);
  topLeftInfo.innerHTML+="<p>"+data+"</p>";
  topLeftInfo.scrollTop = topLeftInfo.scrollHeight;
});

ipcRenderer.on('stderr', (event, data) => {
  console.log('stderr: ', data);
  topLeftInfo.innerHTML+="<p>"+data+"</p>";
  topLeftInfo.scrollTop = topLeftInfo.scrollHeight;
});

ipcRenderer.on('alreadyExists', (event) => {
  alert("Already Exists!");
});

ipcRenderer.on('exitCode', (event, exitCode) => {
  if(exitCode==0){
    topLeftInfo.innerHTML="";
  }
});

ipcRenderer.on('error', (event, errMsg) => {
  alert(errMsg);
});

ipcRenderer.on('openFile', (event) => {
  document.getElementById("fileDialog").click();
});