/* https://www.electronjs.org/docs/latest/api/menu */

module.exports = () => {
    const { Menu } = require('electron');
    const isMac = process.platform === 'darwin'
    const template = [
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
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            /*{ type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },*/
            { type: 'separator' },
            { role: 'togglefullscreen' }
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

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}