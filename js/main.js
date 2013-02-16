$(function() {

	var BEER_O_CLOCK = 17; // 5 PM
	const GLASS_FULL = 100;

	var $hours = $("#hours"),
		$minutes = $("#minutes"),
		$seconds = $("#seconds");

	// Allow overriding of beer o'clock for debug
	window.set_beer_o_clock = function(hour) {

		return BEER_O_CLOCK = hour;

	}

	// Is it the weekend? If so it's always beer o'clock!
	function is_weekend() {

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

		return number < 10 ? "0" + number : number;

	}

	// Format a Date object a bit more nicely
	function format_time(date) {

		return {
			hours: leading_zero(date.getHours()),
			minutes: leading_zero(date.getMinutes()),
			seconds: leading_zero(date.getSeconds())
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

		$hours.text(pretty_time.hours);
		$minutes.text(pretty_time.minutes);
		$seconds.text(pretty_time.seconds);

		// Update the title
		if (is_beer_o_clock()) {

			document.title = "It's Beer o'clock now!";

		} else {

			var hours_suffix = time.getHours() === 1 ? " hour " : " hours ",
				minutes_suffix = time.getMinutes() === 1 ? " minute " : " minutes ",
				seconds_suffix = time.getSeconds() === 1 ? " second" : " seconds",
				time_string = "";

			if (time.getHours() > 0) {

				time_string += time.getHours() + hours_suffix;

			}

			if (time.getMinutes() > 0) {

				time_string += time.getMinutes() + minutes_suffix;

			}

			document.title = time_string + time.getSeconds() + seconds_suffix;

		}

		// Fill up that beer glass!
		$("#beer").css({
			height: time_till_beer_percentage() + "%",
			top: (GLASS_FULL - time_till_beer_percentage()) + "%"
		});

	}

	// Update the clock
	update();
	setInterval(update, 1000);

});