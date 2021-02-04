const sql ='select 	TOP 1	' +
'	STORE_ID as [storeinfo.ID],	a.KID as [storeinfo.KID],' +
'	VERSION_ID as [storeinfo.HOLIDAY_SETTING],' +
'	IS_PUBLISH_MAIN_EQUIPMENT as [storeinfo.IS_PUBLISH_MAIN_EQUIPMENT], ' +
'	FORMAT([STORE_OPEN], N\'hh\\:mm\') as [storeinfo.storeOpen],	' +
'	FORMAT([STORE_CLOSE], N\'hh\\:mm\') as [storeinfo.storeClose],	' +
'	CASE WHEN [IS_PUBLISH_STATUS] = 1 THEN 1 ' +
'	ELSE 0 END as [storeinfo.isPublishStatus],	' +
'	CONVERT(int, IS_PUBLISH_STATUS) as [storeinfo.isPublishStatus2],	' +

'	( select 		' +
'		mme.MAIN_EQUIPMENT_NAME,' +
'		mme.IS_NUMBER,		' +
'		mme.DISPLAY_ORDER ,		' +
'		tme.EQUIPMENT_NUMBER,		' +
'		CASE WHEN tme.KID is null THEN 0 ELSE 1 END AS is_check	' +
'	  from [dbo].[M_CODE_MAIN_EQUIPMENT] as mme	' +
'	  left join [dbo].[M_STORE_WEB_MAIN_EQUIPMENTS] as tme 	' +
'	  on mme.MAIN_EQUIPMENT_CODE = tme.MAIN_EQUIPMENT	' +
'	  and tme.KID=a.KID FOR JSON PATH' +
'	) as [MAIN_EQUIPMENTS] ,' +
'	( select 		' +
'	  row_number() over(order by tme.CREATED_AT) as pictureIndex ,' +
'	  tme.ORIGINAL_PICTURE_PATH,' +
'	  \'店舗画像説明\' as PICTURE_INFO	' +
'	  from  [dbo].[M_STORE_WEB_PICTURES] as tme 	' +
'	  where tme.KID=a.KID FOR JSON PATH' +
'	) as [store_web_pictures] ,' +

'	( SELECT  ' +
'	   mc.CHARGE_DEVICE_TYPE_NAME as [deviceTypeName]' +
'	   ,CASE WHEN mc.CHARGE_DEVICE_TYPE_NAME = \'洗濯乾燥機\' THEN 1' +
'	   WHEN mc.CHARGE_DEVICE_TYPE_NAME = \'乾燥機\' THEN 2' +
'	   WHEN mc.CHARGE_DEVICE_TYPE_NAME = \'洗濯機\' THEN 3' +
'	   WHEN mc.CHARGE_DEVICE_TYPE_NAME = \'その他\' THEN 4' +
'	   ELSE 9 END as deviceTypeIndex' +
'	 	,deviceInfos.[CHARGE_DEVICE_NAME] as [chargeDeviceName]' +
'   ,DENSE_RANK() OVER( PARTITION BY ' +
'      mc.CHARGE_DEVICE_TYPE_NAME ORDER BY deviceInfos.CHARGE_DEVICE_ID' +
'   ) as deviceInfosIndex' +
'	 	,chargeInfos.COURSE_INFO as [couseInfo]' +
'	  ,chargeInfos.TIME_INFO as [timeInfo]' +
'	  ,chargeInfos.CHARGE_INFO as [chargeInfo]' +
'   ,row_number() OVER(PARTITION BY ' +
'   chargeInfos.[CHARGE_DEVICE_ID] ORDER BY chargeInfos.CHARGE_INFO_ID ' +
'   ) as chargeInfosIndex ' +
'  FROM [tempo].[dbo].[T_STORE_WEB_CHARGE_DEVICE_INFOS] as [deviceInfos]' +
'  inner join [tempo].[dbo].[T_STORE_WEB_CHARGE_INFOS] as [chargeInfos]' +
'  on deviceInfos.[CHARGE_DEVICE_ID] = chargeInfos.[CHARGE_DEVICE_ID]' +
'  and deviceInfos.KID=a.KID' +
'  inner join [M_CODE_CHARGE_DEVICE_TYPE] as mc' +
'  on deviceInfos.[CHARGE_DEVICE_TYPE] = mc.[CHARGE_DEVICE_TYPE_code]' +
'  order by deviceTypeIndex,deviceInfosIndex,chargeInfosIndex' +
'  FOR JSON AUTO' +
'  ) as [storeWebChargeInfos]' +
'	,[BARGAIN_INFO] as [storeWebBargainInfo.bargainInfo]' +
' from [dbo].[M_STORE_WEB_INFOS] as a ' +
' where a.STORE_ID = @id and a.CREATE_TYPE =2 and a.is_publish =1 ' +
' order by a.KID desc	FOR JSON PATH ;';
// , INCLUDE_NULL_VALUES NULL表示オプション
exports.dbConnect =  function(id) {
  return new Promise((resolve, reject) => {
    let result = '';
    // ... some callback nesting for connection and request
    const tedious = require('../node_modules/tedious');
    const TYPES = require('tedious').TYPES;
    const connection = new tedious.Connection({
      server: 'localhost',
      authentication: {
        type: 'default',
        options: {
          userName: 'read',
          password: 'heaven0711'
        },
        database: 'tempo'
      }
    });

    connection.on('connect', (err) => {
      if (err){
        reject(err);
      }
      console.log('connection.on');
      const request = new tedious.Request(sql	, (err, row) => {
        if (err) {
          console.log('reject');
          reject(err);
        } else {
          if (!row) {
            resolve(row);
          } else {
            resolve(result);
          }
        }
        console.log('connection.close');
        connection.close();
      });

      request.addParameter('id', TYPES.VarChar, id);

      request.on('row', function (columns) {
        console.log('request.on(row,');
        columns.forEach(function (column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            result+= column.value;
            //console.log(result);
          }
        });
      });
      connection.execSql(request);
    });
  });
};
