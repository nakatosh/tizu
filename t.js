var db;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
    
    if (indexedDB) {
        // データベースを削除したい場合はコメントを外します。
        //indexedDB.deleteDatabase("mydb");
        var openRequest = indexedDB.open("CSVMAPdb", 1.0);
        openRequest.onupgradeneeded = function(event) {
        // データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
        db = event.target.result;
        var store = db.createObjectStore("mystore", { keyPath: "mykey"});
            store.createIndex("myvalueIndex", "myvalue");
            }                
            openRequest.onsuccess = function(event) {
            db = event.target.result;
        }
        } else {
        window.alert("このブラウザではIndexed DataBase API は使えません。");
        }

//マーカークリックイベント
function markerClick(e){ 
  ck();
  //マーカーから値をもらう
  NO.value = e.sourceTarget.options.customID;            
  LAT.value = e.latlng.lat;
  LNG.value = e.latlng.lng;
  ima();
  map.setView([e.latlng.lat, e.latlng.lng]);

  //DBから値をもらう
  getValue(); 

}


 function getValue() {
  var key =  Number(document.getElementById("NO").value);   
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");                  
  var request = store.get(key);

request.onsuccess = function (event) {
  var result = event.target.result;
  if (result) {
    document.getElementById("GCD").value   = result.mv_1 || "";
    document.getElementById("biko").value  = result.mv_4 || "";
    document.getElementById("kflg").value  = result.mv_5 || "";
    document.getElementById("rank").value  = result.mv_6 || "";
    document.getElementById("setub").value = result.mv_7 || "";
    document.getElementById("suryo").value = result.mv_8 || "";
    document.getElementById("noww").value  = result.mv_10 || "";
  } else {
    console.log("データが見つかりませんでした");
  }
};
}

//入力画面ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//数量ボタンーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function suu0() {
  document.getElementById("suryo").value = 0;
}
function suuPlus(value) {
  document.getElementById("suryo").value =document.getElementById("suryo").value +++ value;
}
//グーグルマップを開くーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function gmap() {
  if (document.getElementById("NO").value>0){} else {alert('マーカーを選択してから押すと、グーグルマップで現在地からの経路が表示されます。');return;}
  var glat = document.getElementById("LAT").value;
    var glng = document.getElementById("LNG").value;
  window.open("https://www.google.com/maps?q=" + glat + "," + glng);
  }



//登録  ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function setValue() {
  const g = id => document.getElementById(id), 
  key = +g("NO").value;
  if (key <= 0) return alert('マーカーをクリックしてから登録してください!!');
  const data = {
    mykey: key, 
    mv_1: +g("GCD").value,
    mv_2: +g("LAT").value, 
    mv_3: +g("LNG").value,
    mv_4: g("biko").value, 
    mv_5: 1,
    mv_6: g("rank").value,  
    mv_7: +g("setub").value, 
    mv_8: +g("suryo").value,
    mv_9: 0,
    mv_10: g("noww").value
  };
 
  db.transaction(["mystore"], "readwrite").objectStore("mystore").put(data).onsuccess = () =>
    console.log("保存成功:", key);

	MAK(1);		
	resetInputs(); 	 // 入力欄リセット（外部関数呼び出し）
 	ck0();	//再マーク

  // 保存成功時の処理（必要なら追加）
  request.onsuccess = function () {
    console.log("データの保存に成功しました:", key);
  };
}

//キャンセルーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function notValue() {
   const g = id => document.getElementById(id), key = +g("NO").value;
  if (key <= 0) return alert('マーカーをクリックしてから登録してください!!');
  const data = {
    mykey: key, 
    mv_1: +g("GCD").value,
    mv_2: +g("LAT").value, 
    mv_3: +g("LNG").value,
    mv_4: g("biko").value, 
    mv_5: +g("kflg").value,
    mv_6: g("rank").value,  
    mv_7: +g("setub").value, 
    mv_8: +g("suryo").value,
    mv_9: 0,
    mv_10: g("noww").value

  };
 //db登録
  db.transaction(["mystore"], "readwrite").objectStore("mystore").put(data).onsuccess = () =>
    console.log("保存成功:", key);

  MAK(data.mv_5); //マーカ一の色一個更新
  resetInputs();  // 入力欄リセット（外部関数呼び出し）
  ck0();//再マーク

  // 保存成功時の処理（必要なら追加）
  request.onsuccess = function () {
    console.log("データの保存に成功しました:", key);
  };
}

