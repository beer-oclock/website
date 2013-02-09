$(function() {

	const BEER_O_CLOCK = 19;

	var $hours = $("#hours"),
		$minutes = $("#minutes"),
		$seconds = $("#seconds");

	// Is it the weekend? If so it's always beer o'clock!
	function is_weekend() {

		var now = new Date;

		return false; //now.getDay() === 6 || now.getDay() === 7;

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

	// How full should that beer glass be? TODO
	function time_till_beer_percentage() {

		var now = new Date,
			wait = get_beer_o_clock();

		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);

		console.log(now);
		console.log(wait);
		console.log(+now);
		console.log(+wait);
		console.log(wait - now);

		return (now / (now - wait)) * 100;

	}

	time_till_beer_percentage();

	// Update the page time html
	function set_time(date) {

		var time = format_time(date);

		$hours.text(time.hours);
		$minutes.text(time.minutes);
		$seconds.text(time.seconds);

	}

	function update_clock() {

		set_time(time_till_beer());

	}

	// Update the clock
	update_clock();
	setInterval(update_clock, 1000);

});