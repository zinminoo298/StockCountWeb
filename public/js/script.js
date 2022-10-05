
(function ($) {
    "use strict";
    $(document).on('click', function (e) {
        var outside_space = $(".outside");
        if (!outside_space.is(e.target) &&
            outside_space.has(e.target).length === 0) {
            $(".menu-to-be-close").removeClass("d-block");
            $('.menu-to-be-close').css('display', 'none');
        }
    })

    $('.prooduct-details-box .close').on('click', function (e) {
        var tets = $(this).parent().parent().parent().parent().addClass('d-none');
        console.log(tets);
    })

    /*----------------------------------------
     passward show hide
     ----------------------------------------*/
    $('.show-hide').show();
    $('.show-hide span').addClass('show');

    $('.show-hide span').click(function () {
        if ($(this).hasClass('show')) {
            $('input[name="login[password]"]').attr('type', 'text');
            $(this).removeClass('show');
        } else {
            $('input[name="login[password]"]').attr('type', 'password');
            $(this).addClass('show');
        }
    });
    $('form button[type="submit"]').on('click', function () {
        $('.show-hide span').addClass('show');
        $('.show-hide').parent().find('input[name="login[password]"]').attr('type', 'password');
    });

    /*=====================
      02. Background Image js
      ==========================*/
    $(".bg-center").parent().addClass('b-center');
    $(".bg-img-cover").parent().addClass('bg-size');
    $('.bg-img-cover').each(function () {
        var el = $(this),
            src = el.attr('src'),
            parent = el.parent();
        parent.css({
            'background-image': 'url(' + src + ')',
            'background-size': 'cover',
            'background-position': 'center',
            'display': 'block'
        });
        el.hide();
    });

    $(".mega-menu-container").css("display", "none");
    $(".header-search").click(function () {
        $(".search-full").addClass("open");
    });
    $(".close-search").click(function () {
        $(".search-full").removeClass("open");
        $("body").removeClass("offcanvas");
    });
    $(".mobile-toggle").click(function () {
        $(".nav-menus").toggleClass("open");
    });
    $(".mobile-toggle-left").click(function () {
        $(".left-header").toggleClass("open");
    });
    $(".bookmark-search").click(function () {
        $(".form-control-search").toggleClass("open");
    })
    $(".filter-toggle").click(function () {
        $(".product-sidebar").toggleClass("open");
    });
    $(".toggle-data").click(function () {
        $(".product-wrapper").toggleClass("sidebaron");
    });
    $(".form-control-search input").keyup(function (e) {
        if (e.target.value) {
            $(".page-wrapper").addClass("offcanvas-bookmark");
        } else {
            $(".page-wrapper").removeClass("offcanvas-bookmark");
        }
    });
    $(".search-full input").keyup(function (e) {
        console.log(e.target.value);
        if (e.target.value) {
            $("body").addClass("offcanvas");
        } else {
            $("body").removeClass("offcanvas");
        }
    });

    $('body').keydown(function (e) {
        if (e.keyCode == 27) {
            $('.search-full input').val('');
            $('.form-control-search input').val('');
            $('.page-wrapper').removeClass('offcanvas-bookmark');
            $('.search-full').removeClass('open');
            $('.search-form .form-control-search').removeClass('open');
            $("body").removeClass("offcanvas");
        }
    });
    $(".mode").on("click", function () {
        $('.mode i').toggleClass("fa-moon-o").toggleClass("fa-lightbulb-o");
        $('body').toggleClass("dark-only");
    });




    
})(jQuery);

$('.loader-wrapper').fadeOut('slow', function () {
    $(this).remove();
});

$(window).on('scroll', function () {
    if ($(this).scrollTop() > 600) {
        $('.tap-top').fadeIn();
    } else {
        $('.tap-top').fadeOut();
    }
});



$('.tap-top').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});

function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}
(function ($, window, document, undefined) {
    "use strict";
    var $ripple = $(".js-ripple");
    $ripple.on("click.ui.ripple", function (e) {
        var $this = $(this);
        var $offset = $this.parent().offset();
        var $circle = $this.find(".c-ripple__circle");
        var x = e.pageX - $offset.left;
        var y = e.pageY - $offset.top;
        $circle.css({
            top: y + "px",
            left: x + "px"
        });
        $this.addClass("is-active");
    });
    $ripple.on(
        "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
        function (e) {
            $(this).removeClass("is-active");
        });


})(jQuery, window, document);


// active link

$(".chat-menu-icons .toogle-bar").click(function () {
    $(".chat-menu").toggleClass("show");
});


