
import fs from 'fs'
import axios from 'axios'
import type{ Ref } from 'vue'

interface musicInfo {
  url: string
  filename?: string
  artist: string
}

export const downloadAudio = (filePath: string, fileName: string, type: string) => {
  let path = filePath
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send()
  xhr.onprogress = function () {
    console.log(this);
  }
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      const url = URL.createObjectURL(this.response);
      let a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.${type}`;
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }
}

export const downloadAudio2 =  async(musicInfo: musicInfo, progress: Ref, result: Ref) => {
  const { artist, url } = musicInfo
  const downloadPath = 'D:\\MyMusic\\' + artist

  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true })
  }

  try {
    const response = await axios({url, method: 'GET', responseType: 'stream'})
    const writer = fs.createWriteStream(downloadPath)

    response.data.on('data', (chunk: any) => {
      progress.value = (response.headers['content-length'] / chunk.length) * 100
    })
    response.data.pipe(writer)

    writer.on('finish', () => {
      result.value = "well"
    })
  }
  catch {
    
  }
} 