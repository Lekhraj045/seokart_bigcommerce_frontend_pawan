// (function () {
//   const w = window;
//   const ic = w.Intercom;
//   if (typeof ic === 'function') {
//     ic('reattach_activator');
//     ic('update', w.intercomSettings);
//   } else {
//     const d = document;
//     const i = function () {
//       i.c(arguments);
//     };
//     i.q = [];
//     i.c = function (args) {
//       i.q.push(args);
//     };
//     w.Intercom = i;
//     const l = function () {
//       const s = d.createElement('script');
//       s.type = 'text/javascript';
//       s.async = true;
//       s.src = 'https://widget.intercom.io/widget/zd1gh4in';
//       const x = d.getElementsByTagName('script')[0];
//       x.parentNode.insertBefore(s, x);
//     };
//     if (document.readyState === 'complete') {
//       l();
//     } else if (w.attachEvent) {
//       w.attachEvent('onload', l);
//     } else {
//       w.addEventListener('load', l, false);
//     }
//   }
// })();

//   window.Intercom("boot", {
//     api_base: "https://api-iam.intercom.io",
//     app_id: "zd1gh4in"
//   });

//   window.intercomSettings = {
//     user_id: localStorage?.getItem('user_id'),
//     app_id: "zd1gh4in"
//   }

!(function (o) {
  var w = window;
  w.SessionRewindConfig = o;
  var f = document.createElement("script");
  ((f.async = 1),
    (f.crossOrigin = "anonymous"),
    (f.src = "https://rec.sessionrewind.com/srloader.js"));
  var g = document.getElementsByTagName("head")[0];
  g.insertBefore(f, g.firstChild);
})({
  apiKey: "hLGlm6z50H5MlhJCoufuW3LOgNhaKbrf9R7SI5Kb",
  startRecording: true,
  userInfo: {
    userId: localStorage?.getItem("email"),
    userName: localStorage?.getItem("email"),
    platform: "bigcommerce",
    payment_status:
      localStorage?.getItem("manage_service") == 1 ? "paid" : "unpaid",
  },
});
