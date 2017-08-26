/*eslint-disable */
/**
 * @summary 当前日期
 * @desc 用于记录当前日历状态的Date对象，随用户的操作而不断更新
 * @type {Date}
 */
var currentDate = new Date();

/**
 * @summary 今日日期
 * @desc 在操作日期发生改变时，记录上一次操作后的日期，与currentDate相差一次操作，供日期切换使用
 * @type {Date}
 */
var datedDate;

//按天时自定义选择天数范围
var dayDayBegin = 3;
var dayDayEnd = 16;

//按周时自定义选择天数范围
var weekDayBegin = 5;
var weekDayEnd = 25;

//自定义选择月份范围
var monthBegin = 8;
var monthEnd = 8;

//按天选择或是按周选择
var dayChosed = true;
var weekChosed = false;

var csd = $('.choose-day');
var csw = $('.choose-week');

csd.on('click', function(){
    dayChosed = true;
    weekChosed = false;

    $(this).addClass('choose-way');
    csw.removeClass('choose-way');

    newCalendar();
});

csw.on('click', function(){
    weekChosed = true;
    dayChosed = false;

    $(this).addClass('choose-way');
    csd.removeClass('choose-way');

    newCalendar();
});

//初始生成日历
newCalendar();

/**
 * “上个月”切换按钮监听
 */
var btnLastMonth = $('#lastMonth');
btnLastMonth.on("click", function() {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth(--currentMonth);
    newCalendar();
});

/**
 *
 * “下个月”切换按钮监听
 */
var btnNextMonth = $('#nextMonth');
btnNextMonth.on("click", function() {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth(++currentMonth);
    newCalendar();
});

/**
 * @summary 根据指定 年-月（格式：YYYY-MM）生成当月日历
 * @desc 主体部分。
 * 利用Date的构造函数调用参数，
 * 当数值大于合理范围时，会被调整为相邻值，以此获取此月日历中第一行第一列的日期。
 * 若指定月份的1号是周日，表明日历不含上月的日期，无需特殊处理；
 * 若指定月份的1号不是周日，则取相反数（原理： 1 - 周几 + 1），获取所需日期。
 * 注：此处为方便生成表格使用(++date)，日期计数取为从0开始，即1号由0表示，与Date.prototype.getDate()所得相差1。
 * @param {number} year - 预生成日历的年份
 * @param {number} month - 预生成日历的月份
 * @returns {date} currentDate - 当前日期（仅年份、月份发生改变）
 *
 */
function newCalendar() {
    var month = currentDate.getMonth();
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

/**
 * @summary 设定导航区域
 * @desc 利用年、月设定相关值
 * @param {number} year - 预生成日历的年份
 * @param {number} month - 预生成日历的月份
 *
 */
function generateNav(year, month) {
    var navYear = document.getElementById("year");
    var navMonth = document.getElementById("month");
    navYear.innerText = year.toString();
    navMonth.innerText = (month + 1).toString();
}

/**
 * @summary 根据日历首位日期，生成日历主体表格
 * @desc 首位日期指：日历的表格中第一行第一列位置的日期。
 * 利用Date的相关特性处理跨月份的情况，循环后
 * 生成 6*7 表格，加入DOM树，形成日历的主体日期区域。
 * @param {date} firstDate - 日历表格中第一行、第一列的日期数（从0开始）
 */
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
                            newDate.setAttribute("class", "date");
                            //设置点击事件，防止被解释为数字，用转义字符加上双引号
                            newDate.setAttribute("onclick", "generateWeek(\"" + dateInfo + "\")");
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

function formatDate(date) {
    return date.split('/').join('');
};

/**
 * 按天事件处理函数
 * @param {string} dateString - 表示日期的字符串，格式 YYYY/MM/DD
 */
function generateToday(dateString) {
    var dateInfo = formatDate(dateString);

    if (dateString) { //若传递了参数，根据参数设定值
        var info = dateString.split('/');
        currentDate.setYear(info[0]);
        if (currentDate.getDate() > 30) {
            currentDate.setDate(info[2]);
            currentDate.setMonth(parseInt(info[1]) - 1);
        } else {
            currentDate.setMonth(parseInt(info[1]) - 1);
            currentDate.setDate(info[2]);
        }
    }

    if (datedDate == null) {
        //第一次生成
        datedDate = new Date();
    } else {
        //获取前一次操作时涉及的元素，清除样式
        var datedDateString = datedDate.toLocaleDateString();

        datedDateString = formatDate(datedDateString);

        if ($('#' + datedDateString)) {
            $('#' + datedDateString).addClass('date');
            $('#' + datedDateString).removeClass('todayTd');
            $('#' + datedDateString).children().remove();
        }
    }

    var dateTd = $('#' + dateInfo);

    dateTd.addClass('todayTd'); //设定新的CSS样式
    dateTd.append('<div>交车</div>'); //增加提车文字
    // 记录此次操作的日期
    datedDate.setYear(currentDate.getFullYear()); //坑：这里的顺序不能颠倒，否则切换月的时候会错
    datedDate.setMonth(currentDate.getMonth());
    datedDate.setDate(currentDate.getDate());

    //每次选中的日期
    // console.log(currentDate.toLocaleDateString());
}

/**
 * 按周事件处理函数
 * @param {string} dateString - 表示日期的字符串，格式 YYYY/MM/DD
 */
function generateWeek(dateString) {
    var dateInfo = formatDate(dateString);

    if (dateString) { //若传递了参数，根据参数设定值
        var info = dateString.split('/');
        currentDate.setYear(info[0]);
        if (currentDate.getDate() > 30) {
            currentDate.setDate(info[2]);
            currentDate.setMonth(parseInt(info[1]) - 1);
        } else {
            currentDate.setMonth(parseInt(info[1]) - 1);
            currentDate.setDate(info[2]);
        }
    }

    if (datedDate == null) {
        //第一次生成
        datedDate = new Date();
    } else {
        //获取前一次操作时涉及的元素，清除样式
        var datedDateString = datedDate.toLocaleDateString();

        datedDateString = formatDate(datedDateString);

        if ($('#' + datedDateString)) {
            $('#' + datedDateString).addClass('date');
            $('#' + datedDateString).removeClass('todayTd');
            $('#' + datedDateString).children().remove();
        }
    }

    var dateTd = $('#' + dateInfo);

    dateTd.addClass('todayTd'); //设定新的CSS样式
    dateTd.append('<div>交车</div>'); //增加提车文字
    // 记录此次操作的日期
    datedDate.setYear(currentDate.getFullYear()); //坑：这里的顺序不能颠倒，否则切换月的时候会错
    datedDate.setMonth(currentDate.getMonth());
    datedDate.setDate(currentDate.getDate());

    //每次选中的日期
    // console.log(currentDate.toLocaleDateString());
}