// 入力欄をリセットする関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function resetInputs() {
  const ids = ["NO", "GCD", "kflg", "biko", "rank", "setub", "suryo", "LAT", "LNG", "noww"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}



// LDBからマーカーーーーーーーーーーーーーーーーーーーーーーーー
function MAK(flg) {
var key = document.getElementById("NO").value;
var LAT = Number(document.getElementById("LAT").value);
var LNG = Number(document.getElementById("LNG").value);
// 既存マーカーの削除
KAN.eachLayer((layer)=> {if (key === layer.options.customID) {KAN.removeLayer(layer);}});
moji.eachLayer((layer)=> {if (key === layer.options.customID) {moji.removeLayer(layer);}});
ho.eachLayer((layer)=> {if (key === layer.options.customID) {ho.removeLayer(layer);}});
MI.eachLayer((layer)=> {if (key === layer.options.customID) {MI.removeLayer(layer);}});
//新しいマーカーの追加
switch (flg) {
case 1:createMarker(KAN,LAT,LNG,'#fb1bceff',key);break;
case 0:createMarker(MI,LAT,LNG,'#fdfdfd',key);break;
case 3:createMarker(ho,LAT, LNG,'#047104ff',key);break;
case 4:createMarker(ho,LAT, LNG,'#14a9ceff',key);break;
default:createMarker(MI,LAT, LNG,'#fdfdfd',key);break;
}          

}

// サークルマーカーを書くーーーーーーーーーーーーーーーーーーーーーーーー
function createMarker(layer, lat, lng, color, key) {
  layer.addLayer(
    L.circleMarker([lat, lng], {
      color:'#7a797aff', weight: 2, fillColor: color, fillOpacity: 1, radius: 10, customID: key
    }).on('click', function(e) { markerClick(e); })
  );
}

// LDBからマーカーーーーーーーーーーーーーーーーーーーーーーーー
function MAKall() {
  return new Promise(function(resolve) {
    var transaction = db.transaction(["mystore"], "readwrite");
    var store = transaction.objectStore("mystore");
    var request = store.openCursor();

    KAN.clearLayers();
    ho.clearLayers();
    MI.clearLayers();

    request.onsuccess = function (event) {
      if(event.target.result == null) {
        resolve();
        return;
      }

      var cursor = event.target.result;
      var data = cursor.value;

  var divIcon3 = L.divIcon({html: String(data.mykey).slice(-4),  className: 'divicon2',  iconSize: [0,0],  iconAnchor: [-15,15]});

//ステータスで色を変えたい
switch (data.mv_5) {
	case 1: addMarkerToLayer(KAN,data,'#fb1bceff',divIcon3);break;
	case 0: addMarkerToLayer(MI,data,'#fdfdfd',divIcon3);break;
	case 3: addMarkerToLayer(ho,data,'#047104ff',divIcon3);break;
	case 4: addMarkerToLayer(ho,data,'#14a9ceff',divIcon3);break;
	default: addMarkerToLayer(MI,data,'#fdfdfd',divIcon3);
}   
	cursor.continue();
};
});
}

//ステータスで色を変えたいーーーーーーーーーーーーーーーーーーーーーーーー
function addMarkerToLayer(layer, data, color, divIcon3) {
const lat = parseFloat(data.mv_2);
const lng = parseFloat(data.mv_3);
const kno =  +document.getElementById("PullDownList").value;
const bounds = map.getBounds(); // 現在の地図範囲
// 通常のマーカーは kno が null または一致する場合のみ追加
if (!kno || kno === data.mv_1) {layer.addLayer(
   	  		L.circleMarker([lat, lng], {
			color: '#7a797aff', weight: 2, fillColor: color,  fillOpacity: 1,  radius: 10, customID: data.mykey	}).on('click', function (e) {markerClick(e);
    	 		}
		)
	);
	}

}

