/*eslint-disable */
//当前日期
var currentDate = new Date();

//选中周的最后一天
var weekLastDay = new Date();

//是否接受提前交车
var acceptGetCar = false;

//按天时自定义选择天数范围
var dayDayBegin = 3;
var dayDayEnd = 16;

//按周时自定义选择天数范围
var weekDayBegin = 5;
var weekDayEnd = 25;

//默认的日期
var defaultDay = 10;
//默认的月份
var defaultMonth = '';

//自定义选择月份范围
var monthBegin = 8;
var monthEnd = 10;

//按天选择或是按周选择
var dayChosed = true;
var weekChosed = false;

//是否禁用提交按钮
function disSubmitBtn() {
    var month =  currentDate.getMonth() + 1;

    if (month >= monthBegin && month <= monthEnd) {
        $('#showPara').attr('disabled', true);
    }
}

//监听是否接受提前交车
$('#getCar').on('change', function() {
    acceptGetCar = $(this).prop('checked');
});

//初始生成日历
newCalendar();

//触发默认日期事件
function defaultDaytHandler() {
    $(`[id$=${defaultDay}][onclick*='generateToday']`).click();
}

defaultDaytHandler();

//默认选中第一周
function defaultWeekHandler() {
    $('#dateTable tr .date').first().click();
}

// defaultWeekHandler();

//移除空的日期
function removeEmpty() {
    if ($('#dateTable tr:last-child td').text() == '') {
        $('#dateTable tr:last-child td').remove();
    }
}

removeEmpty();

//日历主体部分
function newCalendar() {
    var month = defaultMonth ? defaultMonth : currentDate.getMonth();
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();
    var thisMonthDay = new Date(year, month, 1);
    var thisMonthFirstDay = thisMonthDay.getDay();
    var thisMonthFirstDate = new Date(year, month, -thisMonthFirstDay);
    generateNav(year, month); //生成导航区域
    generateTable(thisMonthFirstDate); //生成日历主体的日期区域
    currentDate.setYear(year);
    currentDate.setMonth(month);
    return currentDate;
}

//上个月切换按钮监听
var btnLastMonth = $('#lastMonth');
btnLastMonth.on("click", function() {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth(--currentMonth);
    defaultMonth = '';
    newCalendar();
    removeEmpty();
    disSubmitBtn();

    if (dayChosed) {
        defaultDaytHandler();
    } else {
        defaultWeekHandler();
    }
});

//下个月切换按钮监听
var btnNextMonth = $('#nextMonth');
btnNextMonth.on("click", function() {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth(++currentMonth);
    defaultMonth = '';
    newCalendar();
    removeEmpty();
    disSubmitBtn();

    if (dayChosed) {
        defaultDaytHandler();
    } else {
        defaultWeekHandler();
    }
});

//按天或按周选择按钮
var csd = $('.choose-day');
var csw = $('.choose-week');

csd.on('click', function() {
    dayChosed = true;
    weekChosed = false;

    $(this).addClass('choose-way');
    csw.removeClass('choose-way');

    newCalendar();
    removeEmpty();
    defaultDaytHandler();
});

csw.on('click', function() {
    weekChosed = true;
    dayChosed = false;

    finChosed = 'byWeek';

    $(this).addClass('choose-way');
    csd.removeClass('choose-way');

    newCalendar();
    removeEmpty();
    defaultWeekHandler();
});

//设定导航区域
function generateNav(year, month) {
    var navYear = document.getElementById("year");
    var navMonth = document.getElementById("month");
    navYear.innerText = year.toString();
    navMonth.innerText = (month + 1).toString();
}

