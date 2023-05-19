
const url ="https://abc.fzlongcheng.top/api"


//  136开头为004的学习指令
const infraredStudyDataList = [
  new Uint8Array([136, 0, 0, 0, 0, 136]),
  new Uint8Array([136, 0, 1, 0, 0, 137]),
  new Uint8Array([136, 0, 2, 0, 0, 138]),
  new Uint8Array([136, 0, 3, 0, 0, 139]),
  new Uint8Array([136, 0, 4, 0, 0, 140]),
  new Uint8Array([136, 0, 5, 0, 0, 141]),
  new Uint8Array([136, 0, 6, 0, 0, 142]),
  new Uint8Array([136, 0, 7, 0, 0, 143]),
  new Uint8Array([136, 0, 8, 0, 0, 128]),
]
//  135开头为004的控制指令
const infraredControlDataList = [
  new Uint8Array([135, 0, 0, 0, 0, 135]),
  new Uint8Array([135, 0, 1, 0, 0, 134]),
  new Uint8Array([135, 0, 2, 0, 0, 133]),
  new Uint8Array([135, 0, 3, 0, 0, 132]),
  new Uint8Array([135, 0, 4, 0, 0, 131]),
  new Uint8Array([135, 0, 5, 0, 0, 130]),
  new Uint8Array([135, 0, 6, 0, 0, 129]),
  new Uint8Array([135, 0, 7, 0, 0, 128]),
  new Uint8Array([135, 0, 8, 0, 0, 143]),
]
//  134开头为003的控制指令
const infraredControlDataList003 = [
  new Uint8Array([134, 0, 0, 0, 0, 134]),
  new Uint8Array([134, 0, 1, 0, 0, 135]),
  new Uint8Array([134, 0, 2, 0, 0, 132]),
  new Uint8Array([134, 0, 3, 0, 0, 133]),
  new Uint8Array([134, 0, 4, 0, 0, 130]),
  new Uint8Array([134, 0, 5, 0, 0, 129]),
  new Uint8Array([134, 0, 6, 0, 0, 128]),
  new Uint8Array([134, 0, 7, 0, 0, 129]),
  new Uint8Array([134, 0, 8, 0, 0, 142]),
]

function getCommandsWithXor(commands) {
  const commandArrays = commands.map(command => {
    // 将16进制字符串转换为数字数组
    const dataArray = command.split(' ').map(numStr => parseInt(numStr, 16));

    // 计算异或和
    const xorSum = dataArray.slice(0, 5).reduce((acc, cur) => {
      return acc ^ cur;
    }, 0);

    // 将异或和添加到原数字数组中
    const dataArrayWithXor = [...dataArray.slice(0, 5), xorSum];

    // 将数字数组转换为Uint8Array
    return new Uint8Array(dataArrayWithXor);
  });

  return commandArrays;
}

// 开机关机
const stateDevice = [
  new Uint8Array([4, 0, 255, 8, 8, 251]),
  new Uint8Array([4, 0, 0, 8, 8, 4]),
]

// 设置模式
let modeCommands = []
const modeCommandsBase = [
  "05 00 00 08 08", // 自动模式
  "05 00 01 08 08", // 制冷模式
  "05 00 02 08 08", // 除湿模式
  "05 00 03 08 08", // 送风模式
  "05 00 04 08 08" // 制暖模式
];


// 温度设置
let temperatureCommands = []
const temperatureCommandsBase = [
  "06 00 10 08 08", // 16度
  "06 00 11 08 08", // 17度
  "06 00 12 08 08", // 18度
  "06 00 13 08 08", // 19度
  "06 00 14 08 08", // 20度
  "06 00 15 08 08", // 21度
  "06 00 16 08 08", // 22度
  "06 00 17 08 08", // 23度
  "06 00 18 08 08", // 24度
  "06 00 19 08 08", // 25度
  "06 00 1A 08 08", // 26度
  "06 00 1B 08 08", // 27度
  "06 00 1C 08 08", // 28度
  "06 00 1D 08 08", // 29度
  "06 00 1E 08 08", // 30度
  "06 00 1F 08 08" // 31度
];



  temperatureCommands = getCommandsWithXor(temperatureCommandsBase)
  modeCommands = getCommandsWithXor(modeCommandsBase)



module.exports = {
  infraredStudyDataList,
  infraredControlDataList,
  temperatureCommands,
  infraredControlDataList003,
  stateDevice,
  modeCommands,url
  
}