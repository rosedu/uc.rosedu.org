/*
 * GNU General Public License v3 (GPL-3)
 * Original Author: Valentin Ilie <valentin.ilie@gmail.com>
 */

function ucShow(elem) {
	elem.style.display="block";
}

function ucHideAll() {
	var allElements = [acasa_content, regulament_content, proiecte_content, clasament_content, track_anul_1_content, track_anul_2_content, track_anul_3_content, track_anul_4_si_master_content];
	var allElementsLength = allElements.length;
	for (var i = 0; i < allElementsLength; i++) {
		allElements[i].style.display="none";
	}
}

function ucDisplay(elem) {
	ucHideAll();
	ucShow(elem);
}
