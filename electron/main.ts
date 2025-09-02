import { app, BrowserWindow, ipcMain, screen } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { MusicInfo } from '../src/type'
import axios from 'axios'

// import {Menu} from 'electron'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')


process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1040,
    height: 650,
    frame: false,
    resizable: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  ipcMain.handle('custom-adsorption', (event, res) => {
    if (event) {}
    let x = res.appX
    let y = res.appY
    win && win.setBounds({ x, y, width: res.width, height: res.height })
    // console.log(event)
  })

  ipcMain.handle('get-window-position',  () => { 
    if (win) return win.getPosition();  
    return [0, 0]; 
  }); 

  ipcMain.handle('get-window-scaleFactor', () => {
    return (screen.getPrimaryDisplay().scaleFactor)
  })

  ipcMain.handle('download-music', async (event, musicInfo: MusicInfo) => {
    const {url, artist, filename} = musicInfo
    const downloadPath = 'D:\\MyMusic\\' + artist +'\\'

    const filePath = downloadPath + filename

    console.log(filePath)

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, {recursive: true})
    }

    try {
      const response = await axios({url, method: 'GET', responseType: 'stream'})
      const writer = fs.createWriteStream(filePath)

      const totalLength = parseInt(response.headers['content-length'],  10);
      let downloadedLength = 0;

      response.data.on('data', (chunk: any) => {
        downloadedLength += chunk.length; 
        let progress = Math.floor((downloadedLength  / totalLength) * 100);
        console.log(progress)
        win?.webContents.send('download-progress', progress)
      })

      // 写入文件
    response.data.pipe(writer); 

    writer.on('finish',  () => {
      event.sender.send('download-complete',  { filename, path: filePath }); // 发送完成事件
    });
    } catch (err: any) {
      event.sender.send('download-err', {filename, error: err.message})
      console.log(err.message)
    }
  })

  ipcMain.handle('full-shrink-screen', async (event, res) => {
    if (event) {}
    win?.setFullScreen(res.state)
  })

  // Menu.setApplicationMenu(null)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
