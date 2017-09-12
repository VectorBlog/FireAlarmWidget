var months = ["JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var selectedMonth = 8;

document.body.onload = () => {
    generateCalendar();
}

function nextMonth() {
    selectedMonth++;
    if (selectedMonth > 11) {
        selectedMonth = 0;
    }
    document.getElementById("selectedMonth").textContent = months[selectedMonth];
    generateCalendar();
}

function prevMonth() {
    selectedMonth--;
    if (selectedMonth < 0) {
        selectedMonth = 11;
    }
    document.getElementById("selectedMonth").textContent = months[selectedMonth];
    generateCalendar();
}

function generateCalendar() {
    var cal = document.getElementById("monthCalendar");
    cal.innerHTML = "";
    let date = 1;
    for (let week = 0; week < days[selectedMonth] / 7; week++) {
        let tr = document.createElement("tr");
        for (let day = 0; day < 7; day++) {
            let td = document.createElement("td");
            td.style.textAlign = "center";
            if (date <= days[selectedMonth]) {
                td.textContent = date++;
                if (Math.random() < 0.05) {
                    td.style.backgroundColor = "#F84738";
                    td.style.fontWeight = "bold";
                    td.title = "2 alarms";
                }
            }
            tr.appendChild(td);
        }
        cal.appendChild(tr);
    }
}
