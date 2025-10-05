let elementCounter = 0;

function nowTime() {
    const realTime = new Date();
    const hour = realTime.getHours();
    const minutes = realTime.getMinutes();
    //ここで数字が一桁だったら強制2桁にする
    document.querySelector('#real-time').innerHTML = ("0" + hour).slice(-2) + ":" + ("0" + minutes).slice(-2);
}
setInterval('nowTime()', 1000);

//ページが読み込まれたときのみ動かす
function setNowTime() {
    const realTime = new Date();
    const hour = realTime.getHours();
    const minutes = realTime.getMinutes();
    const set_startTime = document.querySelector('#start-time');
    set_startTime.value = ("0" + hour).slice(-2) + ":" + ("0" + minutes).slice(-2);
}

//+ボタンが押されたら
function createBreakTime() {
    if (elementCounter < 99) {
        const div_b = document.querySelector("#break-time-set");
        const div_group = document.createElement("div");
        div_group.id = "div-b-group" + ("0" + elementCounter).slice(-2);

        //休憩区分選択
        const select_b = document.createElement("select");
        select_b.classList.add("break-time-id");
        const opt_b_1 = document.createElement("option");
        opt_b_1.text = "固定休憩";
        opt_b_1.value = "1";
        opt_b_1.selected;
        select_b.appendChild(opt_b_1);
        const opt_b_2 = document.createElement("option");
        opt_b_2.text = "中断など";
        opt_b_2.value = "2";
        select_b.appendChild(opt_b_2);
        div_group.appendChild(select_b);

        //休憩時間選択
        const break_time_st = document.createElement("input");
        break_time_st.type = "time";
        break_time_st.classList.add("break-time-start");
        break_time_st.value = "00:00";
        const break_time_end = document.createElement("input");
        break_time_end.type = "time";
        break_time_end.classList.add("break-time-end");
        break_time_end.value = "00:00";
        div_group.appendChild(break_time_st);
        const text1 = document.createTextNode("～");
        div_group.appendChild(text1);
        div_group.appendChild(break_time_end);

        const br = document.createElement("br");
        div_group.appendChild(br);
        div_b.appendChild(div_group);
        div_b.scrollTop = div_b.scrollHeight;
        elementCounter++;
    }
    else {
        alert("のワの ＜ 件数が多いですよ！休みすぎです！");
    }
}

//-ボタンが押されたら
function deleteBreakTime() {
    const div_b = document.querySelector("#break-time-set");
    if (div_b.hasChildNodes()) {
        div_b.removeChild(div_b.lastChild);
        div_b.scrollTop = div_b.scrollHeight;
        elementCounter--;
    }
}

//定時を確認するボタンが押されたら
function checkRegularTime() {
    //勤務開始時刻の取得
    const start_time=document.querySelector("#start-time").value;
    let sum_time=addTime(start_time,"00:00","0");
    //休憩時間の取得
    for(let i=0;i<elementCounter;i++){
        const breakTime=document.querySelector("#div-b-group"+("0"+i).slice(-2));
        const st_br_time=breakTime.querySelector(".break-time-start").value;
        const end_br_time=breakTime.querySelector(".break-time-end").value;
        sum_time=addTime(("0"+sum_time.hour).slice(-2)+":"+("0"+sum_time.min).slice(-2),
            subTime(st_br_time,end_br_time),
            sum_time.day);
    }
    //所定労働時間の取得
    const schedule_working_hours=document.querySelector("#schedule-working-hours").value;
    const schedule_working_min=document.querySelector("#schedule-working-min").value;
    sum_time=addTime(("0"+sum_time.hour).slice(-2)+":"+("0"+sum_time.min).slice(-2),
            ("0"+schedule_working_hours).slice(-2)+":"+("0"+schedule_working_min).slice(-2),
            sum_time.day);
    const div_r = document.querySelector("#regular-time-show");
    div_r.hidden = false;
    const h3_r=document.querySelector("#real-time-output");
    h3_r.innerHTML=sum_time.day+"日後の"+("0"+sum_time.hour).slice(-2)+":"+("0"+sum_time.min).slice(-2);
}

//時間計算用
function addTime(startTime,endTime,day){
    const st_hours=parseInt(startTime.slice(0,2));
    const end_hours=parseInt(endTime.slice(0,2));
    const st_min=parseInt(startTime.slice(-2));
    const end_min=parseInt(endTime.slice(-2));
    console.log(st_hours,end_hours);
    const sum_data={
        day:parseInt(day),
        hour:st_hours+end_hours,
        min:st_min+end_min,
    }
    if(sum_data.min!=0){
        sum_data.hour+=Math.floor((sum_data.min)/60);
        sum_data.min-=Math.floor((sum_data.min)/60)*60;
    }
    if(sum_data.hour!=0){
        sum_data.day+=Math.floor((sum_data.hour)/24);
        sum_data.hour-=Math.floor((sum_data.hour)/24)*24;
    }
    return sum_data;
}

//休憩時間計算
function subTime(startTime,endTime){
    const st_hours=parseInt(startTime.slice(0,2));
    const end_hours=parseInt(endTime.slice(0,2));
    const st_min=parseInt(startTime.slice(-2));
    const end_min=parseInt(endTime.slice(-2));
    const sub_data={
        hour:st_hours>end_hours?(24-st_hours)+end_hours:end_hours-st_hours,
        min:st_min>end_min?(60-st_min)+end_min:end_min-st_min,
    };
    return ("0"+sub_data.hour).slice(-2)+":"+("0"+sub_data.min).slice(-2);
}