/**
 * Created by maduranga on 11/1/16.
 */
    //Checking Cookie value to determine preview mode
var previewStatus=Cookies.get('previewmode');
if (previewStatus!="on") {
    window.addEventListener('load', function() {

        var editor,FIXTURE_TOOLS;
        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        var tid = dir.toString().split('/')[2];
        var appname = dir.toString().split('/')[3];
        var page = loc.split("/").pop();
        //For TEXT ONLY purposes
        TEXT_ONLY_TOOLS = [['image','undo', 'redo'] ,['remove']];

        //Loading Styles
        ContentTools.StylePalette.add([
            new ContentTools.Style('Author', 'author', ['p']), new ContentTools.Style('new','new',['a'])
        ]);

        //Loading Image Uploader
        ContentTools.IMAGE_UPLOADER = imageUploader;

        //Loading Content Tools Palette
        editor = ContentTools.EditorApp.get();

        //Toolstate for all Tools
        editor.myToolsState = 'all-tools';

        editor.init('[data-editable], [data-fixture]', 'data-name');

        // START OF IMAGE UPLOADER
        function imageUploader(dialog) {

            var image, xhr, xhrComplete, xhrProgress;
            // Set up the event handlers
            dialog.addEventListener('imageuploader.cancelupload', function () {
                // Cancel the current upload
                // Stop the upload
                if (xhr) {
                    xhr.upload.removeEventListener('progress', xhrProgress);
                    xhr.removeEventListener('readystatechange', xhrComplete);
                    xhr.abort();
                }
                // Set the dialog to empty
                dialog.state('empty');
            });

            dialog.addEventListener('imageuploader.clear', function () {
                // Clear the current image
                dialog.clear();
                image = null;
            });

            dialog.addEventListener('imageuploader.fileready', function (ev) {

                // Upload a file to the server
                var file = ev.detail().file;

                // Define functions to handle upload progress and completion
                xhrProgress = function (ev) {
                    // Set the progress for the upload
                    dialog.progress((ev.loaded / ev.total) * 100);
                }

                xhrComplete = function (ev) {

                    var response;
                    // Check the request is complete
                    if (ev.target.readyState != 4) {
                        return;
                    }
                    // Clear the request
                    xhr = null
                    xhrProgress = null
                    xhrComplete = null
                    // Handle the result of the upload
                    if (parseInt(ev.target.status) == 200) {
                        // Unpack the response (from JSON)
                        response = JSON.parse(ev.target.responseText);

                        // Store the image details
                        image = {
                            size: response.size ,
                            url: response.url
                        };

                        // Populate the dialog
                        dialog.populate(image.url, image.size);

                    } else {
                        // The request failed, notify the user
                        new ContentTools.FlashUI('no');
                    }
                }

                // Set the dialog state to uploading and reset the progress bar to 0
                dialog.state('uploading');
                dialog.progress(0);

                // Build the form data to post to the server
                var formData = new FormData();
                formData.append('appimage', file);

                // Make the request
                xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', xhrProgress);
                xhr.addEventListener('readystatechange', xhrComplete);
                xhr.open('POST', '/captive/api/img/uploadimg/'+tid+'/'+appname, true);
                xhr.send(formData);

            });
            // Save Event Trigger
            dialog.addEventListener('imageuploader.save', function () {

                //IMAGE UPLOADING - BEGIN

                dialog.busy(false);

                dialog.save(
                    image.url,
                    image.size
                    /*{
                     'alt': image.alt,
                     'data-ce-max-width': image.size[0]
                     }*/
                );

                dialog.busy(true);
                //setTimeout(clearBusy, 1500);
                // IMAGE UPLOADING - END
            });
        }
        // End of function Imageuploader

        if(page == "landing.html"){
            //Saving Edited Landing Content
            editor.addEventListener('saved', function() {
                //Sending Edited data to API
                datasample = $('.content-landing').prop("outerHTML");
                // AJAX Call Start
                $.ajax({
                    url : "/captive/api/writefile/"+tid + "/" +appname+"/landing",
                    type : "POST",
                    contentType :"application/text",
                    data : datasample,
                    success : function(res){
                    },
                    error : function(e){
                    }
                });
                // AJAX Call End
            });
            //Saving Edited Content-END

        }else {
            //Saving Edited SignIn / SignUp Content
            editor.addEventListener('saved', function() {
                //Sending Edited data to API
                datasample = $('.content').prop("outerHTML");
                // AJAX Call Start
                $.ajax({
                    url : "/captive/api/writefile/"+tid + "/" +appname,
                    type : "POST",
                    contentType :"application/text",
                    data : datasample,
                    success : function(res){
                    },
                    error : function(e){
                    }
                });
                // AJAX Call End
            });
            //Saving Edited Content-END
        }


        // FIXTURE TOOLS FUNCTION- BEGIN
        FIXTURE_TOOLS = [['undo', 'redo', 'remove']];
        IMAGE_TOOLS =   [['image', 'undo' , 'redo'] , ['remove']];

        ContentEdit.Root.get().bind('focus', function(element) {

            var tools;
            if (element.isFixed()) {
                tools = FIXTURE_TOOLS;
            } else if ( element.domElement().closest('.text-only')){
                tools = IMAGE_TOOLS;
            } else {
                tools = ContentTools.DEFAULT_TOOLS;
            }
            if (editor.toolbox().tools() !== tools) {
                return editor.toolbox().tools(tools);
            }
        });

    });

}
//Retrieving Cookie Value for Previewer
function getCookie(previewMode) {
    var previewStatus = previewMode + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(previewStatus.length, c.length);
        }
    }
    return "";
}
