function populate_and_open_modal(event, contentId) {
    event.preventDefault();
    $(contentId).modal('show');
    return false;
}

function scroll_to(event, targetId) {
	event.preventDefault();
	$('body').scrollTo(targetId, 800);
}
