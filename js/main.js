// Define our different drinks
var drinkTypes = {
	// Pint of Lager
	"1": {
	    glass: "uk-pint",
	    liquid: "drink-lager",
	    bubbles: true,
	    bubblesMin: "20",
	    bubblesMax: "40",
	    bubblesSmall: "2",
	    bubblesBig: "6"
	},
	
	// Pint of Ale
	"2": {
	    glass: "uk-pint",
	    liquid: "drink-ale",
	    bubbles: false,
	    bubblesMin: "0",
	    bubblesMax: "0",
	    bubblesSmall: "0",
	    bubblesBig: "0"
	},
	
	// Pint of Stout
	"3": {
	    glass: "uk-pint",
	    liquid: "drink-stout",
	    bubbles: false,
	    bubblesMin: "0",
	    bubblesMax: "0",
	    bubblesSmall: "0",
	    bubblesBig: "0"
	},
	
	// Bottle of Lager
	"4": {
	    glass: "beer-bottle",
	    liquid: "drink-lager-light",
	    bubbles: true,
	    bubblesMin: "10",
	    bubblesMax: "30",
	    bubblesSmall: "2",
	    bubblesBig: "4"
	},
	
	// Gin & Tonic
	"5": {
	    glass: "hiball",
	    liquid: "drink-gintonic",
	    bubbles: true,
	    bubblesMin: "10",
	    bubblesMax: "30",
	    bubblesSmall: "2",
	    bubblesBig: "4"
	},
	
	// Coke Mixer
	"6": {
	    glass: "hiball",
	    liquid: "drink-cola",
	    bubbles: true,
	    bubblesMin: "10",
	    bubblesMax: "30",
	    bubblesSmall: "2",
	    bubblesBig: "4"
	},
	
	// Bottle of Alcopop
	"7": {
	    glass: "beer-bottle alcopop-bottle",
	    liquid: "drink-blue-alcopop",
	    bubbles: true,
	    bubblesMin: "10",
	    bubblesMax: "30",
	    bubblesSmall: "1",
	    bubblesBig: "2"
	},

}


// Set up the store
var preferences = {};

// Is local storage supported?
preferences.supported = function() {

    try {

        return window.localStorage !== undefined;

    } catch (e) {

        return false;

    }

};

// Get a key
preferences.get = function(key) {

    // Does the browser support local storage?
    if (this.supported()) {

        return window.localStorage[key];

    }

};

// Set a key
preferences.set = function(key, value) {

    // Does the browser support local storage?
    if (this.supported()) {

        return window.localStorage[key] = value;

    }

};

// Unset a key
preferences.unset = function(key) {

    // Does the browser support local storage?
    if (this.supported()) {

        return window.localStorage.removeItem(key)

    }

};

