"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox) => {
    toolbox.foo = () => {
        toolbox.print.info('called foo extension');
    };
    // enable this if you want to read configuration in from
    // the current folder's package.json (in a "query" property),
    // query.config.json, etc.
    // toolbox.config = {
    //   ...toolbox.config,
    //   ...toolbox.config.loadConfig("query", process.cwd())
    // }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWV4dGVuc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaS1leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBMEU7QUFDMUUsbUJBQW1CO0FBQ25CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUF1QixFQUFFLEVBQUU7SUFDM0MsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUU7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUE7SUFFRCx3REFBd0Q7SUFDeEQsNkRBQTZEO0lBQzdELDBCQUEwQjtJQUMxQixxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLHlEQUF5RDtJQUN6RCxJQUFJO0FBQ04sQ0FBQyxDQUFBIn0=