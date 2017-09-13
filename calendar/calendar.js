var months = ["JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var selectedMonth = new Date().getMonth();
var selectedYear = new Date().getFullYear();

var alarms = [];

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(month, year) {
    return new Date(year, month, 1).getDay();
}

document.body.onload = () => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            let alarmList = JSON.parse(request.responseText).alarms;
            for(let i = 0; i < alarmList.length; i++) {
                let alarmDate = new Date(alarmList[i].timestamp);
                if(!alarms[alarmDate.getFullYear()]){ 
                    alarms[alarmDate.getFullYear()] = [];
                }
                if(!alarms[alarmDate.getFullYear()][alarmDate.getMonth()]) {
                    alarms[alarmDate.getFullYear()][alarmDate.getMonth()] = [];
                }
                if(!alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()]) {
                    alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()] = [];
                }
                alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()].push(alarmList[i]);
            }

            generateCalendar();            
        }
    };
    request.open("GET", "../testdata.json"/* Enter API URL Here */, true);
    request.send();
};

function nextMonth() {
    selectedMonth++;
    if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear++;
    }
    document.getElementById("selectedMonth").textContent = months[selectedMonth] + " " + selectedYear;
    generateCalendar();
}

function prevMonth() {
    selectedMonth--;
    if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear--;
    }
    document.getElementById("selectedMonth").textContent = months[selectedMonth] + " " + selectedYear;
    generateCalendar();
}

function generateCalendar() {
    var cal = document.getElementById("monthCalendar");
    cal.innerHTML = "";
    let date = 1;
    for (let week = 0; week < (getDaysInMonth(selectedMonth, selectedYear) + getFirstDayOfWeek(selectedMonth, selectedYear)) / 7; week++) {
        let tr = document.createElement("tr");
        for (let day = 0; day < 7; day++) {
            if (week === 0 && day === 0) {
                for (let i = 0; i < getFirstDayOfWeek(selectedMonth, selectedYear); i++) {
                    let td = document.createElement("td");
                    tr.appendChild(td);
                }
                day = getFirstDayOfWeek(selectedMonth, selectedYear);
            }
            let td = document.createElement("td");
            td.style.textAlign = "center";
            if (date <= getDaysInMonth(selectedMonth, selectedYear)) {
                td.textContent = date;
                if (alarms && alarms[selectedYear] && alarms[selectedYear][selectedMonth] && alarms[selectedYear][selectedMonth][date]) {
                    let r = 255;
                    let g = 240;
                    let b = 240;
                    let count = alarms[selectedYear][selectedMonth][date].length;
                    let hoverText = `${count} alarm${count === 1 ? '' : 's'}\n`;
                    td.style.backgroundColor = `rgb(${r}, ${g - 40 * count}, ${b - 40 * count})`;
                    td.style.fontWeight = "bold";
                    for(let i = 0; i < count; i++) {
                        let alarm = alarms[selectedYear][selectedMonth][date][i];
                        hoverText += `${new Date(alarm.timestamp)}: ${alarm.beepCount} beep${alarm.beepCount === 1 ? '' : 's'}\n`;
                    }
                    td.title = hoverText;
                }
                date++;
            }
            tr.appendChild(td);
        }
        cal.appendChild(tr);
    }
}