//是否增加周处理函数
function isAddWeekHandler(weekday, dateString) {
    switch (weekday) {
        case 1:
            var endDay = getWantDay('next', dateString, 6).getDate();

            return endDay >= weekDayBegin && endDay <= weekDayEnd;
        case 2:
            var beginDay = getWantDay('before', dateString, 1).getDate();
            var endDay = getWantDay('next', dateString, 5).getDate();

            return (beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd);
        case 3:
            var beginDay = getWantDay('before', dateString, 2).getDate();
            var endDay = getWantDay('next', dateString, 4).getDate();

            return (beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd);
        case 4:
            var beginDay = getWantDay('before', dateString, 3).getDate();
            var endDay = getWantDay('next', dateString, 3).getDate();

            return (beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd);
        case 5:
            var beginDay = getWantDay('before', dateString, 4).getDate();
            var endDay = getWantDay('next', dateString, 2).getDate();

            return (beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd);
        case 6:
            var beginDay = getWantDay('before', dateString, 5).getDate();
            var endDay = getWantDay('next', dateString, 1).getDate();

            return (beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd);
        case 0:
            var beginDay = getWantDay('before', dateString, 6).getDate();

            return beginDay >= weekDayBegin && beginDay <= weekDayEnd;
    }
}

//日历表格
function generateTable(firstDate) {
    //获取日历日期部分Node
    var dateTable = document.getElementById("dateTable");
    //若不是第一次生成，则需要把此前生成的日历去掉
    while (dateTable.firstChild) {
        dateTable.removeChild(dateTable.firstChild);
    }
    var date = firstDate.getDate();

    for (var i = 0; i < 6; i++) {
        var newRow = document.createElement("tr");

        for (var j = 0; j < 7; j++) {
            var newDate = document.createElement("td");

            //获取日期信息
            firstDate.setDate(++date);

            //日
            date = firstDate.getDate();

            //月
            month = firstDate.getMonth() + 1;

            var dateInfo = firstDate.toLocaleDateString();

            //设置Node的id，便于后期操作
            newDate.setAttribute("id", formatDate(dateInfo));

            if ($('#month').text() == month) {
                newDate.innerText = date;

                //判断按天还是按周
                if (dayChosed) {
                    //判断月份范围
                    if (month >= monthBegin && month <= monthEnd) {
                        //判断日期范围
                        if (date >= dayDayBegin && date <= dayDayEnd) {
                            newDate.setAttribute("class", "date");
                            //设置点击事件，防止被解释为数字，用转义字符加上双引号
                            newDate.setAttribute("onclick", "generateToday(\"" + dateInfo + "\")");
                        } else {
                            newDate.setAttribute("class", "date-disabled");
                        }

                    } else {
                        newDate.setAttribute("class", "date-disabled");
                    }
                } else {
                    //判断月份范围
                    if (month >= monthBegin && month <= monthEnd) {
                        //判断日期范围
                        if (date >= weekDayBegin && date <= weekDayEnd) {

                            //判断是否添加周处理事件
                            if (isAddWeekHandler(new Date(dateInfo).getDay(), dateInfo)) {
                                newDate.setAttribute("class", "date");
                                //设置点击事件，防止被解释为数字，用转义字符加上双引号
                                newDate.setAttribute("onclick", "generateWeek(\"" + dateInfo + "\")");
                            } else {
                                newDate.setAttribute("class", "date-disabled");
                            }

                        } else {
                            newDate.setAttribute("class", "date-disabled");
                        }

                    } else {
                        newDate.setAttribute("class", "date-disabled");
                    }
                }

            } else {
                newDate.innerText = '';
            }

            newRow.appendChild(newDate);
        }

        dateTable.appendChild(newRow);
    }
}

//格式化日期
function formatDate(date) {
    return date.split('/').join('');
};

//设置当前日期
function setCurrentDate(dateString) {
    currentDate = new Date(dateString);
}

//清除按天样式
function cleardayStyle() {
    $("[onclick*='generateToday']").removeClass('todayTd');
    $("[onclick*='generateToday']").children().remove();
}

//按天事件处理函数
function generateToday(dateString) {
    var dateInfo = formatDate(dateString);

    //清除样式
    cleardayStyle();

    //设置选中日期样式
    var dateTd = $('#' + dateInfo);

    dateTd.addClass('todayTd'); //设定新的CSS样式
    dateTd.append('<div>交车</div>'); //增加提车文字

    //设置当前日期
    setCurrentDate(dateString);

    //每次选中的日期
    console.log(currentDate.toLocaleDateString());
}

//获取前或后天数的日期
function getWantDay(status, today, day) {
    if (status == 'next') {
        return new Date((new Date(today).getTime() + 24 * 60 * 60 * 1000 * day));
    } else if (status == 'before') {
        return new Date((new Date(today).getTime() - 24 * 60 * 60 * 1000 * day));
    } else {
        return today;
    }
}

