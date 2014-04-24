$(document).ready(function() {
  $('#post-form textarea').liveUrl({
    loadStart : function(){
        $('.liveurl-loader').show();
    },
    loadEnd : function(){
        $('.liveurl-loader').hide();
    },
    success : function(data)
    {
        var output = $('.liveurl');
        output.find('.title').text(data.title);
        output.find('.description').text(data.description);
        output.find('.url').text(data.url);
        output.find('.image').empty();

        output.find('.close').one('click', function()
        {
            var liveUrl     = $(this).parent();
            liveUrl.hide('fast');
            liveUrl.find('.video').html('').hide();
            liveUrl.find('.image').html('');
            liveUrl.find('.controls .prev').addClass('inactive');
            liveUrl.find('.controls .next').addClass('inactive');
            liveUrl.find('.thumbnail').hide();
            liveUrl.find('.image').hide();

            $('textarea').trigger('clear');
            curImages = new Array();
        });

        output.show('fast');

        if (data.video != null) {
            var ratioW        = data.video.width  /350;
            data.video.width  = 350;
            data.video.height = data.video.height / ratioW;

            var video =
            '<object width="' + data.video.width  + '" height="' + data.video.height  + '">' +
                '<param name="movie"' +
                      'value="' + data.video.file  + '"></param>' +
                '<param name="allowScriptAccess" value="always"></param>' +
                '<embed src="' + data.video.file  + '"' +
                      'type="application/x-shockwave-flash"' +
                      'allowscriptaccess="always"' +
                      'width="' + data.video.width  + '" height="' + data.video.height  + '"></embed>' +
            '</object>';
            output.find('.video').html(video).show();


        }
    },
    addImage : function(image)
    {
        var output  = $('.liveurl');
        var jqImage = $(image);
        jqImage.attr('alt', 'Preview');

        if ((image.width / image.height)  > 7
        ||  (image.height / image.width)  > 4 ) {
            // we dont want extra large images...
            return false;
        }

        curImages.push(jqImage.attr('src'));
        output.find('.image').append(jqImage);


        if (curImages.length == 1) {
            // first image...

            output.find('.thumbnail .current').text('1');
            output.find('.thumbnail').show();
            output.find('.image').show();
            jqImage.addClass('active');

        }

        if (curImages.length == 2) {
            output.find('.controls .next').removeClass('inactive');
        }

        output.find('.thumbnail .max').text(curImages.length);
    }
});


$('.liveurl ').on('click', '.controls .button', function() {
    var self        = $(this);
    var liveUrl     = $(this).parents('.liveurl');
    var content     = liveUrl.find('.image');
    var images      = $('img', content);
    var activeImage = $('img.active', content);

    if (self.hasClass('next'))
         var elem = activeImage.next("img");
    else var elem = activeImage.prev("img");

    if (elem.length > 0) {
        activeImage.removeClass('active');
        elem.addClass('active');
        liveUrl.find('.thumbnail .current').text(elem.index() +1);

        if (elem.index() +1 == images.length || elem.index()+1 == 1) {
            self.addClass('inactive');
        }
    }

    if (self.hasClass('next'))
         var other = elem.prev("img");
    else var other = elem.next("img");

    if (other.length > 0) {
        if (self.hasClass('next'))
               self.prev().removeClass('inactive');
        else   self.next().removeClass('inactive');
   } else {
        if (self.hasClass('next'))
               self.prev().addClass('inactive');
        else   self.next().addClass('inactive');
   }
 });
});