// Language
var tnum = 'en';

$(document).ready(function () {

    if (localStorage.getItem("primary") != null) {
        var primary_val = localStorage.getItem("primary");
        $("#ColorPicker1").val(primary_val);
        var secondary_val = localStorage.getItem("secondary");
        $("#ColorPicker2").val(secondary_val);
    }


    $(document).click(function (e) {
        $('.translate_wrapper, .more_lang').removeClass('active');
    });
    $('.translate_wrapper .current_lang').click(function (e) {
        e.stopPropagation();
        $(this).parent().toggleClass('active');

        setTimeout(function () {
            $('.more_lang').toggleClass('active');
        }, 5);
    });


    /*TRANSLATE*/
    translate(tnum);

    $('.more_lang .lang').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.more_lang').removeClass('active');

        var i = $(this).find('i').attr('class');
        var lang = $(this).attr('data-value');
        var tnum = lang;
        translate(tnum);

        $('.current_lang .lang-txt').text(lang);
        $('.current_lang i').attr('class', i);


    });
});

function translate(tnum) {
    $('.lan-1').text(trans[0][tnum]);
    $('.lan-2').text(trans[1][tnum]);
    $('.lan-3').text(trans[2][tnum]);
    $('.lan-4').text(trans[3][tnum]);
    $('.lan-5').text(trans[4][tnum]);
    $('.lan-6').text(trans[5][tnum]);
    $('.lan-7').text(trans[6][tnum]);
    $('.lan-8').text(trans[7][tnum]);
    $('.lan-9').text(trans[8][tnum]);
}

var trans = [{
        en: 'General',
        pt: 'Geral',
        es: 'Generalo',
        fr: 'GÃ©nÃ©rale',
        de: 'Generel',
        cn: 'ä¸€èˆ¬',
        ae: 'Ø­Ø¬Ù†Ø±Ø§Ù„ Ù„ÙˆØ§Ø¡'
    }, {
        en: 'Dashboards,widgets & layout.',
        pt: 'PainÃ©is, widgets e layout.',
        es: 'Paneloj, fenestraÄµoj kaj aranÄo.',
        fr: "Tableaux de bord, widgets et mise en page.",
        de: 'Dashboards, widgets en lay-out.',
        cn: 'ä»ªè¡¨æ¿ï¼Œå°å·¥å…·å’Œå¸ƒå±€ã€‚',
        ae: 'Ù„ÙˆØ­Ø§Øª Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª ÙˆØ§Ù„Ø£Ø¯ÙˆØ§Øª ÙˆØ§Ù„ØªØ®Ø·ÙŠØ·.'
    }, {
        en: 'Dashboards',
        pt: 'PainÃ©is',
        es: 'Paneloj',
        fr: 'Tableaux',
        de: 'Dashboards',
        cn: ' ä»ªè¡¨æ¿ ',
        ae: 'ÙˆØ­Ø§Øª Ø§Ù„Ù‚ÙŠØ§Ø¯Ø© '
    }, {
        en: 'Default',
        pt: 'PadrÃ£o',
        es: 'Vaikimisi',
        fr: 'DÃ©faut',
        de: 'Standaard',
        cn: 'é›»å­å•†å‹™',
        ae: 'ÙˆØ¥ÙØªØ±Ø§Ø¶ÙŠ'
    }, {
        en: 'Ecommerce',
        pt: 'ComÃ©rcio eletrÃ´nico',
        es: 'Komerco',
        fr: 'Commerce Ã©lectronique',
        de: 'E-commerce',
        cn: 'é›»å­å•†å‹™',
        ae: 'ÙˆØ§Ù„ØªØ¬Ø§Ø±Ø© Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ©'
    }, {
        en: 'Widgets',
        pt: 'Ferramenta',
        es: 'Vidin',
        fr: 'Widgets',
        de: 'Widgets',
        cn: 'å°éƒ¨ä»¶',
        ae: 'ÙˆØ§Ù„Ø­Ø§Ø¬ÙŠØ§Øª'
    }, {
        en: 'Page layout',
        pt: 'Layout da pÃ¡gina',
        es: 'PaÄa aranÄo',
        fr: 'Tableaux',
        de: 'Mise en page',
        cn: 'é é¢ä½ˆå±€',
        ae: 'ÙˆØªØ®Ø·ÙŠØ· Ø§Ù„ØµÙØ­Ø©'
    }, {
        en: 'Applications',
        pt: 'FormulÃ¡rios',
        es: 'Aplikoj',
        fr: 'Applications',
        de: 'Toepassingen',
        cn: 'æ‡‰ç”¨é ˜åŸŸ',
        ae: 'ÙˆØ§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª'
    }, {
        en: 'Ready to use Apps',
        pt: 'Pronto para usar aplicativos',
        es: 'Preta uzi Apps',
        fr: ' Applications prÃªtes Ã  lemploi ',
        de: 'Klaar om apps te gebruiken',
        cn: 'ä»ªè¡¨æ¿',
        ae: 'Ø¬Ø§Ù‡Ø² Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª'
    },

];

