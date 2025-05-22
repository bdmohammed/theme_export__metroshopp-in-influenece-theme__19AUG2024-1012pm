// jQuery_T4NT(document).ready(function ($) {
//   console.log("ready");

//   $(".incards").hover(function () {
//     console.log("mouseover");
//   });

//   $(".incards").hover(
//     function () {
//       console.log("hover");
//       $(this).children(".hover-content").addClass("active"); //Add an active class to the anchor
//     },
//     function () {
//       $(this).children(".hover-content").removeClass("active"); //Remove an active class to the anchor
//     }
//   );
// });

document.ready(function (t) {
  window.$(document).on('mouseover', '.incards', function (e) {
    window.$(this).children('.hover-content').addClass('active'); //Add an active class to the anchor
  });
});

// jQuery_T4NT(document).ready(function (t) {
//   t(".t4_tools_btns").addClass("active"),
//     t(document).on("click", ".admin_t4_tools_btn", function (e) {
//       t(this).toggleClass("show_admin_t4_pp");
//     });
// });
