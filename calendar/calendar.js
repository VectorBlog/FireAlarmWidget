var months = ["JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var selectedMonth = new Date().getMonth();
var selectedYear = new Date().getFullYear();

var mostRecentAlarm;
var mostRecentAlarmCell;

var tintInterval;

var alarms = [];
var dates = [];
var differences = [];

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(month, year) {
    return new Date(year, month, 1).getDay();
}

document.body.onload = () => {
    getData(true);
    setInterval(getData, 300000);
};

function getData(first) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {

            alarms = [];
            dates = [];
            differences = [];
            mostRecentAlarm = undefined;
            mostRecentAlarmCell = undefined;
            tintInterval = undefined;

            let alarmList = JSON.parse(request.responseText);
            for (let i = 0; i < alarmList.length; i++) {
                let alarmDate = new Date(alarmList[i].timestamp);
                dates.push(alarmDate);
                if (alarmDate > (mostRecentAlarm || new Date(0))) {
                    mostRecentAlarm = alarmDate;
                }
                if (!alarms[alarmDate.getFullYear()]) {
                    alarms[alarmDate.getFullYear()] = [];
                }
                if (!alarms[alarmDate.getFullYear()][alarmDate.getMonth()]) {
                    alarms[alarmDate.getFullYear()][alarmDate.getMonth()] = [];
                }
                if (!alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()]) {
                    alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()] = [];
                }
                alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()].push(alarmList[i]);
                alarms[alarmDate.getFullYear()][alarmDate.getMonth()][alarmDate.getDate()].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            }

            if (first) lastAlarm();            
            generateCalendar();
            longestTime();
            countUpTimer();
            setInterval(countUpTimer, 1000);
        }
    };
    request.open("GET", "https://associationfireaccountability.azurewebsites.net/api/frontend/location/1/batches", true);
    request.send();
}

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

function today() {
    selectedMonth = new Date().getMonth();
    selectedYear = new Date().getFullYear();
    document.getElementById("selectedMonth").textContent = months[selectedMonth] + " " + selectedYear;
    generateCalendar();
}

function lastAlarm() {
    selectedMonth = mostRecentAlarm.getMonth();
    selectedYear = mostRecentAlarm.getFullYear();
    document.getElementById("selectedMonth").textContent = months[selectedMonth] + " " + selectedYear;
    generateCalendar();
    alarmDetails(mostRecentAlarm.getFullYear(), mostRecentAlarm.getMonth(), mostRecentAlarm.getDate());
    let background = mostRecentAlarmCell.style.backgroundColor;
    let originalColor = background.match(/\d+/g)[1];
    let shade = 40;
    mostRecentAlarmCell.style.backgroundColor = `rgb(255, ${shade}, ${shade})`;
    clearInterval(tintInterval);
    tintInterval = setInterval(() => {
        shade++;
        if (shade > originalColor) {
            clearInterval(tintInterval);
            mostRecentAlarmCell.style.backgroundColor = background;
            return;
        }
        mostRecentAlarmCell.style.backgroundColor = `rgb(255, ${shade}, ${shade})`;
    }, 5);
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
                if (selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear() && date == new Date().getDate()) {
                    td.style.color = "red";
                }
                if (alarms && alarms[selectedYear] && alarms[selectedYear][selectedMonth] && alarms[selectedYear][selectedMonth][date]) {
                    let r = 255;
                    let g = 240;
                    let b = 240;
                    let count = alarms[selectedYear][selectedMonth][date].length;
                    td.style.backgroundColor = `rgb(${r}, ${g - 40 * count}, ${b - 40 * count})`;
                    let a = document.createElement("a");
                    a.dataset.month = selectedMonth;
                    a.dataset.year = selectedYear;
                    a.dataset.date = date;
                    a.classList.add("alarm-date");
                    a.onclick = function () { alarmDetails(this.dataset.year, this.dataset.month, this.dataset.date) };
                    td.textContent = "";
                    a.textContent = date;
                    a.title = `${count} alarm${count === 1 ? '' : 's'}`;
                    td.appendChild(a);
                    mostRecentAlarmCell = td;
                }
                date++;
            }
            tr.appendChild(td);
        }
        cal.appendChild(tr);
    }
}

