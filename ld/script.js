"use strict";

let schedulesc = null;
let dbsc = null;
let livesc = null;
let prevsc = null;
let fullwindow = null;

window.onload = function() {
  init();
};

function openwindow() {
	if(!fullwindow || fullwindow.closed) {
		fullwindow = window.open('fullcanvas.htm', 'CanvasWindow', '', true);
		setTimeout(function() {
			livesc.updateCanvases();
		}, 100);
	}
	fullwindow.focus();
}

function transferlive() {
	let idx = prevsc.getSelectedIndex();
	id("livesongcontainer").innerHTML = id("previewsongcontainer").innerHTML;
	livesc = setupSongContainer(id("livesongcontainer"), true);
	livesc.updateCanvases();
	livesc.selectIndex(idx);
	livesc.focus();
}

function setupSongContainer(ele, live) {
	let sc = new SongContainer(ele, live);
	sc.selectIndex(0);
	let c = ele.parentElement.querySelector("canvas");
	if(c)
	sc.addcanvas(c);
	sc.updateCanvases();
	return sc;
}

function init() {
	
	id("golivebutton").addEventListener("click", function() {
		transferlive();
	});
	
	//No scrolling with arrow keys
	document.addEventListener("keydown", function(e) {
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);
	
	livesc = setupSongContainer(id("livesongcontainer"), true);
	prevsc = setupSongContainer(id("previewsongcontainer"), false);
	schedulesc = setupSongContainer(id("schedulecontainer"), false);
	dbsc = setupSongContainer(id("dbcontainer"), false);
}