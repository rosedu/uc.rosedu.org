function populate_and_open_modal(event, contentId) {
    event.preventDefault();
    $(contentId).modal('show');
    return false;
}

function scroll_to(event, targetId) {
    console.log("Edi: Here!");
	event.preventDefault();
	$('body').scrollTo(targetId, 800);
}
