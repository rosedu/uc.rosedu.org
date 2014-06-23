PUSH_TO_HISTORY        = true
DO_NOT_PUSH_TO_HISTORY = false

TRACKS = {
  "anul_1":           "Anul 1",
  "anul_2":           "Anul 2",
  "anul_3":           "Anul 3",
  "anul_4_si_master": "Anul 4 / Master"
};

function update_participants_table(raw_json, track) {
  var data_set = JSON.parse(raw_json);
  var track_contrib_count_key = track + "_contrib_count";
  $("#" + track + "_contrib_count").text(data_set[track_contrib_count_key]);
  var track_participants_key = track + "_participants_list";
  var participants_list = data_set[track_participants_key];
  for (var i = 0; i < participants_list.length; i++) {
    var participant = participants_list[i]
    var participant_tr_template = $("#participant_tr").html();
    var context = {
      participant_id_and_track:  participant.id + "_" + participant.track,
      participant_full_name:     participant.first_name + " " + participant.last_name,
      participant_overall_score: participant.overall_score
    };
    var tr_source_code = _.template(participant_tr_template, context);
    $("#" + track + "_table").append(tr_source_code);
  }
  $(".participant_contributions_link").on("click", function(e) {
    e.preventDefault();
    var target_visualstate = $(this).data("id");
    navigate(target_visualstate);
  });
}

function update_contributions_table(raw_json) {
  var data_set = JSON.parse(raw_json);
  for (var i = 0; i < data_set.length; i++) {
    var contribution = data_set[i];
    if (contribution.date) {
      var contribution_tr_template = $("#contribution_tr").html();
      var context = {
        contribution_date:             contribution.date,
        contribution_project:          contribution.project,
        contribution_patch_url:        contribution.patch_url,
        contribution_difficulty_score: contribution.difficulty_score,
        contribution_impact_score:     contribution.impact_score
      };
      var tr_source_code = _.template(contribution_tr_template, context);
      $("#participant_success").append(tr_source_code);
    }
  }
}

function update_contributions_page(raw_json, participant_id, track) {
  if (!TRACKS[track]) {
    $("#participant_error").show();
    return;
  }
  var data_set = JSON.parse(raw_json);
  var track_participants_key = track + "_participants_list";
  var participants_list = data_set[track_participants_key];
  var participant = _.find(participants_list, function(element){ return element.id === participant_id; });
  if (!participant) {
    $("#participant_error").show();
    return;
  }
  $("#participant_success").show();
  $("#participant_full_name").text(participant.first_name + " " + participant.last_name);
  $("#participant_track").text(TRACKS[participant.track]);
  $("#participant_contrib_count").text(participant.contrib_count);
  $("#participant_overall_score").text(participant.overall_score);
  var ajax_options = {
    type: "GET",
    url: "/data/" + participant.file + "?" + Math.round(new Date().getTime()),
    dataType: "text",
    success: update_contributions_table
  };
  $.ajax(ajax_options);
}

function navigate(visualstate, push) {

  if (visualstate.substring(0,7) === "#track_") {
    $(".participant").remove();

    var track = visualstate.substring(7);
    var ajax_options = {
      type: "GET",
      url: "/data/generated/global_stats.json?" + Math.round(new Date().getTime()),
      dataType: "text",
      success: function(raw_json) { update_participants_table(raw_json, track); }
    };
    $.ajax(ajax_options);
  }

  if (visualstate.substring(0,13) === "#participant_") {
    $("#participant_error").hide();
    $("#participant_success").hide();
    $("#participant_full_name").empty();
    $("#participant_track").empty();
    $("#participant_contrib_count").empty();
    $("#participant_overall_score").empty();
    $(".contribution").remove();

    var participant_id = visualstate.substring(1,16);
    var track          = visualstate.substring(17);
    var ajax_options = {
      type: "GET",
      url: "/data/generated/global_stats.json?" + Math.round(new Date().getTime()),
      dataType: "text",
      success: function(raw_json) { update_contributions_page(raw_json, participant_id, track); }
    };
    $.ajax(ajax_options);
  }

  $(".visualstate").hide();
  var css_selector_to_display = visualstate + "_content";
  if (visualstate.substring(0,13) === "#participant_") {
    css_selector_to_display = "#participant_content";
  }
  $(css_selector_to_display).css({"display": "block", "opacity": 0}).animate({"opacity": 1}, 250);

  if ($("#menu").css("display") === "none") {
    $("#uc_heading").hide();
    document.getElementById("top_of_content").scrollIntoView();
  } else {
    $("#uc_heading").show();
    document.body.scrollIntoView();
  }

  if (visualstate !== "#acasa" && $("#menu").css("display") === "none") {
    $("#tap_target_acasa").show();
  } else {
    $("#tap_target_acasa").hide();
  }

  var base_url = window.location.href.split("#")[0];
  if (push) {
    history.pushState(css_selector_to_display, "/", base_url + visualstate);
  } else {
    history.replaceState(css_selector_to_display, "/", base_url + visualstate);
  }
}

$(".ucmenuitem").on("click", function(e) {
  e.preventDefault();
  var target_visualstate = $(this).data("id");
  navigate(target_visualstate, PUSH_TO_HISTORY);
});

$("#menu_header").on("click", function(e) {
  e.preventDefault();
  navigate("#acasa", PUSH_TO_HISTORY);
});

$(window).on("popstate", function(event) {
  if (typeof event.state === "string") {
    $(".visualstate").hide();
    $(event.state).css({"display": "block", "opacity": 0}).animate({"opacity": 1}, 250);

    if ($("#menu").css("display") === "none") {
      $("#uc_heading").hide();
    } else {
      $("#uc_heading").show();
    }
  }
});

Zepto(function($) {
  var visualstate = "#" + window.location.href.split("#")[1];
  if ( $(visualstate + "_content")[0] || visualstate.substring(0,13) === "#participant_") {
    navigate(visualstate, DO_NOT_PUSH_TO_HISTORY);
  } else {
    navigate("#acasa", DO_NOT_PUSH_TO_HISTORY);
  }

  var all_images = {
    "#uc_logo":         "../images/logos/uc_logo.png",
    ".intel_logo":      "../images/logos/intel_logo.png",
    ".mozilla_logo":    "../images/logos/mozilla_logo.png",
    "#arrow_hover":     "../images/arrow-hover.png",
    "#blue_gradient":   "../images/blue-gradient.png"
  };
  for (var img_id in all_images) {
    $(img_id).attr("src", all_images[img_id]);
  }
});

