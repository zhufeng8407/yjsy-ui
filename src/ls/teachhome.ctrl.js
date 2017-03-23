/**
 * Created by xiafan on 16-11-23.
 */


(function () {
    'use strict';
    var homeApp = angular.module('teachhome');

    homeApp.controller("TeachHomePageCtrl", ["$scope", "$compile", "uiCalendarConfig", '$uibModal', 'ecnuMessageDao', StuHomePageCtrl]);
    function StuHomePageCtrl($scope, $compile, uiCalendarConfig, $uibModal, ecnuMessageDao) {
        var vm = this;
        var date = new Date();

        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        vm.alertOnEventClick = function (date, jsEvent, view) {
            $uibModal.open({
                animation: true,
                templateUrl: 'showEvent.html',
                controller: 'ShowEventCtrl',
                controllerAs: 'showEventCtrl',
                resolve: {
                    event: date
                }
            });
        };
        /* alert on Resize */
        vm.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            vm.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        vm.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* remove event */
        vm.remove = function (index) {
            vm.events.splice(index, 1);
        };
        /* Change View */
        vm.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Render Tooltip */
        vm.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)(vm);
        };

        vm.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                weekNumbers: true,
                navLinks: true,
                eventLimit: false,
                buttonIcons: false,
                locale: 'zh-cn',
                views: {
                    day: {
                        titleFormat: 'YYYY年MM月DD日'
                    },
                    week: {
                        titleFormat: 'YYYY年MM月'

                    },
                    month: {
                        titleFormat: 'YYYY年MM月'
                    },
                },
                timeFormat: 'HH:mm',
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay,listMonth'
                },
                allDayText: "全天",
                buttonText: {
                    prev: '<',
                    next: '>',
                    today: '今天',
                    month: '月',
                    week: '周',
                    day: '天'
                },
                dayNames: [
                    "星期日",
                    "星期一",
                    "星期二",
                    "星期三",
                    "星期四",
                    "星期五",
                    "星期六"
                ],
                dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                monthNames: [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                eventClick: vm.alertOnEventClick,
                eventResize: vm.alertOnResize,
                eventRender: vm.eventRender,
                dayClick: vm.dayClick,
                events: function (start, end, timezone, callback) {
                    ecnuMessageDao.getCurrentMessages(start, end, function (res) {
                        var events = [];
                        for (var i = 0; i < res.data.length; i++)
                            events.push(res.data[i]);
                        callback(events);
                    });
                }
            }
        };
    }

    homeApp.controller("ShowEventCtrl", ['$uibModalInstance', 'event', 'ecnuMessageDao', ShowEventCtrl]);
    function ShowEventCtrl($uibModalInstance, event, ecnuMessageDao) {
        var vm = this;

        vm.close = close;

        init();

        function init() {
            ecnuMessageDao.getMessageDetails(event.id, function (res) {
                vm.event = event;
                if (res.data.link != null) vm.event.link = "http://" + res.data.link;
                vm.event.content = res.data.content;
            })
        }

        function close() {
            $uibModalInstance.dismiss();
        }
    }

    homeApp.filter("parseHTML", function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    })
})();