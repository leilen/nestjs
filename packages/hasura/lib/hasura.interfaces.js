"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonCronSchedules = void 0;
const exampleEvent = {
    id: 'ecd5fe4a-7113-4243-bb0e-6177c78a0033',
    table: { schema: 'public', name: 'user' },
    trigger: { name: 'user_created' },
    event: {
        session_variables: { 'x-hasura-role': 'admin' },
        op: 'INSERT',
        data: { old: null, new: [Object] },
    },
    delivery_info: { current_retry: 0, max_retries: 0 },
    created_at: '2020-02-20T01:12:12.789983Z',
};
var CommonCronSchedules;
(function (CommonCronSchedules) {
    CommonCronSchedules["EveryMinute"] = "* * * * *";
    CommonCronSchedules["EveryTenMinutes"] = "*/10 * * * *";
    CommonCronSchedules["EveryMidnight"] = "0 0 * * *";
    CommonCronSchedules["EveryMonthStart"] = "0 0 1 * *";
    CommonCronSchedules["EveryFridayNoon"] = "0 12 * * 5";
})(CommonCronSchedules = exports.CommonCronSchedules || (exports.CommonCronSchedules = {}));
//# sourceMappingURL=hasura.interfaces.js.map