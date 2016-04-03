

$(function() {
	$('.tag-header').on('click', sortByHeader);
	$('.message').on('click', archiveMessage);
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

	$('.selected').removeClass('selected');
	$(this).toggleClass('selected');
};

function archiveMessage(e) {

	var $note = $(this);

	$.ajax({
		url: '/messages/' + $note.data('id'),
		method: 'DELETE',
		success: function(msg) {
			console.log("Success! ",msg);
			$note.hide(300).remove();
		}
	})
};