$(function() {

    var BEER_O_CLOCK = 17; // 5 PM
    const GLASS_FULL = 100;

    var index
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
    function is_weekend() {

        return false;

        var now = new Date;

        // Saturday = 6 and Sunday = 0
        return now.getDay() === 6 || now.getDay() === 0;

    }

    // Is it beer o'clock? i.e the weekend or after beer o'clock on the current day
    function is_beer_o_clock() {

        return is_weekend() || (new Date).getHours() >= BEER_O_CLOCK;

    }

    // Add leading zeros to numbers
    function leading_zero(number) {

        return number < 10 ? '0' + number : number;

    }

    // Format a Date object a bit more nicely
    function format_time(date) {

        var hours = leading_zero(date.getHours()),
            minutes = leading_zero(date.getMinutes()),
            seconds = leading_zero(date.getSeconds());

        return {
            hours: hours.toString().split(''),
            minutes: minutes.toString().split(''),
            seconds: seconds.toString().split('')
        };

    }

    // A Date object for when beer o'clock is
    function get_beer_o_clock() {

        var beer_o_clock = new Date;

        // If it's already past beer o'clock then we need to wait till tomorrow
        if (beer_o_clock.getHours() >= BEER_O_CLOCK) {

            beer_o_clock.setDate(beer_o_clock.getDate() + 1);

        }

        beer_o_clock.setHours(BEER_O_CLOCK);
        beer_o_clock.setMinutes(0);
        beer_o_clock.setSeconds(0);

        return beer_o_clock;

    }

    // How long till you can haz beer!
    function time_till_beer() {

        var beer_o_clock = get_beer_o_clock(),
            now = is_beer_o_clock() ? beer_o_clock : new Date;

        return new Date(beer_o_clock - now);

    }

    // How full should the beer glass be?
    function time_till_beer_percentage() {

        if (is_beer_o_clock()) {

            return GLASS_FULL;

        }

        var now = new Date / 1000,
            beer = get_beer_o_clock() / 1000;

        return parseInt(GLASS_FULL - (((beer - now) / 86400) * 100));

    }

    function update() {

        // Update the page content
        var time = time_till_beer();
        var pretty_time = format_time(time);

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
        if (is_beer_o_clock()) {

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
            window.location.hash = time_string;

        }

        // Fill up that beer glass!
        $(".tasty-beverage").css({
            height: time_till_beer_percentage() + '%'
        });

    }
    
    function professorBurpsBubbleWorks() {
        
        var minBubbleCount = 25, // Minimum number of bubbles
            maxBubbleCount = 75, // Maximum number of bubbles
            minBubbleSize = 1, // Smallest possible bubble diameter (px)
            maxBubbleSize = 6; // Largest possible bubble diameter (px)
        
        // Generate our bubbles from the above options
        var bubbleCount = minBubbleCount + Math.floor(Math.random() * (maxBubbleCount + 1));
        
        for (var i = 0; i < bubbleCount; i++) {
            $('.bubbles').append('<div class="bubble-container"><div class="bubble"></div></div>');
        }

        // Make each bubble random
        $('.bubbles > .bubble-container').each(function() {
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
                left: posRand + '%',
                'animation-duration': speedRand + 's',
                'animation-delay': delayRand + 's'
            });
            
            // And to the bubble itself
            $this.children('.bubble').css({
                width: sizeRand + 'px',
                height: sizeRand + 'px'
            });
        });
    }

    // Update the clock
    update();
    setInterval(update, 1000);
    
    // Start the bubble cannon
    professorBurpsBubbleWorks();

});