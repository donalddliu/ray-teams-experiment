(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"mizzao:timesync":{"timesync-server.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/mizzao_timesync/timesync-server.js                                                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// Use rawConnectHandlers so we get a response as quickly as possible
// https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js
WebApp.rawConnectHandlers.use("/_timesync", function (req, res, next) {
  // Never ever cache this, otherwise weird times are shown on reload
  // http://stackoverflow.com/q/18811286/586086
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", 0); // Avoid MIME type warnings in browsers

  res.setHeader("Content-Type", "text/plain"); // Cordova lives in a local webserver, so it does CORS
  // we need to bless it's requests in order for it to accept our results
  // Match http://localhost:<port> for Cordova clients in Meteor 1.3
  // and http://meteor.local for earlier versions

  const origin = req.headers.origin;

  if (origin && (origin === 'http://meteor.local' || origin === 'meteor://desktop' || /^http:\/\/localhost:1[23]\d\d\d$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.end(Date.now().toString());
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/mizzao:timesync/timesync-server.js");

/* Exports */
Package._define("mizzao:timesync");

})();

//# sourceURL=meteor://💻app/packages/mizzao_timesync.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWl6emFvOnRpbWVzeW5jL3RpbWVzeW5jLXNlcnZlci5qcyJdLCJuYW1lcyI6WyJXZWJBcHAiLCJyYXdDb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0Iiwic2V0SGVhZGVyIiwib3JpZ2luIiwiaGVhZGVycyIsInRlc3QiLCJlbmQiLCJEYXRlIiwibm93IiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQUEsTUFBTSxDQUFDQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEIsWUFBOUIsRUFDRSxVQUFTQyxHQUFULEVBQWNDLEdBQWQsRUFBbUJDLElBQW5CLEVBQXlCO0FBQ3ZCO0FBQ0E7QUFDQUQsS0FBRyxDQUFDRSxTQUFKLENBQWMsZUFBZCxFQUErQixxQ0FBL0I7QUFDQUYsS0FBRyxDQUFDRSxTQUFKLENBQWMsUUFBZCxFQUF3QixVQUF4QjtBQUNBRixLQUFHLENBQUNFLFNBQUosQ0FBYyxTQUFkLEVBQXlCLENBQXpCLEVBTHVCLENBT3ZCOztBQUNBRixLQUFHLENBQUNFLFNBQUosQ0FBYyxjQUFkLEVBQThCLFlBQTlCLEVBUnVCLENBVXZCO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQU1DLE1BQU0sR0FBR0osR0FBRyxDQUFDSyxPQUFKLENBQVlELE1BQTNCOztBQUVBLE1BQUlBLE1BQU0sS0FBTUEsTUFBTSxLQUFLLHFCQUFYLElBQ1pBLE1BQU0sS0FBSyxrQkFEQyxJQUVaLG1DQUFtQ0UsSUFBbkMsQ0FBd0NGLE1BQXhDLENBRk0sQ0FBVixFQUV3RDtBQUN0REgsT0FBRyxDQUFDRSxTQUFKLENBQWMsNkJBQWQsRUFBNkNDLE1BQTdDO0FBQ0Q7O0FBRURILEtBQUcsQ0FBQ00sR0FBSixDQUFRQyxJQUFJLENBQUNDLEdBQUwsR0FBV0MsUUFBWCxFQUFSO0FBQ0QsQ0F4QkgsRSIsImZpbGUiOiIvcGFja2FnZXMvbWl6emFvX3RpbWVzeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVXNlIHJhd0Nvbm5lY3RIYW5kbGVycyBzbyB3ZSBnZXQgYSByZXNwb25zZSBhcyBxdWlja2x5IGFzIHBvc3NpYmxlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9ibG9iL2RldmVsL3BhY2thZ2VzL3dlYmFwcC93ZWJhcHBfc2VydmVyLmpzXG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKFwiL190aW1lc3luY1wiLFxuICBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIC8vIE5ldmVyIGV2ZXIgY2FjaGUgdGhpcywgb3RoZXJ3aXNlIHdlaXJkIHRpbWVzIGFyZSBzaG93biBvbiByZWxvYWRcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8xODgxMTI4Ni81ODYwODZcbiAgICByZXMuc2V0SGVhZGVyKFwiQ2FjaGUtQ29udHJvbFwiLCBcIm5vLWNhY2hlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlXCIpO1xuICAgIHJlcy5zZXRIZWFkZXIoXCJQcmFnbWFcIiwgXCJuby1jYWNoZVwiKTtcbiAgICByZXMuc2V0SGVhZGVyKFwiRXhwaXJlc1wiLCAwKTtcblxuICAgIC8vIEF2b2lkIE1JTUUgdHlwZSB3YXJuaW5ncyBpbiBicm93c2Vyc1xuICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3BsYWluXCIpO1xuXG4gICAgLy8gQ29yZG92YSBsaXZlcyBpbiBhIGxvY2FsIHdlYnNlcnZlciwgc28gaXQgZG9lcyBDT1JTXG4gICAgLy8gd2UgbmVlZCB0byBibGVzcyBpdCdzIHJlcXVlc3RzIGluIG9yZGVyIGZvciBpdCB0byBhY2NlcHQgb3VyIHJlc3VsdHNcbiAgICAvLyBNYXRjaCBodHRwOi8vbG9jYWxob3N0Ojxwb3J0PiBmb3IgQ29yZG92YSBjbGllbnRzIGluIE1ldGVvciAxLjNcbiAgICAvLyBhbmQgaHR0cDovL21ldGVvci5sb2NhbCBmb3IgZWFybGllciB2ZXJzaW9uc1xuICAgIGNvbnN0IG9yaWdpbiA9IHJlcS5oZWFkZXJzLm9yaWdpbjtcblxuICAgIGlmIChvcmlnaW4gJiYgKCBvcmlnaW4gPT09ICdodHRwOi8vbWV0ZW9yLmxvY2FsJyB8fCBcbiAgICAgICAgb3JpZ2luID09PSAnbWV0ZW9yOi8vZGVza3RvcCcgfHwgXG4gICAgICAgIC9eaHR0cDpcXC9cXC9sb2NhbGhvc3Q6MVsyM11cXGRcXGRcXGQkLy50ZXN0KG9yaWdpbikgKSApIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgcmVzLmVuZChEYXRlLm5vdygpLnRvU3RyaW5nKCkpO1xuICB9XG4pO1xuIl19