$(".mobile-title svg").click(function () {
    $(".mega-menu-container").toggleClass("d-block");
});

$(".onhover-dropdown").on("click", function () {
    $(this).children('.onhover-show-div').toggleClass("active");
});

// if ($(window).width() <= 991) {
//     $(".left-header .link-section").children('ul').css('display', 'none');
//     $(this).parent().children('ul').toggleClass("d-block").slideToggle();
// }


if ($(window).width() < 991) {
    $('<div class="bg-overlay"></div>').appendTo($('body'));
    $(".bg-overlay").on("click", function () {
        $(".page-header").addClass("close_icon");
        $(".sidebar-wrapper").addClass("close_icon");
        $(this).removeClass("active");
    });

    $(".toggle-sidebar").on("click", function () {
        $(".bg-overlay").addClass("active");
    });
    $(".back-btn").on("click", function () {
        $(".bg-overlay").removeClass("active");
    });
}

$("#flip-btn").click(function(){
    $(".flip-card-inner").addClass("flipped")
});

$("#flip-back").click(function(){
    $(".flip-card-inner").removeClass("flipped")
})


 /* Sigin in button click */
 $("#btn_signin").click(function () {
    $.ajax({
        url:"/login",
        type:"GET",
        data:{
           username : $("#username_login").val(),
           password : $("#password_login").val()
         },
        success: function(data){
            if(data == "OK"){
                window.location.href="/mainmenu"
            }
            if(data == 'admin'){
                window.location.href="/admin"
            }
        },
        error:function (data) {
            if(data.statusCode == 401)
            alert('Please Check Email and Password')
            Swal.fire('Login Failed!', 'Please check email and password', 'info')
            $("#username_login").value = "1233131";
            $("#password_login").value = '';
        }
    });
});

$("#btn_add_new_user").on('click',function(e){
    var username;
    var password;
    var email;
    Swal.fire({
        title: 'New User',
        html: `<input type="text" id="username" class="swal2-input" placeholder="Username"autocomplete="off">
        <input type="password" id="password" class="swal2-input" placeholder="Password" autocomplete="off">
        <input type="email" id="email" class="swal2-input" placeholder="Email" autocomplete="off">`,
        confirmButtonText: 'OK',
        focusConfirm: false,
        preConfirm: () => {
            username = Swal.getPopup().querySelector('#username').value
            password = Swal.getPopup().querySelector('#password').value
            email = Swal.getPopup().querySelector('#email').value
          if (!username || !password || !email) {
            Swal.showValidationMessage(`Please enter required data`)
          }
          return { username: username, password: password , email: email}
        }
      }).then((result) => {
        if (result.isConfirmed) {
        $.ajax({
            url:"/create_user",
            type:"POST",
            data:{
               username : username,
               password : password,
               email : email
             },
            success: function(data){
                console.log(data)              
                Swal.fire('User created!', '', 'success');      
                $('#user_ajax_data_array').DataTable().ajax.reload(); 
            },
            error:function (data) {
                console.log(data);
                if(data.status == 422){
                    Swal.fire('Duplicate User Eamil!','Cannot create user', 'info')
                }
                else{
                    Swal.fire('Cannot create user', '', 'info')
                }
            }
        });
        }
      })
})

/* link import master page */
$("#link_importmenu").click(function () {
    window.location.href="/importmenu"
});

$("#link_upload_files").click(function(){
    window.location.href="/uploadfiles"
});

$("#link_logout").on('click',function(e){
    window.location.href="/logout"
})

$("#link_summery_report").on("click",function(){
    window.location.href='/summeryreport'
});

$('#img_mainmenu').click(function(){
    window.location.href="/mainmenu"
});

$('#link_new_count').on('click',function(){
    window.location.href="/newcount"
})

/* Import to Datatale */
$('#generate_report_ajax_data_array').on( 'click', 'tbody td:not(:first-child)', function (e) {
    editor.inline( this );
} );

