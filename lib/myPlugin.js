(function ( $ ) {
 
    $.fn.pleaseWait = function( options ) {
 
        // This is the easiest way to have default options.
     switch (options){   
        case true:
            var $overlay = $('<div></div >');
            $overlay.width(screen.width);
            $overlay.height(screen.height);
            $overlay.css('z-index',100);
            $overlay.css('backgroundColor','black');
            $overlay.css('opacity',0.4);
            $overlay.css('position','absolute');
            $overlay.css('top',0);
            $overlay.css('left',0);

            var $waitIcon=$('<div><img src="assets/waiter.gif"></img>');
            $waitIcon.css('position','absolute');
            $waitIcon.css('top','50%');
            $waitIcon.css('left','50%');
            $waitIcon.css('z-index',101);

            $overlay.attr('id','pleaseWaitOverlay');
            $waitIcon.attr('id','pleaseWaitSpinner');
            
            var body=$('body')
            $overlay.appendTo(body);
            $waitIcon.appendTo(body);
         break;   

         case false:
            $('#pleaseWaitOverlay').remove();
            $('#pleaseWaitSpinner').remove();
         break;
            
         default:
            console.error('Expecting bolean in pleaseWait as parameter');
            
     }
        console.log(options, 'height:',$(this).height(),'width',$(this).width());
        // Greenify the collection based on the settings variable.
       
 
    };
 
}( jQuery ));