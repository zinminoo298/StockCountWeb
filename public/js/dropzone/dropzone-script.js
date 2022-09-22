
var DropzoneExample = function () {
    var DropzoneDemos = function () {
        Dropzone.options.singleFileUpload = {
            paramName: "file",
            maxFiles: 1,
            maxFilesize: 5,
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
        };
        Dropzone.options.multiFileUpload = {
            paramName: "file",
            maxFiles: 10,
            maxFilesize: 10,
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
        };
        Dropzone.options.fileTypeValidation = {
            paramName: "file",
            maxFiles: 10,
            maxFilesize: 10, 
            acceptedFiles: ".csv",
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
        };

        function paramNameForSend() {
            return "userParamName";
        }

        Dropzone.options.uploadWidget = {
            paramName: 'file',
            maxFilesize: 50, // MB
            maxFiles: 10,
            // headers: {
            //   'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value,
            // },
            acceptedFiles: '.csv',
            url: '/upload_multiple_files',
            autoProcessQueue: false,
            uploadMultiple: true,
            paramName: paramNameForSend,
            method: 'post',
            parallelUploads: 10,
            init: function() {
                var attachment;
                let files = 0
                this.on("addedfile", function(file) {
                    $('.dz-progress').hide();
                })
                // this.on('removedfile', function(file) {
                //     files--
                //     if (files === 0) attachment = undefined
                // })
                // this.on('uploadprogress', function (file, progress) {
                //     console.log('progress');
                // });

                var myDropzone = this;
                  
                $("#btn-upload-files").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if(myDropzone.files.length == 0){
                        console.log("NO FILE")
                    }
                    else{
                        $("#start-loader").show();    
                        myDropzone.processQueue();
                    }
                    console.log("CLICKED")
                }); 


                $("#btn-clear-files").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    myDropzone.removeAllFiles(true)
                    console.log("CLEARED")
                });

                this.on('success', function(file, resp){
                    // $("#start-loader").hide(); 
                    // Swal.fire(
                    //     'Good job!',
                    //     'You clicked the button!',
                    //     'success'
                    //   )
                      $.ajax({
                        url: "/get_files",
                        method: "GET",
                        success: function (data) {
                          console.log(data)
                          var items = [];
                          $('#ul_filelist').empty()
                          $.each(data, function (i, item) {
                            console.log(data[0].fname)
                            items.push('<li class="file-box">' +
                              '<div class="file-top">  <i class="fa fa-file-text-o txt-primary"></i>' +
                              '<div>' +
                              '<a href="#" title="delete" class="itemDelete"><i class="fa fa-times f-20 ellips" style="color: red;"></i></a>' +
                              '</div >' +
                              '</div>' +
                              '<div class="file-bottom">' +
                              '<h6 id="filename_id"> ' + data[i].fname + ' </h6>' +
                              '<p class="mb-1">' + data[i].fsize + '</p>' +
                              '<p> <b>created at : </b>' + data[i].ftime + '</p>' +
                              '</div>' +
                              '</li>')
              
                          });
                          $('#ul_filelist').append(items.join(''));
                          $("#start-loader").hide(); 
                          Swal.fire(
                            'Good job!',
                            'You clicked the button!',
                            'success'
                          )
                          myDropzone.removeAllFiles(true)
              
                        },
                        error: function (e) {
                          console.log("some error", e);
                          $("#start-loader").hide();
                          alert("Cannot Read Files");
                        }
                      })
                    console.log(file);
                    console.log(resp);
                });
            },
            // uploadprogress: function(file, progress, bytesSent) {
            //     if (file.previewElement) {
            //         var progressElement = file.previewElement.querySelector("[data-dz-uploadprogress]");
            //         progressElement.style.width = progress + "%";
            //         progressElement.querySelector(".progress-text").textContent = progress + "%";
            //     }
            // },
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
          };
    }
    return {
        init: function() {
            DropzoneDemos();
        }
    };
}();
DropzoneExample.init();