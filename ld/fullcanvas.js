"use strict";

var lyrics="";

window.onload = function() {
	resizecanvas("canvas");
	redraw();
}

window.onresize = function() {
	resizecanvas("canvas");
	redraw();
};

window.addEventListener('message',function(event) {
	lyrics = event.data.split("<br>");
	redraw();
},false);

function redraw() {
	let canvas = document.querySelector("canvas");
	let ctx=canvas.getContext("2d");
	
	let longestwidth = 0;
	let longestline = "";
	for(let line of lyrics) {					
		let width = ctx.measureText(line).width;
		if(width>longestwidth) {
			longestwidth = width;
			longestline = line;
		}
	}
	ctx.font = "bold " + measureTextBinaryMethod(longestline, '"Verdana"', 0, 1000, ctx, canvas.width*0.95) + 'px "Verdana"';
	
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.textAlign="center"; 
	
	let lineHeight = ctx.measureText("M").width * 1.6; //Guess
	let totalHeight = (lineHeight*lyrics.length);
	let y = ((canvas.height/2)-totalHeight/2)+lineHeight;
	let x = canvas.width/2;
	for(let line of lyrics) {
		ctx.fillText(line, x, y);
		y+= lineHeight;
	}
}