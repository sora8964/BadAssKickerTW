const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path');
const { dialog, Menu } = require('electron');
const fs = require('node:fs');
const config = fs.existsSync("./config.json") ? require('./config.json') : {};

let sourceFilePath;
let win;

const saveConfig = () => {
    fs.writeFile('./config.json', JSON.stringify(config), err => {
        if (err) {
            console.error(err);
        } else {
            console.log("Write config successfully.")
        }
    });
}

const createWindow = () => {
    win = new BrowserWindow({
        show: false,
        webPreferences: { preload: path.join(__dirname, 'preload.js')}
    });
    win.maximize();
    win.show();    
    win.loadFile('index.html');
}

const setOutputDirectory = () => {
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
        if(! result.canceled){
            config.outputDirectory=result.filePaths[0];
            saveConfig();
            win.send('setOutputDirectory', result.filePaths);
        }
    }).catch(err => {
        console.log(err)
    })
}

const setFFMpegDirectory = () => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'FFMpeg Binary', extensions: ['exe'] },]
    }).then(result => {
        if(! result.canceled){
            config.ffMpegLocation=result.filePaths[0];
            saveConfig();
        }
    }).catch(err => {
        console.log(err)
    })
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('ping', () => 'pong');

    ipcMain.handle('setOutputDirectory',()=>{
        setOutputDirectory();
    })

    ipcMain.handle('convert', (event,message) => {
        if (! config.ffMpegLocation || ! config.outputDirectory){
            win.send('error', "配置不齊全，請先設置FFMpeg及輸出目錄");
            return false;
        }

        const { exec } = require('child_process');

        let destFilename=message.destFilename;
        let ffmpegCommand=config.ffMpegLocation
            +" -i \""+message.srcFilePath
            +"\" -ss "+message.videoStartSecond
            +" -t "+(message.duration)
            +" -c copy \""+path.join(config.outputDirectory,destFilename);

        console.log("Message: ");
        console.log(message);
        console.log("FFMpegCommand: ");
        console.log(ffmpegCommand);
        
        const childProcess = exec(ffmpegCommand);
    
        childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            win.send('stdout', data);
        });
    
        childProcess.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            win.send('stderr', data);
            if(data.toString().indexOf("already exists. Overwrite ?") > -1){
                win.send('alreadyExists');
            }
        });
    
        childProcess.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
            win.send('exitCode', code);
            if(code==0){
                exec("explorer.exe /select,\""+path.join(config.outputDirectory,destFilename)+"\"");
            }
        });
    
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    /* https://www.electronjs.org/docs/latest/api/menu */
    const isMac = process.platform === 'darwin'
    const menuTemplate =  [
        // { role: 'appMenu' }
        ...(isMac
        ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
            }]
        : []),
        {
        /*label: 'View',*/
        label: "檔案",
        submenu: [
            { role: 'reload' },{ role: 'forceReload' },{ role: 'toggleDevTools' },
            /*{ type: 'separator' },{ role: 'resetZoom' },{ role: 'zoomIn' },{ role: 'zoomOut' },*/
            { type: 'separator' },{ role: 'togglefullscreen' }
        ]
        },
        {
        label: "設定",
        submenu: [
            {
                label: '設置輸出目錄',
                click: async () => {
                    setOutputDirectory();
                }
            },
            {
                label: '設置FFMpeg位置',
                click: async () => {
                    setFFMpegDirectory();
                }
            }
        ]
        },
        {
        /*role: 'help',*/
        label: "幫助",
        submenu: [
            {
            label: '檢舉神器 on GitHub',
            click: async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://github.com/sora8964/badass-kicker-tw')
            }
            }
        ]
        },
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

