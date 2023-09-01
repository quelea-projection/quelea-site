"use strict";

let font = "Verdana";

let SongContainer = function(sectiondiv, live) {
	let _this = this;
	_this.canvases = [];
	_this.itemdiv = sectiondiv;
	_this.live = live;
	
	_this.addcanvas = function(canvas) {
		_this.canvases.push(canvas);
	}
	
	_this.focusSelected = function() {
		let col = sectiondiv.querySelectorAll(".item");
		for(let i=0 ; i<col.length ; i++) {
			if(col[i].getAttribute("data-selected")==="true") {
				col[i].focus();
			}
		}
	}
	
	_this.getSelectedIndex = function() {
		let col = sectiondiv.querySelectorAll(".item");
		for(let i=0 ; i<col.length ; i++) {
			if(col[i].getAttribute("data-selected")==="true") {
				return i;
			}
		}
	}
	
	_this.focus = function() {
		let col = sectiondiv.querySelectorAll(".item");
		for(let i=0 ; i<col.length ; i++) {
			if(col[i].getAttribute("data-selected")==="true") {
				col[i].focus();
				return;
			}
		}
	}
	
	_this.getCurrentLyrics = function() {
		let col = sectiondiv.querySelectorAll(".item");
		for(let i=0 ; i<col.length ; i++) {
			if(col[i].getAttribute("data-selected")==="true") {
				return col[i].childNodes;
			}
		}
	}
	
	_this.updateCanvases = function() {
		let lyrics = _this.getCurrentLyrics();
		var str = "";
		for(let node of lyrics) {
			if(node.nodeType===1) {		
				var line = node.textContent;				
				str += line + "<br>";
			}
		}
		if(fullwindow !== null) {
			if(_this.live) {
				fullwindow.postMessage(str, "*");
			}
		}
		for(let canvas of _this.canvases) {
			let ctx=canvas.getContext("2d");
			
			let longestwidth = 0;
			let longestline = "";
			for(let node of lyrics) {
				if(node.nodeType===1) {		
					var line = node.textContent;				
					let width = ctx.measureText(line).width;
					if(width>longestwidth) {
						longestwidth = width;
						longestline = line;
					}
				}
			}
			ctx.font = "bold " + measureTextBinaryMethod(longestline, '"' + font + '"', 0, 1000, ctx, canvas.width*0.95) + 'px "' + font + '"';
			
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.textAlign="center"; 
			
			let lineHeight = ctx.measureText("M").width * 1.6; //Guess
			let totalHeight = (lineHeight*lyrics.length/2);
			let y = ((canvas.height/2)-totalHeight/2)+lineHeight;
			let x = canvas.width/2;
			
			for(let node of lyrics) {
				if(node.nodeType===1) {
					let line = node.textContent;
					ctx.fillText(line, x, y);
					y+= lineHeight;
				}
			}
		}
	}
	
	_this.selectIndex = function(idx) {
		let col = sectiondiv.querySelectorAll(".item");
		if(idx<0 || idx>=col.length) {
			return;
		}
		for(let i=0 ; i<col.length ; i++) {
			if(i==idx) {
				col[i].setAttribute("data-selected", "true");
			}
			else {
				col[i].removeAttribute("data-selected");
			}
		}
		_this.updateCanvases();
	}
	
	_this.selectSection = function(sec) {
		for(let loopsection of _this.itemdiv.querySelectorAll(".item")) {
			if(sec === loopsection) {
				loopsection.setAttribute("data-selected", "true");
			}
			else {
				loopsection.removeAttribute("data-selected");
			}
		}
		_this.updateCanvases();
	}
	
	_this.itemdiv.addEventListener("keydown", function(e) {
		if([38].indexOf(e.keyCode) > -1) {
			_this.selectIndex(_this.getSelectedIndex()-1);
			_this.focusSelected();
		}
		if([40].indexOf(e.keyCode) > -1) {
			_this.selectIndex(_this.getSelectedIndex()+1);
			_this.focusSelected();
		}
	}, false);
	
	for(let section of _this.itemdiv.querySelectorAll(".item")) {
		let thissection = section; //Until FF / Edge implement the correct behaviour...
		section.addEventListener("click", function(e) {
			_this.selectSection(thissection);
		}, false);
	}

}

function resizecanvas(id) {
	let canvas = document.getElementById(id);
	canvas.width = canvas.parentElement.clientWidth;
	canvas.height = canvas.parentElement.clientHeight;
}

function measureTextBinaryMethod(text, fontface, min, max, context, desiredWidth) {
    if (max-min < 1) {
        return min;     
    }
    var test = min+((max-min)/2); //Find half interval
    context.font="bold " + test+"px "+fontface;
    var measureTest = context.measureText(text).width;
    if ( measureTest > desiredWidth) {
        var found = measureTextBinaryMethod(text, fontface, min, test, context, desiredWidth)
    } else {
        var found = measureTextBinaryMethod(text, fontface, test, max, context, desiredWidth)
    }
    return found;
}

function qs(sel) {
	return document.querySelector(sel);
}

function qsa(sel) {
	return document.querySelectorAll(sel);
}

function id(sel) {
	return document.getElementById(sel);
}