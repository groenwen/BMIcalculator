const heightInput = document.querySelector('.heightInput');
const weightInput = document.querySelector('.weightInput');
const resultArea = document.querySelector('#resultArea');
const sendBtn = document.querySelector('.calculate-send');
const result = document.querySelector('.resultContent');
const refresh = document.querySelector('.refresh');
const deleteAll = document.querySelector('.deleteAll');
const history = document.querySelector('.history');
let dataAry = JSON.parse(localStorage.getItem('BMIRecord')) || [];
let time = new Date();
//監聽
resultArea.addEventListener('click', BMIcalculator, false);
resultArea.addEventListener('click', refreshFun, false);
deleteAll.addEventListener('click', deleteAllData, false);
history.addEventListener('click', deleteData, false);
updateData();

//計算BMI
function BMIcalculator(e){
    e.preventDefault();
    let heightCM = parseInt(heightInput.value);
    let heightM = heightCM / 100;
    let weight = parseInt(weightInput.value);
    let BMI = weight / ( heightM * heightM);
    let obj = {};
    if (e.target.className !== 'calculate-send'){return};
    if ( !(isNaN(BMI))){
        BMIStatus(BMI, obj);
        showResult();
    } else{ return; };
    obj.weight = weight;
    obj.heightCM = heightCM;
    obj.BMI = (Math.round (BMI * 100) / 100).toFixed(2);
    obj.date = `${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear()}`
    result.innerHTML = 
    `<div class="${obj.statusColor}">
        <div class="result">
            <h2 class="result-BMI">${obj.BMI}<br><span>BMI</span></h2>
            <a href="#" class="refresh"></a>
            <h2 class="result-status">
            ${obj.status}
            </h2>
        </div>
    </div>`;
    dataAry.push(obj);
    localStorage.setItem('BMIRecord', JSON.stringify(dataAry));
    updateData();
    LatestRecord();
}
//BMI 狀態管理
function BMIStatus(BMI, obj){
    switch (true){
        case BMI < 18.5:
            obj.status = '過輕';
            obj.statusColor = 'underweight';
            return obj;
        case 18.5 <= BMI && BMI < 24:
            obj.status = '理想';
            obj.statusColor = 'healthy';
            return obj;
        case 24 <= BMI && BMI < 27:
            obj.status = '過重';
            obj.statusColor = 'overweight';
            return obj;
        case 27 <= BMI && BMI < 30:
            obj.status = '輕度肥胖';
            obj.statusColor = 'obese';
            return obj;
        case 30 <= BMI && BMI < 35:
            obj.status = '中度肥胖';
            obj.statusColor = 'obese';
            return obj;
        case BMI >= 35:
            obj.status = '重度肥胖';
            obj.statusColor = 'extremely-obese';
            return obj;
    }
}
//顯示結果 ( 按鈕與結果 切換)
function showResult(){
    sendBtn.style.opacity = '0';
    sendBtn.style.zIndex = '1';
    result.style.opacity = '1';
    result.style.zIndex = '2';
}

//重新計算按鈕 (結果與按鈕 切換)
function refreshFun(e){
    e.preventDefault();
    if (e.target.className !== 'refresh'){return};
    sendBtn.style.opacity = '1';
    sendBtn.style.zIndex = '2';
    result.style.opacity = '0';
    result.style.zIndex = '1';
    heightInput.value = '';
    weightInput.value = '';
}
//一筆以上才顯示[全部刪除]按鈕
function showDeleteAllBtn(){
    if (dataAry.length > 1 ){
        document.querySelector('.deleteAll').style.display = 'block';
    } else {
        document.querySelector('.deleteAll').style.display = 'none';
    }
}
//[全部刪除]- 警告及刪除
function deleteAllData(e){
    e.preventDefault();
    let open = confirm('確定刪除所有資料?');
    if (open === true){
        let len = dataAry.length;
        dataAry.splice(0, len);    
    } else {
        return;
    }
    localStorage.setItem('BMIRecord', JSON.stringify(dataAry));
    updateData();
}
//[單筆刪除]- 警告及刪除
function deleteData(e){
    e.preventDefault();
    let open = confirm('確定刪除此筆資料?');
    if (e.target.nodeName !== 'I'){return;};
    if (open === true){
        let num = e.target.dataset.num;
        dataAry.splice(num, 1);    
    } else {
        return;
    }
    localStorage.setItem('BMIRecord', JSON.stringify(dataAry));
    updateData()
}
// 最新一筆紀錄
function LatestRecord(){
    const latestHistory = document.querySelector('.history>li');
    for (let i=0; i < 2; i++){
        (function(x){
            window.setTimeout(function(){
                switch (x){
                    case 0:
                        latestHistory.style.backgroundColor = "#FCEFCF";
                        latestHistory.style.transition = "background-color 1s";
                        break;
                    case 1:
                        latestHistory.style.backgroundColor = "#FFFFFF";
                        latestHistory.style.transition = "background-color 1s";
                        break;
                }
            },1000 * x);
        })(i);
    }
}
//更新 BMI紀錄
function updateData(){
    const historyList = document.querySelector('.history');
    let len = dataAry.length;
    let str = '';
    let times = 0;
    for ( let i = len - 1 ; 0 <= i ; i-- ){
        str += `<li>
            <div class="status ${dataAry[i].statusColor}">
                <div class="status-color">&nbsp;
                </div>
                <p class="status-text">${dataAry[i].status}</p>
            </div>
            <div class="history-record">
                <div class="history-inner">
                    <div class="record">
                        <p class="record-title">BMI</p>
                        <p class="record-data">${dataAry[i].BMI}</p>
                    </div>
                    <div class="record">
                        <p class="record-title">weight</p>
                        <p class="record-data">${dataAry[i].weight}kg</p>
                    </div>
                    <div class="record">
                        <p class="record-title">height</p>
                        <p class="record-data">${dataAry[i].heightCM}cm</p>
                    </div>
                </div>
                <div class="history-time">${dataAry[i].date}</div>
                <a href="#" class="history-delete" data-num="${i}"><i class="fas fa-trash-alt"></i></a>    
            </div>
        </li>`
        times += 1;
        if ( times === 10 ){
            break;
        };
    }
    historyList.innerHTML = str;
    showDeleteAllBtn();
}