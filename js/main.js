$(function() {

	const BEER_O_CLOCK = 17; // 5 PM
	const GLASS_FULL = 100;

	var $hours = $("#hours"),
		$minutes = $("#minutes"),
		$seconds = $("#seconds");

	// Is it the weekend? If so it's always beer o'clock!
	function is_weekend() {

		var now = new Date;

		// Saturday = 6 and Sunday = 0
		return now.getDay() === 6 || now.getDay() === 0;

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
		if (beer_o_clock.getHours() > BEER_O_CLOCK) {

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
			now = is_weekend() ? get_beer_o_clock() : new Date; 

		return new Date(beer_o_clock - now);

	}

	// How full should the beer glass be?
	function time_till_beer_percentage() {

		if (is_weekend()) {

			return GLASS_FULL;

		}

		var now = new Date / 1000,
			beer = get_beer_o_clock() / 1000;

		return parseInt(GLASS_FULL - (((beer - now) / 86400) * 100));

	}

	// Update the page time html
	function set_time(date) {

		var time = format_time(date);

		$hours.text(time.hours);
		$minutes.text(time.minutes);
		$seconds.text(time.seconds);

	}

	function update_clock() {

		// Update the page content
		set_time(time_till_beer());

		// Fill up that beer glass!
		$("#beer").css({
			height: time_till_beer_percentage() + "%",
			top: (GLASS_FULL - time_till_beer_percentage()) + "%"
		});

	}

	// Update the clock
	update_clock();
	setInterval(update_clock, 1000);

});