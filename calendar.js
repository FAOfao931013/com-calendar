/*eslint-disable */
// define(function(require, exports, module) {
    //当前日期
    var currentDate = new Date();

    //选中周的最后一天
    var weekLastDay = new Date();

    //是否接受提前交车
    var acceptGetCar = true;

    //默认的日期
    var defaultDay;

    //自定义选择日期范围
    var dateBegin;
    var dateEnd;

    //按天选择或是按周选择
    var dayChosed = true;
    var weekChosed = false;

    //是否选择了日期
    var hasChosedDate = false;

    //监听是否接受提前交车
    $('#getCar').on('change', function() {
        acceptGetCar = $(this).prop('checked');

        app.setAppData();
    });

    //上个月切换按钮监听
    var btnLastMonth = $('#lastMonth');
    btnLastMonth.on("click", function() {
        var currentMonth = currentDate.getMonth();

        currentDate.setFullYear(currentDate.getFullYear(), --currentMonth, 1);

        newCalendar();
        removeEmpty();

        if (dayChosed) {
            defaultDaytHandler();
        } else {
            if (weekLastDay) {
                $('#' + formatDate(weekLastDay.toLocaleDateString())).click();
                showFirstWeek();

                $('#dateTable tr:first-child').bind('click', function() {
                    showFirstWeek();
                });
            }
        }

        app.setAppData();
    });

    //下个月切换按钮监听
    var btnNextMonth = $('#nextMonth');
    btnNextMonth.on("click", function() {
        var currentMonth = currentDate.getMonth();

        currentDate.setFullYear(currentDate.getFullYear(), ++currentMonth, 1);

        newCalendar();
        removeEmpty();

        if (dayChosed) {
            defaultDaytHandler();
        } else {
            if (weekLastDay) {
                $('#' + formatDate(weekLastDay.toLocaleDateString())).click();
                showFirstWeek();

                $('#dateTable tr:first-child').bind('click', function() {
                    showFirstWeek();
                });
            }
        }

        app.setAppData();
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

        $(this).hide();
        csw.show();

        app.setAppData();
    });

    csw.on('click', function() {
        weekChosed = true;
        dayChosed = false;

        //清除一周最后一天
        weekLastDay = '';

        $(this).addClass('choose-way');
        csd.removeClass('choose-way');

        newCalendar();
        removeEmpty();
        changeHasChosedDate(false);
        defaultWeek();

        $(this).hide();
        csd.show();

        app.setAppData();
    });

    //格式化日期
    function formatDate(date) {
        return date.split('/').join('');
    }

    //触发默认日期事件
    function defaultDaytHandler() {
        if (defaultDay) {
            $('#' + defaultDay).click();
        }
    }

    //获取前或后天数的日期
    function getWantDay(status, today, day) {
        if (status == 'next') {
            return new Date((today.getTime() + 24 * 60 * 60 * 1000 * day));
        } else if (status == 'before') {
            return new Date((today.getTime() - 24 * 60 * 60 * 1000 * day));
        } else {
            return today;
        }
    }

    //是否增加周处理函数
    function isAddWeekHandler(weekday, firstDate) {
        switch (weekday) {
            case 1:
                var endDate = getWantDay('next', firstDate, 6);

                return endDate - dateEnd <= 0;
            case 2:
                var beginDate = getWantDay('before', firstDate, 1);
                var endDate = getWantDay('next', firstDate, 5);

                return beginDate - dateBegin >= 0 && endDate - dateEnd <= 0;
            case 3:
                var beginDate = getWantDay('before', firstDate, 2);
                var endDate = getWantDay('next', firstDate, 4);

                return beginDate - dateBegin >= 0 && endDate - dateEnd <= 0;
            case 4:
                var beginDate = getWantDay('before', firstDate, 3);
                var endDate = getWantDay('next', firstDate, 3);

                return beginDate - dateBegin >= 0 && endDate - dateEnd <= 0;
            case 5:
                var beginDate = getWantDay('before', firstDate, 4);
                var endDate = getWantDay('next', firstDate, 2);

                return beginDate - dateBegin >= 0 && endDate - dateEnd <= 0;
            case 6:
                var beginDate = getWantDay('before', firstDate, 5);
                var endDate = getWantDay('next', firstDate, 1);

                return beginDate - dateBegin >= 0 && endDate - dateEnd <= 0;
            case 0:
                var beginDate = getWantDay('before', firstDate, 6);

                return beginDate - dateBegin >= 0;
        }
    }

    //设置当前日期
    function setCurrentDate(dateString) {
        currentDate = new Date(dateString);
    }

    //清除按天样式
    function cleardayStyle() {
        $(".todayTd").children().remove();
        $(".todayTd").removeClass('todayTd');
    }

    //按天事件处理函数
    function generateToday(dateString) {
        var dateInfo = formatDate(dateString);

        //选择日期后启动提交按钮
        changeHasChosedDate(true);

        //清除样式
        cleardayStyle();

        //设置选中日期样式
        var dateTd = $('#' + dateInfo);

        dateTd.addClass('todayTd'); //设定新的CSS样式
        dateTd.append('<div>交车</div>'); //增加提车文字

        //设置当前日期
        setCurrentDate(dateString);

        //清除默认日期
        defaultDay = formatDate(currentDate.toLocaleDateString());

        //每次选中的日期
        console.log(currentDate.toLocaleDateString());

        app.setAppData();
    }

    //清除按周样式
    function clearWeekStyle() {
        $("#calendar .weekTd").removeClass('weekTd');
        $("#calendar tr td:last-child").children().remove();
    }

    //按周事件处理函数
    function generateWeek(dateString) {
        //格式化选中的日期
        var dateInfo = formatDate(dateString);

        //选中日期后启动提交按钮
        changeHasChosedDate(true);

        //选中的日期
        var date = new Date(dateString);

        //周几
        var weekday = date.getDay();

        //设置选中周样式
        switch (weekday) {
            case 1:
                var endDate = getWantDay('next', date, 6);

                if (endDate - dateEnd <= 0) {
                    clearWeekStyle();
                    $('#' + dateInfo).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 4).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 5).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 6).toLocaleDateString())).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 6);
                break;
            case 2:
                var beginDate = getWantDay('before', date, 1);
                var endDate = getWantDay('next', date, 5);

                if (beginDate - dateBegin >= 0 && endDate - dateEnd <= 0) {
                    clearWeekStyle();
                    $('#' + formatDate(getWantDay('before', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + dateInfo).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 4).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 5).toLocaleDateString())).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 5);
                break;
            case 3:
                var beginDate = getWantDay('before', date, 2);
                var endDate = getWantDay('next', date, 4);

                if (beginDate - dateBegin >= 0 && endDate - dateEnd <= 0) {
                    clearWeekStyle();
                    $('#' + formatDate(getWantDay('before', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + dateInfo).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 4).toLocaleDateString())).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 4);
                break;
            case 4:
                var beginDate = getWantDay('before', date, 3);
                var endDate = getWantDay('next', date, 3);

                if (beginDate - dateBegin >= 0 && endDate - dateEnd <= 0) {
                    clearWeekStyle();
                    $('#' + formatDate(getWantDay('before', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + dateInfo).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 3).toLocaleDateString())).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 3);
                break;
            case 5:
                var beginDate = getWantDay('before', date, 4);
                var endDate = getWantDay('next', date, 2);

                if (beginDate - dateBegin >= 0 && endDate - dateEnd <= 0) {
                    clearWeekStyle();
                    $('#' + formatDate(getWantDay('before', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 4).toLocaleDateString())).addClass('weekTd');
                    $('#' + dateInfo).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 2).toLocaleDateString())).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 2);
                break;
            case 6:
                var beginDate = getWantDay('before', date, 5);
                var endDate = getWantDay('next', date, 1);

                if (beginDate - dateBegin >= 0 && endDate - dateEnd <= 0) {
                    clearWeekStyle();
                    $('#' + formatDate(getWantDay('before', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 4).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 5).toLocaleDateString())).addClass('weekTd');
                    $('#' + dateInfo).addClass('weekTd');
                    $('#' + formatDate(getWantDay('next', date, 1).toLocaleDateString())).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 1);
                break;
            case 0:
                var beginDate = getWantDay('before', date, 6);

                if (beginDate - dateBegin >= 0) {
                    clearWeekStyle();
                    $('#' + formatDate(getWantDay('before', date, 1).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 2).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 3).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 4).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 5).toLocaleDateString())).addClass('weekTd');
                    $('#' + formatDate(getWantDay('before', date, 6).toLocaleDateString())).addClass('weekTd');
                    $('#' + dateInfo).addClass('weekTd');
                }

                weekLastDay = getWantDay('next', date, 0);
                break;
        }

        $('.weekTd').each(function(idx) {
            if (!$(this).hasClass('date')) {
                $(this).removeClass('weekTd');
                $(this).empty();

                if (idx == 6) {
                    $('#nextMonth').click();
                }
            }
        });

        //设置当前日期
        setCurrentDate(weekLastDay);

        //每次选中的日期
        console.log(currentDate.toLocaleDateString());

        //每次选中周的最后一天
        // console.log(weekLastDay.toLocaleDateString());

        app.setAppData();
    }

    //启用提交按钮
    function changeHasChosedDate(status) {
        hasChosedDate = status;
    }

    //设定导航区域
    function generateNav(year, month) {
        var navYear = document.getElementById("year");
        var navMonth = document.getElementById("month");
        navYear.innerText = year.toString();
        navMonth.innerText = (month + 1).toString();
    }

    //创建日历表格
    function generateTable(firstDate) {
        //获取日历日期部分Node
        var dateTable = document.getElementById("dateTable");
        //若不是第一次生成，则需要把此前生成的日历去掉
        while (dateTable.firstChild) {
            dateTable.removeChild(dateTable.firstChild);
        }
        var date = firstDate.getDate();

        for (var i = 0; i < 7; i++) {
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

                newDate.setAttribute("data-dateInfo", dateInfo);

                newDate.setAttribute("data-today", date);

                //只显示当月的日期
                if ($('#month').text() == month) {
                    newDate.innerText = date;

                    //判断按天还是按周
                    if (dayChosed) {
                        if (firstDate - dateBegin >= 0 && firstDate - dateEnd <= 0) {
                            newDate.setAttribute("class", "date");

                            $(newDate).on('click', function() {
                                generateToday($(this).attr('data-dateInfo'));
                            });
                        } else {
                            newDate.setAttribute("class", "date-disabled");
                        }
                    } else {
                        var weekday = firstDate.getDay();

                        if (firstDate - dateBegin >= 0 && firstDate - dateEnd <= 0) {
                            if (isAddWeekHandler(weekday, firstDate)) {
                                // if (weekday == 0) {
                                //     $(newDate).append("<div>交车</div>");
                                // }

                                newDate.setAttribute("class", "date");

                                $(newDate).on('click', function() {
                                    generateWeek($(this).attr('data-dateInfo'));
                                });
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

    //移除空的日期
    function removeEmpty() {
        if ($('#dateTable tr:last-child td').text() == '') {
            $('#dateTable tr:last-child').remove();
        }

        if ($('#dateTable tr:first-child td').text() == '') {
            $('#dateTable tr:first-child').remove();
        }
    }

    //创建新日历
    function newCalendar() {
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var date = currentDate.getDate();
        var thisMonthDay = new Date(year, month, 1);
        var thisMonthFirstDay = thisMonthDay.getDay();
        var thisMonthFirstDate = new Date(year, month, -thisMonthFirstDay - 6);
        generateNav(year, month); //生成导航区域
        generateTable(thisMonthFirstDate); //生成日历主体的日期区域
        currentDate.setYear(year);
        currentDate.setMonth(month);
        return currentDate;
    }

    function chooseWeek() {
        $('.choose-week').click();
    }

    function showFirstWeek() {
        if ($('#dateTable tr:first-child .weekTd').length > 0) {
            $('#dateTable tr:first-child td').each(function(idx, item) {
                $(item).text($(item).attr('data-today'));
                $(item).addClass('date weekTd');
                $(item).bind('click', function() {
                    generateWeek($(item).attr('data-dateInfo'));
                });
            });
        }
    }

    function defaultWeek() {
        if ($('#dateTable tr .date').length > 0) {
            $('#dateTable tr .date').first().click();
            showFirstWeek();
        } else {
            $('#nextMonth').click();
        }
    }

    function disCalendar() {
        $('#dateTable tr td').removeClass('weekTd');
        $('#dateTable tr td').removeClass('date');
        $('#dateTable tr td').addClass('date-disabled');
        $('#dateTable tr td').unbind();

        $('#lastMonth').attr('disabled', true);
        $('#nextMonth').attr('disabled', true);
        $('.choose-week').attr('disabled', true);
        $('.choose-day').attr('disabled', true);
    }

    function startCalendar() {
        $('#lastMonth').attr('disabled', false);
        $('#nextMonth').attr('disabled', false);
        $('.choose-week').attr('disabled', false);
        $('.choose-day').attr('disabled', false);
    }

    var app = {
        calendar: function(resDateBegin, resDateEnd, disClick) {
            defaultDay = formatDate(new Date(resDateBegin).toLocaleDateString());

            //自定义选择日期范围
            dateBegin = new Date(resDateBegin.split('-').join('/'));
            dateEnd = new Date(resDateEnd.split('-').join('/'));

            currentDate = dateBegin;

            if (disClick) {
                //初始生成日历
                newCalendar();
                removeEmpty();
                chooseWeek();

                disCalendar();

                this.selectedDay = '';
                return;
            }

            //初始生成日历
            newCalendar();

            defaultDaytHandler();

            removeEmpty();

            chooseWeek();

            defaultWeek();

            startCalendar();

            this.setAppData();
        },

        setAppData: function() {
            this.selectedDay = currentDate.toLocaleDateString().split('/').join('-');
            this.acceptGetCar = acceptGetCar;
            this.dayChosed = dayChosed;
            this.weekChosed = weekChosed;
        },

        selectedDay: currentDate.toLocaleDateString(),
        acceptGetCar: acceptGetCar,
        dayChosed: dayChosed,
        weekChosed: weekChosed
    };

    app.calendar('2017-09-15', '2017-11-05', false);

    console.log(app.selectedDay);

    // module.exports = app;
// });