$(document).ready(function() {

    var BEER_O_CLOCK = 17; // 5 PM
    const GLASS_FULL = 100;

    var beer = {},
        inde,
        full_query_string = window.location.href.split('?')[1],
        $hours = $('.countdown-hours > .digit'),
        $minutes = $('.countdown-minutes > .digit'),
        $seconds = $('.countdown-seconds > .digit');

    // Split it up into key value pairs
    full_query_string = typeof full_query_string == 'undefined' ? [] : full_query_string.split('&');

    // Loop through the query string and set up an object based on it
    query_string = {};
    
    for (index in full_query_string) {

        // Split up the key value pair
        item = full_query_string[index].split('=');

        // Add it to our object
        query_string[item[0]] = item[1];

    }

    // Allow overriding of beer o'clock for debug
    if (typeof query_string.t != 'undefined') {

        BEER_O_CLOCK = query_string.t;

    }

    // Is it the weekend? If so it's always beer o'clock!
    beer.is_weekend = function() {

        var now = new Date;

        // Saturday = 6 and Sunday = 0
        return now.getDay() === 6 || now.getDay() === 0;

    };

    // Is it beer o'clock? i.e the weekend or after beer o'clock on the current day
    beer.can_haz = function() {

        return this.is_weekend() || (new Date).getHours() >= BEER_O_CLOCK;

    };

    // Add leading zeros to numbers
    beer.leading_zero = function(number) {

        return number < 10 ? '0' + number : number;

    };

    // Format a Date object a bit more nicely
    beer.format_time = function(date) {

        var hours = this.leading_zero(date.getHours()),
            minutes = this.leading_zero(date.getMinutes()),
            seconds = this.leading_zero(date.getSeconds());

        return {
            hours: hours.toString().split(''),
            minutes: minutes.toString().split(''),
            seconds: seconds.toString().split('')
        };

    };

    // A Date object for when beer o'clock is
    beer.get_date = function() {

        var beer_o_clock = new Date;

        // If it's already past beer o'clock then we need to wait till tomorrow
        if (beer_o_clock.getHours() >= BEER_O_CLOCK) {

            beer_o_clock.setDate(beer_o_clock.getDate() + 1);

        }

        beer_o_clock.setHours(BEER_O_CLOCK);
        beer_o_clock.setMinutes(0);
        beer_o_clock.setSeconds(0);

        return beer_o_clock;

    };

    // How long till you can haz beer!
    beer.how_long = function() {

        var beer_o_clock = this.get_date(),
            now = this.can_haz() ? beer_o_clock : new Date;

        return new Date(beer_o_clock - now);

    };

    // How full should the beer glass be?
    beer.how_long_percentage = function() {

        if (this.can_haz()) {

            return GLASS_FULL;

        }

        var now = new Date / 1000,
            beer = this.get_date() / 1000;

        return parseInt(GLASS_FULL - (((beer - now) / 86400) * 100));

    };

    beer.pour = function() {

        // Update the page content
        var time = beer.how_long();
        var pretty_time = beer.format_time(time);

        // Update the hours display
        $.each($hours, function(index, value) {
            
            $hours[index].innerHTML = pretty_time.hours[index];

        });

        // Update the minutes display
        $.each($minutes, function(index, value) {
            
            $minutes[index].innerHTML = pretty_time.minutes[index];

        });

        // Update the seconds display
        $.each($seconds, function(index, value) {
            
            $seconds[index].innerHTML = pretty_time.seconds[index];

        });

        // Update the title
        if (beer.can_haz()) {

            document.title = "It's Beer o'clock now!";

        } else {

            var time_string = '';

            if (time.getHours() > 0) {

                time_string += time.getHours() + 'h ';

            }

            if (time.getMinutes() > 0) {

                time_string += time.getMinutes() + 'm ';

            }

            time_string += time.getSeconds() + 's ';

            document.title = time_string;
            // window.location.hash = time_string;

        }

        // Fill up that beer glass!
        $(".tasty-beverage").css({
            height: beer.how_long_percentage() + '%'
        });

    }
    
    var userSettings = preferences.get('user-settings');
    
    beer.release_the_bubblez = function(drinkId) {
        
        // Get variables
        var $bubbles = $('.bubbles');
        
        // Get bubble settings
        var drink = drinkTypes[drinkId];
        var minBubbleCount = parseFloat(drink.bubblesMin), // Minimum number of bubbles
            maxBubbleCount = parseFloat(drink.bubblesMax), // Maximum number of bubbles
            minBubbleSize = parseFloat(drink.bubblesSmall), // Smallest possible bubble diameter (px)
            maxBubbleSize = parseFloat(drink.bubblesBig); // Largest possible bubble diameter (px)
                
        // If drink has bubbles, generate our bubbles from the above options
        $bubbles.empty();
        if (drink.bubbles == true) {
	        var bubbleCount = minBubbleCount + Math.floor(Math.random() * (maxBubbleCount + 1));
	        
	        for (var i = 0; i < bubbleCount; i++) {
	            $bubbles.append('<div class="bubble-container"><div class="bubble"></div></div>');
	        }
        }

        // Make each bubble random
        $bubbles.find('> .bubble-container').each(function() {

            // Randomise their size
            var sizeRand = minBubbleSize + Math.floor(Math.random() * (maxBubbleSize + 1));
            
            // Randomly position the bubbles
            var posRand = Math.floor(Math.random() * 101);
            
            // Randomise the time they start rising
            var delayRand = Math.floor(Math.random() * 16);
            
            // Randomise their speed
            var speedRand = 3 + Math.floor(Math.random() * 9);
            
            // Cache the this selector
            var $this = $(this);

            // Stick the above to the bubble container
            $this.css({
                'left' : posRand + '%',
                
                '-webkit-animation-duration' : speedRand + 's',
                '-moz-animation-duration' : speedRand + 's',
                '-ms-animation-duration' : speedRand + 's',
                'animation-duration' : speedRand + 's',
                
                '-webkit-animation-delay' : delayRand + 's',
                '-moz-animation-delay' : delayRand + 's',
                '-ms-animation-delay' : delayRand + 's',
                'animation-delay' : delayRand + 's'
            });
            
            // And set the bubble size
            $this.children('.bubble').css({
                'width' : sizeRand + 'px',
                'height' : sizeRand + 'px'
            });

        });
    };
    
    beer.bubbles_on = function() {
    	// Create the bubbles
    	beer.release_the_bubblez(userSettings);
    	
    	// Show the bubbles
    	$('.bubbles').fadeIn('1000', function(){
    		
    		// Start the animation
	    	$('.bubble-container').css({
	    		'animation-play-state' : 'running',
                '-webkit-animation-play-state' : 'running'
	    	});
	    	
	    	// Change the toggle text
	    	$('.bubble-toggle').text('Bubbles Off');
    	});
    }
    
    beer.bubbles_off = function() {    	
    	// Hide the bubbles
    	$('.bubbles').fadeOut('2500', function() {
    		// Stop the animation
	    	$('.bubble-container').css({
	    		'animation-play-state' : 'paused',
                '-webkit-animation-play-state' : 'paused'
	    	});
	    	
	    	// Remove the bubble divs
	    	$('.bubbles').empty();
	    	
	    	// Change the toggle text
	    	$('.bubble-toggle').text('Bubbles On');
    	});
    }
    
    beer.bubble_controls = function() {
    	var bubbleState = preferences.get('bubble-status');
                
    	if (bubbleState === 'false') {    	
	    	preferences.set('bubble-status', 'true');
	    	beer.bubbles_on();
    	} else {
	    	preferences.set('bubble-status', 'false');
	    	beer.bubbles_off();
    	}
    }    
    
    // User Settings
    beer.setDrink = function(userDrink) {
    	// Save the drink to user preferences
	    preferences.set('user-settings', userDrink);
	    
	    // Get the drink settings
	    var drink = drinkTypes[userDrink];
	    
	    // Clear existing and set the drink type
	    $('#drink-type').removeClass();
		$('#drink-type').fadeOut('100', function() {
			$(this).addClass(drink.glass + ' ' + drink.liquid).fadeIn('250')
		});
	    
	    // Get rid of existing bubbles
	    $('.bubbles').empty();
	    
	    // If drink has bubbles, and user hasn't disabled them, run the bubble cannon
		if ((drink.bubbles == true) && (preferences.get('bubble-status') !== 'false')) {
			beer.release_the_bubblez(userDrink);
		}
		
		// Toggle button
	    var $bubbleToggle = $('.bubble-toggle');
		
		// Show/Hide toggle button based on drink settings
		if(drink.bubbles == false) {
			$bubbleToggle.hide();
		} else {
			$bubbleToggle.show();
		}
		
		// Set toggle button text based on user prefs
		if (preferences.get('bubble-status') !== 'false') {
			$bubbleToggle.text('Bubbles Off');
		} else {
			$bubbleToggle.text('Bubbles On');
		}
    }
    
    // Set drink onload
    if (userSettings !== undefined) {
	    beer.setDrink(userSettings);
	} else {
		beer.setDrink("1");
		preferences.set('bubble-status', 'true');
	}
        
    // Customise form - save settings
    $( "#settings-form" ).on( "submit", function( event ) {
		event.preventDefault();
		
		var values = {};
		$.each($(this).serializeArray(), function(i, field) {
			values[field.name] = field.value;
		});
		
		beer.setDrink(values['drinkType']);
		$('.settings-panel').slideToggle();
	});
           
    // Toggle the Bubble Cannon
    $('.bubble-toggle').click(function(){
    	beer.bubble_controls();
    });
    
    // Settings Panel Toggle
    $('.settings-toggle').click(function() {
       $('.settings-panel').slideToggle(); 
       
       return false;
    });
    
    
    // Update the clock
    beer.pour();
    setInterval(beer.pour, 1000);

    
    // Delay loading of sharing stuff
    // until everything else has loaded
	$(window).on('load', function() {
	
		// Facebooks
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.async = true; js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=441260642628600";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk')); 
		
		// Twitter
		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
		
		// Google Plus
		window.___gcfg = {lang: 'en-GB'};
		(function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		})();
		
		$('.social-sharing').delay(500).fadeIn();
	});
    
});