// LDBからマーカの文字だけーーーーー
function MAK_text() {
  return new Promise(function(resolve) {
    // IndexedDB から "mystore" ストアを読み込み
    const transaction = db.transaction(["mystore"], "readwrite");
    const store = transaction.objectStore("mystore");
    const request = store.openCursor();

    // 既存マーカーの customID を記録するためのセットを作成
    const existingIDs = new Set();

    // moji レイヤーにすでに追加されているマーカーの customID を収集
    // この処理はマーカーを消さずに、重複を防ぐために必要
    moji.eachLayer(layer => {
      if (layer.options && layer.options.customID) {
        existingIDs.add(layer.options.customID);
      }
    });

    // 地図の現在の表示範囲とズームレベルを取得
    const bounds = map.getBounds();
    const kno = +document.getElementById("PullDownList").value;

    // IndexedDB のカーソル処理開始
    request.onsuccess = function(event) {
      const cursor = event.target.result;

      // データがもうない場合は Promise を解決して終了
      if (!cursor) {
        resolve();
        return;
      }

      const data = cursor.value;
      const lat = parseFloat(data.mv_2); // 緯度
      const lng = parseFloat(data.mv_3); // 経度

      // ズームが17より大きく、地図範囲内にある場合のみ処理
      if (map.getZoom() > 17 && bounds.contains([lat, lng])) {

        // PullDownList の選択値と一致するか、未選択なら表示対象
        // かつ、すでに表示されていない customID の場合のみ追加
        if ((!kno || kno === data.mv_1) && !existingIDs.has(data.mykey)) {

          // 表示するテキストアイコンを作成（mykey の末尾4文字を表示）
          const divIcon3 = L.divIcon({
            html: String(data.mykey).slice(-4),
            className: 'divicon2',
            iconSize: [0, 0],
            iconAnchor: [-15, 15]
          });

          // マーカーを作成し、customID を設定
          const marker = L.marker([lat, lng], {
            icon: divIcon3,
            customID: data.mykey
          });

          // moji レイヤーにマーカーを追加（既存と重複しない）
          moji.addLayer(marker);
        }
      }

      // 次のデータへ進む
      cursor.continue();
    };
  });
}


// LDBから線を引く
function addline() {
return new Promise(function(resolve) {              
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");
  var request = store.openCursor();
  //lineレイヤー削除
  line.clearLayers();
  request.onsuccess = function (event) {
    //リストがなかったら終了  
    if(event.target.result == null) {
    resolve()   
    return;
     }
    var cursor = event.target.result;
    var data = cursor.value;

    if(data.mv_1>0){
   line.addLayer(
       L.polyline([[data.mv_2, data.mv_3]], {color: 'red'})
    );
    } else {
    }
    cursor.continue();
  }
})
}

//マーカーが全部入るイメージ
function zenb(){
map.fitBounds(ho.getBounds());   
};

function ck(){
let element = document.getElementById('pop-up');
element.checked = true;
}
function ck0(){
let element = document.getElementById('pop-up');
element.checked = false;
}

//現在地
function GPS() {
	function success(pos) {
		GLAT.value = pos.coords.latitude;
		GLNG.value = pos.coords.longitude;
	}

  function error() {
		alert('位置情報を取得できませんでした。');
		GLAT.value = 0;
		GLNG.value = 0;
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	  if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
  	}
}

//現在地
function currentWatch() {
	function success(pos) {
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		map.setView([ lat,lng ]);
		// 現在地に表示するマーカー
		if (curMarker) {
			map.removeLayer(curMarker);
		}
		curMarker = L.marker([lat, lng],{icon:myIcon3}).addTo(map);
	}
	function error(err) {
		alert('位置情報を取得できませんでした。');
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
	}
}

function currentWatchReset() {
	if (watch_id > 0) {
		navigator.geolocation.clearWatch(watch_id);
		watch_id = 0;
	}
	if (curMarker) {
		map.removeLayer(curMarker);
		curMarker = null;
	}
}

//待つタイプ
async function mikan(){
  await MAKall();
  await map.fitBounds(ho.getBounds());   
};
async function kanryo(){
    await MAKall();
    await map.fitBounds(KAN.getBounds());   
};
	
//現在時刻
function ima() {
  const D = new Date();
  const year = D.getFullYear();
  const month = D.getMonth() + 1;
  const date = D.getDate();
  const hour = D.getHours();
  const minute = D.getMinutes();
  const second = D.getSeconds();
  noww.value =  year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
}

//フィーダを選択
async function inputChange() {
  await MAKall();
  if (ho.getLayers().length > 0) {
    map.fitBounds(ho.getBounds());
  }
}