//清除按周样式
function clearWeekStyle() {
    $("[onclick*='generateWeek']").removeClass('weekTd');
    $("[onclick*='generateWeek']").children().remove();
}

//按周事件处理函数
function generateWeek(dateString) {
    var dateInfo = formatDate(dateString);

    //周几
    var weekday = new Date(dateString).getDay();

    //能否设置当前日期
    var canSetCurDay = false;

    //设置选中周样式
    switch (weekday) {
        case 1:
            var endDay = getWantDay('next', dateString, 6).getDate();

            if (endDay >= weekDayBegin && endDay <= weekDayEnd) {
                clearWeekStyle();
                $('#' + dateInfo).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 4).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 5).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 6).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 6).toLocaleDateString())).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 6);
            break;
        case 2:
            var beginDay = getWantDay('before', dateString, 1).getDate();
            var endDay = getWantDay('next', dateString, 5).getDate();

            if ((beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd)) {
                clearWeekStyle();
                $('#' + formatDate(getWantDay('before', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + dateInfo).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 4).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 5).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 5).toLocaleDateString())).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 5);
            break;
        case 3:
            var beginDay = getWantDay('before', dateString, 2).getDate();
            var endDay = getWantDay('next', dateString, 4).getDate();

            if ((beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd)) {
                clearWeekStyle();
                $('#' + formatDate(getWantDay('before', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + dateInfo).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 4).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 4).toLocaleDateString())).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 4);
            break;
        case 4:
            var beginDay = getWantDay('before', dateString, 3).getDate();
            var endDay = getWantDay('next', dateString, 3).getDate();

            if ((beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd)) {
                clearWeekStyle();
                $('#' + formatDate(getWantDay('before', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + dateInfo).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 3).toLocaleDateString())).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 3);
            break;
        case 5:
            var beginDay = getWantDay('before', dateString, 4).getDate();
            var endDay = getWantDay('next', dateString, 2).getDate();

            if ((beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd)) {
                clearWeekStyle();
                $('#' + formatDate(getWantDay('before', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 4).toLocaleDateString())).addClass('weekTd');
                $('#' + dateInfo).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 2).toLocaleDateString())).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 2);
            break;
        case 6:
            var beginDay = getWantDay('before', dateString, 5).getDate();
            var endDay = getWantDay('next', dateString, 1).getDate();

            if ((beginDay >= weekDayBegin && beginDay <= weekDayEnd) && (endDay >= weekDayBegin && endDay <= weekDayEnd)) {
                clearWeekStyle();
                $('#' + formatDate(getWantDay('before', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 4).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 5).toLocaleDateString())).addClass('weekTd');
                $('#' + dateInfo).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('next', dateString, 1).toLocaleDateString())).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 1);
            break;
        case 0:
            var beginDay = getWantDay('before', dateString, 6).getDate();

            if (beginDay >= weekDayBegin && beginDay <= weekDayEnd) {
                clearWeekStyle();
                $('#' + formatDate(getWantDay('before', dateString, 1).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 2).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 3).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 4).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 5).toLocaleDateString())).addClass('weekTd');
                $('#' + formatDate(getWantDay('before', dateString, 6).toLocaleDateString())).addClass('weekTd');
                $('#' + dateInfo).addClass('weekTd');
                $('#' + dateInfo).append('<div>交车</div>');
            }

            weekLastDay = getWantDay('next', dateString, 0);
            break;
    }

    //设置当前日期
    setCurrentDate(dateString);

    //每次选中的日期
    console.log(currentDate.toLocaleDateString());

    //每次选中周的最后一天
    console.log(weekLastDay.toLocaleDateString());
}

$('#showPara').on('click', function() {
    alert('按天或者按周' + '按天 ' + dayChosed);
    alert('按天或者按周' + '按周 ' + weekChosed);

    alert('是否接受提前交车 ' + acceptGetCar);

    alert('按天时选中的日期 ' + currentDate.toLocaleDateString());

    alert('按周时的最后一天 ' + weekLastDay.toLocaleDateString());
})