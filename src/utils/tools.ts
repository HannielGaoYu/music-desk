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