$(document).ready(function () {
    $("#btn_signin").click(function () {
       $.post("/request",
          {
             name: "viSion",
             designation: "Professional gamer"
          },
          function (data, status) {
             console.log(data);
          });
    });
 });