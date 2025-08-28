const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})]/

export const getRangeRandNum = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1) ) + start
}

export const formatSongTime = (sec: number) => {
  if (sec === Number.NaN) {
    sec = 0
  }
  let str = ""
  if (sec >= 3600) {
    str += padLeftZeao(Math.floor(sec / 3600), 2)
    str += ":"
    sec -= 3600*Math.floor(sec / 3600)
  } else if (sec >= 60) {
    str += padLeftZeao(Math.floor(sec / 60), 2)
    str += ":"
    sec -= 60*Math.floor(sec/60)
    str += padLeftZeao(Math.floor(sec), 2)
  } else {
    str += "00:"
    str += padLeftZeao(Math.floor(sec), 2)
  }
  if (str === "00:aN") {
    return "00:00"
  }
  return str
}

export const padLeftZeao = (num: number, total: number) => {
  if (typeof num !== "number") {
    num = 0
  }
  let str = "0000000000000000" + num 
  return str.slice(str.length - total, str.length)
}

export const parseLyric = (lrcString: string | null) => {
  if (typeof lrcString === null) {
    return []
  }
  const lyricInfos = []

  const lyricLines = lrcString!.split("\n")
  for (const lineString of lyricLines) {
    const results = timeReg.exec(lineString)
    if (!results) continue
    const minute = parseInt(results![1]) * 60 * 1000
    const second = parseInt(results![2]) * 1000
    const mSecond = results![3].length === 2 ? parseInt(results![3]) * 10 : parseInt(results![3])

    const time = minute + second + mSecond
    const text = lineString.replace(timeReg, "")
    const lyricInfo = {
      text,
      time
    }
    lyricInfos.push(lyricInfo)
  }
  return lyricInfos
}

export const foundSongWord = (wordList: any[], currentTime: number) => {
  if (wordList.length === 0) return 0
  let index = wordList.length - 1
  for(let i = 0; i < wordList.length; i++) {
    let time = wordList[i].time
    if (currentTime < time) {
      index = i - 1
      break
    }
  }
  return index
}