$('#generate_report_ajax_data_array').DataTable({
    "dom": 'Blfrtip',
    "buttons": [{
        "extend": 'csv',
        "text": 'Export Csv',
        "title": 'export',
        "action": newexportaction,
        "className" :'btn btn-success'
    },
    {
        "extend": 'excel',
        "text": 'Export Excel',
        "title": 'export',
        "action": newexportaction,
        "className" :'btn btn-success'
    }
    ],
    'fixedHeader': true,
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    "ajax": {
        "url":"/load_generate_report_serverside"
    },
    "aaSorting" : [],
    "columns":
                [
                    { "data": "id" },
                    { "data": "location" },
                    { "data": "barcode" },
                    { "data": "itemcode" },
                    { "data": "description" },
                    { "data": "onhand_qty" },
                    { "data": "scan_qty" },
                    { "data": "diff" },
                    { "data": "scan_date" },
                    { "data": "inspector" }
                ]
});

var table = $('#import_ajax_data_array').DataTable({
    'fixedHeader': true,
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    "ajax": {
        "url":"/loadimportdata_serverside"
    },
    "aaSorting" : [],
    "columns":
                [
                    { "data": "id" },
                    { "data": "barcode" },
                    { "data": "itemcode" },
                    { "data": "description" },
                    { "data": "onhand_qty" }
                ]
});

var table = $('#user_ajax_data_array').DataTable({
    'fixedHeader': true,
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    "ajax": {
        "url":"/load_user_serverside"
    },
    "aaSorting" : [],
    "columns":
                [
                    { "data": "id" },
                    { "data": "username" },
                    { "data": "password" },
                    { "data": "email" },
                    { "data": "status" },
                    { 'data': null, "render": function (data, type, row, meta)
                     { return '<td> <button id="btn_delete" class="btn btn-danger btn-xs dt-delete" type="button" data-original-title="btn btn-danger btn-xs" title="">Delete</button>'} }
                    // '<button class="btn btn-success btn-xs" type="button" data-original-title="btn btn-danger btn-xs" title="">Edit</button> </td>' } }
                ],
    "columnDefs": 
                [
                    { "orderable": false, "targets": 5 }
                ]
});

$('#user_ajax_data_array tbody').on('click', '.dt-delete', function () {
    var tableData = $(this).closest("tr").children("td").map(function () {
        return $(this).text();
    }).get();

    // alert("Your data is: " + $.trim(tableData[0]) + " , " + $.trim(tableData[1]) + " , " + $.trim(tableData[2])+ " , " + $.trim(tableData[3])+ " , " + $.trim(tableData[4]));
    Swal.fire({
        title: 'Do you want to delete this user?',
        showCancelButton: true,
        confirmButtonText: 'DELETE',
      }).then((result) => {
        if(result.isConfirmed){
            $.ajax({
                url:"/delete_user",
                type:"POST",
                data:{
                   id : tableData[0],
                   username : tableData[1]
                 },
                success: function(data){
                    console.log(data)              
                    Swal.fire('User deleted!', '', 'success');      
                    $('#user_ajax_data_array').DataTable().ajax.reload(); 
                },
                error:function (data) {
                    console.log(data);
                    if(data.status == 500){
                        Swal.fire('Cannot Delete user!','', 'info')
                    }
                    else{
                        Swal.fire('ERROR', '', 'error')
                    }
                }
            });
        }
      })
});

function newexportaction(e, dt, button, config) {
    var self = this;
    var oldStart = dt.settings()[0]._iDisplayStart;
    dt.one('preXhr', function (e, s, data) {
        // Just this once, load all data from the server...
        data.start = 0;
        data.length = 140072;
        dt.one('preDraw', function (e, settings) {
            // Call the original action function
            if (button[0].className.indexOf('buttons-copy') >= 0) {
                $.fn.dataTable.ext.buttons.copyHtml5.action.call(self, e, dt, button, config);
            } else if (button[0].className.indexOf('buttons-excel') >= 0) {
                $.fn.dataTable.ext.buttons.excelHtml5.available(dt, config) ?
                    $.fn.dataTable.ext.buttons.excelHtml5.action.call(self, e, dt, button, config) :
                    $.fn.dataTable.ext.buttons.excelFlash.action.call(self, e, dt, button, config);
            } else if (button[0].className.indexOf('buttons-csv') >= 0) {
                $.fn.dataTable.ext.buttons.csvHtml5.available(dt, config) ?
                    $.fn.dataTable.ext.buttons.csvHtml5.action.call(self, e, dt, button, config) :
                    $.fn.dataTable.ext.buttons.csvFlash.action.call(self, e, dt, button, config);
            } else if (button[0].className.indexOf('buttons-pdf') >= 0) {
                $.fn.dataTable.ext.buttons.pdfHtml5.available(dt, config) ?
                    $.fn.dataTable.ext.buttons.pdfHtml5.action.call(self, e, dt, button, config) :
                    $.fn.dataTable.ext.buttons.pdfFlash.action.call(self, e, dt, button, config);
            } else if (button[0].className.indexOf('buttons-print') >= 0) {
                $.fn.dataTable.ext.buttons.print.action(e, dt, button, config);
            }
            dt.one('preXhr', function (e, s, data) {
                // DataTables thinks the first item displayed is index 0, but we're not drawing that.
                // Set the property to what it was before exporting.
                settings._iDisplayStart = oldStart;
                data.start = oldStart;
            });
            // Reload the grid with the original page. Otherwise, API functions like table.cell(this) don't work properly.
            setTimeout(dt.ajax.reload, 0);
            // Prevent rendering of the full data to the DOM
            return false;
        });
    });
    // Requery the server with the new one-time export settings
    dt.ajax.reload();
}

