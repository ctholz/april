

$(function() {

	$('.tag-header').on('click', sortByHeader);
});

function sortByHeader(e) {

	const ANIMATION_TIME = 300;

	if ($(this).hasClass('selected')) {
		
		$('li.message').show(ANIMATION_TIME);
		return $(this).toggleClass('selected');
	
	} else {
		var tag_clicked = $(this).data('tag');

		$('li.message').each(function() {
			if ($(this).data('tag') != tag_clicked)
				$(this).hide(ANIMATION_TIME);
			else
				$(this).show(ANIMATION_TIME);
		});
	}

	$(this).toggleClass('selected');
};