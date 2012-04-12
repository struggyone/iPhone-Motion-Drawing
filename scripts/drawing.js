// JavaScript Document
var drawingJs = {
	init : function(){
			
		drawingJs.eventType = "";
		setTimeout(function(){window.scrollTo(0,1)},10);
		
		//detect which events are allowed
		window.addEventListener("MozOrientation", drawingJs.eventDetection, true);
		window.addEventListener("devicemotion", drawingJs.eventDetection, true);
		window.addEventListener("deviceorientation", drawingJs.eventDetection, true);
		
		//setup svg
		var drawing = document.getElementById('drawing');
			
		drawingJs.newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		
		var newSvg = drawingJs.newSvg;
		
		//path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			
		newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		newSvg.setAttribute('version', '1.1');
		newSvg.setAttribute('width', '320');
		newSvg.setAttribute('height', '360');
		
		drawing.appendChild(newSvg);
	},
	
	eventDetection : function(event){
		drawingJs.eventType = event.type;
		drawingJs.removeEventDetection(event.type);
		document.getElementById('initialise').style.display = 'none';
		document.getElementById('intro').style.display = 'block';
		
		//allow start position to be selected if a motion event is avaialble
		document.getElementById('drawing').addEventListener("touchstart", drawingJs.drawStart, false);
		document.getElementById('drawing').addEventListener("click", drawingJs.drawStart, false);
	},
	
	removeEventDetection : function(eventType){
		window.removeEventListener(eventType, drawingJs.eventDetection, true);
	},
	
	newPath : function(x, y){
		var newSvg = drawingJs.newSvg;
		
		drawingJs.activePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		
		var path = drawingJs.activePath;
			
		path.setAttribute('id', 'path');
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', drawingJs.hex);
		path.setAttribute('d', 'M' + x + ', ' + y);
		
		newSvg.appendChild(path);
	},
	
	changeColor : function(event){
		//prevent default action
		if ( event.preventDefault ) {
			event.preventDefault()
		};
  		event.returnValue = false;
		
		//new action
		drawingJs.hex = this.getAttribute('data-hex');
		//drawingJs.context.strokeStyle = drawingJs.hex;
		
		for (var i=0; i<drawingJs.colorListItems.length; i++){
			drawingJs.colorListItems[i].className="";
		}
		
		this.className="button_selected";
		
		drawingJs.newPath(drawingJs.prevX, drawingJs.prevY)
	},
	
	resetCanvas : function(event){
		//prevent default action
		if ( event.preventDefault ) {
			event.preventDefault()
		};
  		event.returnValue = false;
		
		//clear the canvas
		while(drawingJs.newSvg.hasChildNodes()) drawingJs.newSvg.removeChild(drawingJs.newSvg.firstChild);
		
		for (var i=0; i<drawingJs.colorListItems.length; i++){
			drawingJs.colorListItems[i].className="";
		}
		
		drawingJs.colorListItems[0].className="button_selected";
		drawingJs.hex = "#000";
		
		//stop line being drawn
		window.removeEventListener(drawingJs.eventType, drawingJs.draw, true);
		document.getElementById('pause').className="";
		drawingJs.pause = false;
		document.getElementById('intro').style.opacity = '1';
		document.getElementById('colors').style.opacity = '0';
		document.getElementById('buttons').style.opacity = '0';
	},
	
	drawPause : function(event){
		//prevent default action
		if ( event.preventDefault ) {
			event.preventDefault()
		};
  		event.returnValue = false;
		
		//pause/play
		if (drawingJs.pause == true){
			window.addEventListener(drawingJs.eventType, drawingJs.draw, true);
			this.className="";
			drawingJs.pause = false;
		}else{
			window.removeEventListener(drawingJs.eventType, drawingJs.draw, true);
			this.className="button_selected";
			drawingJs.pause = true;
		}
	},
	
	drawStart : function(event){	
		//prevent default action
		if ( event.preventDefault ) {
			event.preventDefault()
		};
  		event.returnValue = false;
			
		//colors
		var colorList = document.getElementById('colors');
		
		drawingJs.colorListItems = colorList.getElementsByTagName('a');
			
		for (var i=0; i<drawingJs.colorListItems.length; i++){
			var hex = drawingJs.colorListItems[i].getAttribute('data-hex');
			drawingJs.colorListItems[i].style.backgroundColor = hex;

			drawingJs.colorListItems[i].addEventListener(event.type, drawingJs.changeColor, false);
		}
		
		if (!drawingJs.hex)	{	
			drawingJs.colorListItems[0].className="button_selected";
			drawingJs.hex = "#000";
		}
		colorList.style.opacity = '1';
		
		//buttons
		document.getElementById('reset').addEventListener(event.type, drawingJs.resetCanvas, false);
		document.getElementById('pause').addEventListener(event.type, drawingJs.drawPause, false);
		document.getElementById('buttons').style.opacity = '1';
		
		if (drawingJs.pause != true){
			//set start position
			var mouseX = 0,
				mouseY = 0,
				eventType = event.type;
			
			if (eventType == 'click'){
				mouseX = event.pageX;
				mouseY = event.pageY;
			} else {
				mouseX = event.touches[0].pageX;
				mouseY = event.touches[0].pageY;
			}
			
			drawingJs.prevX = mouseX;
			drawingJs.prevY = mouseY;
			
			document.getElementById('intro').style.opacity = '0';
			window.addEventListener(drawingJs.eventType, drawingJs.draw, true);
		}
		
		
		
		//start new path
		drawingJs.newPath(drawingJs.prevX, drawingJs.prevY);
		
	},
	
	draw : function(event){	
		var gamma = 0,
			beta = 0,
			x = 0,
			y = 0,
			context = drawingJs.context,
			eventType = event.type;
			
		switch (eventType){
			case "deviceorientation":
				beta = event.beta;
				gamma = event.gamma;
				x = drawingJs.prevX + gamma/9;
				y = drawingJs.prevY + beta/9;
				break;
			case "devicemotion":
				gamma = event.accelerationIncludingGravity.x;
				beta = event.accelerationIncludingGravity.y;
				x = drawingJs.prevX + (gamma/9.8)*10;
				y = drawingJs.prevY + (beta/9.8)*-10;
				break;
			case "MozOrientation":
				gamma = event.x;
				beta = event.y;
				x = drawingJs.prevX + (gamma)*10;
				y = drawingJs.prevY + (beta)*-10;
				break;
		}
		
		
		var path = drawingJs.activePath,
			pathD = path.getAttribute('d');
		
		//add to active path
		path.setAttribute('d', pathD + "L" + x + ", " + y)
		
		
		drawingJs.prevX = x;
		drawingJs.prevY = y;
	}
}