$(document).ready(function(){  
    $('#upload_csv_form').on("change", function(e){   
        e.preventDefault();
        // $("#start-loader").show();    
        Swal.fire({
            title: 'Uploading File',
            html: 'Please wait a moment',
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
        var formData = new FormData(this); 
        console.log(formData)
        $.ajax({  
              url:"/upload",  
              method:"POST",  
              data: formData,
              processData: false,
              contentType: false,
              success: function(data){ 
                // $("#start-loader").hide();  
                Swal.close()  
              },
              error: function (e) {
                console.log("some error", e);
                $("#start-loader").hide(); 
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  })
              }
        })  
    });  

    $('#btn_import').click(function(e){   
        e.preventDefault();
        // $("#start-loader").show();
        Swal.fire({
            title: 'Importing Csv',
            html: 'Please wait a moment',
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })    
        $.ajax({  
              url:"/import",  
              method:"POST",  
              success: function(data){  
                $('#import_ajax_data_array').DataTable().ajax.reload();
                // $("#start-loader").hide(); 
                Swal.close();
                Swal.fire(
                    'Good job!',
                    'Successfully Imported',
                    'success'
                  )
                  $('#uploadfile').val('');
              },
              error: function (e) {
                // $("#start-loader").hide(); 
                console.log("some error", e);
                if(e.status == 422){
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'Csv file format is incorrect!',
                      })
                }
                if(e.status == 400){
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'Csv file must not be empty!',
                      })
                }
                if(e.status == 502){
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'Something wnet wrong!',
                      })
                }
                if(e.status == 404){
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'Please Select File!',
                      })
                }
                $('#uploadfile').val('');
              }
        })  
    });  
    
});  

$('#btn_generate').click(function(e){   
    e.preventDefault();
    // $("#start-loader").show();    
    Swal.fire({
        title: 'Generating Report',
        html: 'Please wait a moment',
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })   
    $.ajax({  
          url:"/generate_report",  
          method:"POST",  
          success: function(data){  
            $('#generate_report_ajax_data_array').DataTable().ajax.reload();
            // $("#start-loader").hide(); 
            var invalidfiles = data.substr(0, data.indexOf('/')); 
            var totalfiles = data.substr(data.indexOf('/'),data.length); 
            Swal.close();
            if(invalidfiles == 0){
                Swal.fire(
                    'Good job!',
                    'Report Generated',
                    'success',
                  )
            }
            else{
                Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: `${invalidfiles}${totalfiles} File(s) Wrong Format`
                  })
            }
                
          },
          error: function (e) {
           if(e.status == 404){
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'No files to generate report',
              })
           }
           else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
           }
          }
    })  
});  

$('#btn_new_count_id').on('click',function(){
    Swal.fire({
        title: 'Start new count?',
        text: 'All data will be deleted. Please make sure to save export file.',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
      }).then((result) => {
        if(result.isConfirmed){
            const id = $('#stock_take_id').val()
            $.ajax({
              url:"/newcount",
              type:"POST",
              data:{id : id},
              success: function(data){
                  Swal.fire('New count', '', 'success');      
                  $('#import_ajax_data_array').DataTable().ajax.reload(); 
                  $('#stock_take_id').val(data)
              },
              error:function (data) {
                  console.log(data);
                  if(data.status == 500){
                      Swal.fire('Cannot create new count!','', 'info')
                  }
                  else{
                      Swal.fire('ERROR', '', 'error')
                  }
              }
          });
        }
      })
})
            
   


 