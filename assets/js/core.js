function populate_and_open_modal(event, contentId) {
    event.preventDefault();
    $(contentId).modal('show');
    return false;
}
