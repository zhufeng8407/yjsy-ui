/**
 * Created by xiafan on 16-11-25.
 */

(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.directive("statusAuditTimeline", [
        'PathUtils', statusAuditTimeline
    ]);

    function statusAuditTimeline(pathUtils) {
        return {
            restrict: 'E',
            scope: {
                "auditRecords": '=?'
            },
            controller: [
                '$scope',
                statusAuditTimelineCtrl
            ],
            controllerAs: statusAuditTimelineCtrl,
            templateUrl: pathUtils.qualifiedPath("/common/directive/status-audit-timeline.html")
        }
    }

    function statusAuditTimelineCtrl($scope) {
        var vm = this;

        $scope.$watch("auditRecords", function (value) {
            for (var idx in value) {
                var rec = value[idx];
                if (rec.status == "审批中") {
                    rec["icon"] = "glyphicon-edit";
                    rec["class"] = "info";
                } else if (rec.status == "通过") {
                    rec["icon"] = "glyphicon-ok";
                    rec["class"] = "success";
                } else if (rec.status == "否决") {
                    rec["icon"] = "glyphicon-remove";
                    rec["class"] = "danger";
                } else if (rec.status == "待审批") {
                    rec["icon"] = "glyphicon-time";
                    rec["class"] = "warning";
                }
            }
        })
    }

})();