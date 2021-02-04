// １０進数で管理された定休日を配列にして返します
exports.getHoliday =  function(holidaySetting) {
  return new Promise((resolve, reject) => {
    let holiday = [];
    const holidayMaster = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日','祝日'];

    if (holidaySetting){
      // 10進数→2進数
      holidaySetting=holidaySetting.toString(2);
      //console.log(holiday_setting);
      for (let i = 0; i < 8; i++) {
        if (holidaySetting.substr( i, 1 ) === '1'){
          holiday.push(holidayMaster[i]);
          //console.log(holiday);
        }
      }
    }
    resolve(holiday);
  });
};