function createDetails(timestamp, beepCount, number) {
    let list = document.getElementById("detailsList");
    let title = document.createElement("p");
    title.classList.add("alarm-title");
    title.textContent = `Alarm ${number}`;
    list.appendChild(title);
    let timeLabel = document.createElement("p");
    timeLabel.classList.add("label");
    timeLabel.textContent = "time";
    list.appendChild(timeLabel);
    let time = document.createElement("p");
    time.classList.add("details");

    let pm = false;
    if (timestamp.getHours() > 12) pm = true;
    let timeString = `${timestamp.getHours() % 12 === 0 ? 12 : timestamp.getHours() % 12}:${pad(timestamp.getMinutes())}:${pad(timestamp.getSeconds())} ${(pm ? "PM" : "AM")}`;

    time.textContent = timeString;
    time.title = timestamp;
    list.appendChild(time);
    let beepsLabel = document.createElement("p");
    beepsLabel.classList.add("label");
    beepsLabel.textContent = "beeps";
    list.appendChild(beepsLabel);
    let beeps = document.createElement("p");
    beeps.classList.add("details");
    beeps.textContent = beepCount;
    list.appendChild(beeps);
}

function alarmDetails(y, m, d) {
    document.getElementById("detailsList").innerHTML = "";
    document.getElementById("detailsHeader").textContent = `${months[m]} ${d} ${y}`;
    for (let i = alarms[y][m][d].length; i > 0; i--) {
        let alarm = alarms[y][m][d][i - 1];
        createDetails(new Date(alarm.timestamp), alarm.beepCount, alarms[y][m][d].length - i + 1);
    }
}

function countUpTimer() {
    let timer = document.getElementById("countUpTimer");
    let timespan = new TimeSpan(new Date(), mostRecentAlarm);
    let text = timespan.toLongString(true).split(' ');
    timer.innerHTML = "";
    let header = document.createElement("p");
    header.textContent = "TIME SINCE LAST ALARM";
    header.classList.add("heading");
    header.classList.add("half-width");
    timer.appendChild(header);
    for (let i = 0; i < text.length; i++) {
        let p = document.createElement("p");
        p.textContent = text[i];
        p.classList.add(i % 2 === 0 ? "number" : "label");
        timer.appendChild(p);
    }
    header = document.createElement("p");
    header.classList.add("heading");
    timer.appendChild(header);
}

function longestTime() {
    dates.sort((a, b) => b.valueOf() - a.valueOf());
    for (let i = 0; i < dates.length - 1; i++) {
        differences.push(new TimeSpan(dates[i], dates[i + 1]));
    }
    differences.sort((a, b) => b.totalMilliseconds - a.totalMilliseconds);
    let timer = document.getElementById("longestTime");
    timer.innerHTML = "";

    let header = document.createElement("p");
    header.textContent = "LONGEST TIME BETWEEN ALARMS";
    header.classList.add("heading");
    header.classList.add("half-width");
    timer.appendChild(header);
    let text = differences[0].toLongString(true).split(' ');
    for (let i = 0; i < text.length; i++) {
        let p = document.createElement("p");
        p.textContent = text[i];
        p.classList.add(i % 2 === 0 ? "number" : "label");
        timer.appendChild(p);
    }

    timer = document.getElementById("shortestTime");
    timer.innerHTML = "";
    header = document.createElement("p");
    header.textContent = "SHORTEST TIME BETWEEN ALARMS";
    header.classList.add("heading");
    header.classList.add("half-width");
    timer.appendChild(header);
    text = differences[differences.length - 1].toLongString(true).split(' ');
    for (let i = 0; i < text.length; i++) {
        let p = document.createElement("p");
        p.textContent = text[i];
        p.classList.add(i % 2 === 0 ? "number" : "label");
        timer.appendChild(p);
    }
}
