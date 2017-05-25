/*global document */
/*global window */
/*global chrome */
/*global $ */
/*jshint strict:false */

/*
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
*/

function MBRulerPoint(parent, name, size, x, y, color, mousecursor, mousedowncallback, mousemovecallback, mouseupcallback) {
    this.Parent = parent;
    this.Name = name;
    this.DivName = name;//$('#'+this.SrcAreaName)[0];
    this.MouseDownCallBack = mousedowncallback;
    this.MouseMoveCallBack = mousemovecallback;
    this.MouseUpCallBack = mouseupcallback;

    this.DivArea = document.createElement('div');

    this.DivArea.id = this.Name;
    this.DivArea.classList.add("mbrulerpoint");

    if (mousecursor !== undefined) {
        this.DivArea.style.cursor = mousecursor;
    }

    this.X = x;
    this.Y = y;
    this.DivArea.style.width = size + "px";
    this.DivArea.style.height = size + "px";
    this.DivArea.style.left = (x - size / 2) + "px";
    this.DivArea.style.top = (y - size / 2) + "px";

    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (size) + 'px" height="' + (size) + 'px"  preserveAspectRatio="xMidYMid meet">';
    s += '<circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + (size / 2) + '" stroke="none" stroke-width="0" fill="' + color + '" />';
    s += '</svg>';
    this.DivArea.innerHTML = s;

    document.getElementById("MBRulerNodes").appendChild(this.DivArea);

    // Add mouse handlers
    this.DivArea.addEventListener('mousedown', this.mouseDown.bind(this), false);
    //this.DivArea.addEventListener('mousemove', this.mouseMove.bind(this), false);
    //this.DivArea.addEventListener('mouseup', this.mouseUp.bind(this), false);

    //this.DivArea.addEventListener('mouseout', this.mouseOut.bind(this), false);
   // this.DivArea.addEventListener('mouseleave', this.mouseLeave.bind(this), false);
}

MBRulerPoint.prototype.Parent = undefined;
MBRulerPoint.prototype.Name = undefined;
MBRulerPoint.prototype.DivArea = undefined;
MBRulerPoint.prototype.DivName = undefined;
MBRulerPoint.prototype.Size = undefined;
MBRulerPoint.prototype.MouseDownCallBack = undefined;
MBRulerPoint.prototype.MouseMoveCallBack = undefined;
MBRulerPoint.prototype.MouseUpCallBack = undefined;

MBRulerPoint.prototype.DivClick = undefined;

MBRulerPoint.prototype.mouseButtonDown = false;
MBRulerPoint.prototype.inDragMode = false;
MBRulerPoint.prototype.startMousePositionX = undefined;
MBRulerPoint.prototype.startMousePositionY = undefined;

MBRulerPoint.prototype.X = undefined;
MBRulerPoint.prototype.Y = undefined;


MBRulerPoint.prototype.HideScrollbarTimer = undefined;

// Mouse Events

// Handles the mouse down event for new objects
MBRulerPoint.prototype.mouseDown = function (m) {
    this.mouseButtonDown = true;
    this.DivArea.style.opacity = 0.0;
    //noinspection JSLint
    if (this.MouseDownCallBack != undefined) { // jshint ignore:line
        this.MouseDownCallBack(this, this.Name, m.pageX, m.pageY);
    }
    this.createClickLayer();
};

// Handles mouse movement when creating a proposed object
MBRulerPoint.prototype.mouseMove = function (m) {
    if (this.inDragMode) {
        this.inDragMode = false;
        return;
    }

    //console.log("mouseMove");
    if (this.mouseButtonDown) {
        this.X = m.pageX;
        this.Y = m.pageY;

        this.DivArea.style.left = (m.pageX - this.DivArea.clientWidth / 2) + "px";
        this.DivArea.style.top = (m.pageY - this.DivArea.clientHeight / 2) + "px";

        if (this.MouseMoveCallBack != undefined) { // jshint ignore:line
            this.MouseMoveCallBack(this, this.Name, this.X, this.Y);
        }
    }
};

// Handles the completion of a proposed object
MBRulerPoint.prototype.mouseUp = function (m) {
    //console.log("mouseUp");
    this.mouseButtonDown = false;
    this.DivArea.style.opacity = 0.5;
    this.inDragMode = false;
    if (this.MouseUpCallBack != undefined) { // jshint ignore:line
        this.MouseUpCallBack(this, this.Name, m.pageX, m.pageY);
    }
    //this.startMousePositionX=undefined;
    //this.startMousePositionY=undefined;
   this.removeClickLayer();
};

MBRulerPoint.prototype.mouseLeave = function (m) {
    if (this.mouseButtonDown) {
        this.mouseMove(m);
    }
};

MBRulerPoint.prototype.mouseOut = function (m) {
    if (this.mouseButtonDown) {
        this.mouseMove(m);//this.mouseButtonDown = false;
    }
};

MBRulerPoint.prototype.createClickLayer = function () {
    this.DivClick = document.createElement('div');

    this.DivClick.id = this.Name + "ClickLayer";
    //this.DivClick.draggable = false;
    this.DivClick.classList.add("mbrulerclicklayer");

    document.getElementById("MBRulerNodes").appendChild(this.DivClick);

    // Add mouse handlers
    //this.DivClick.addEventListener('mousedown', this.mouseDown.bind(this), false);
    this.DivClick.addEventListener('mousemove', this.mouseMove.bind(this), false);
    this.DivClick.addEventListener('drag', this.drag.bind(this), false);
    this.DivClick.addEventListener('mouseup', this.mouseUp.bind(this), false);
    this.DivClick.addEventListener('dragend', this.dragEnd.bind(this), false);

    //this.DivClick.addEventListener('dragstart', this.dragStart.bind(this), false);

    //this.DivClick.addEventListener('mouseout', this.mouseOut.bind(this), false);
    //this.DivClick.addEventListener('mouseleave', this.mouseLeave.bind(this), false);
};

MBRulerPoint.prototype.dragEnd = function (m) {
    this.mouseButtonDown = false;
    this.DivArea.style.opacity = 0.5;
    if (this.MouseUpCallBack != undefined) { // jshint ignore:line
        this.MouseUpCallBack(this, this.name, m.pageX, m.pageY);
    }
    this.removeClickLayer();
};

MBRulerPoint.prototype.drag = function (m) {
    //console.log("drag");
    this.inDragMode = true;
    if (this.mouseButtonDown) {

        if ((m.pageX === 0) || (m.pageY === 0)) {
            return;
        }

        this.X = m.pageX;
        this.Y = m.pageY;

        this.DivArea.style.left = (m.pageX - this.DivArea.clientWidth / 2) + "px";
        this.DivArea.style.top = (m.pageY - this.DivArea.clientHeight / 2) + "px";

        if (this.MouseMoveCallBack != undefined) { // jshint ignore:line
            this.MouseMoveCallBack(this, this.Name, this.X, this.Y);
        }
    }
};

MBRulerPoint.prototype.removeClickLayer = function () {
    this.DivClick.remove();
    //document.removeChild(this.DivClick);
};

MBRulerPoint.prototype.Refresh = function () {
    if (this.Parent.Visible) {
        this.DivArea.style.opacity = 0.5;
    } else {
        this.DivArea.style.opacity = 0.0;
    }
    this.DivArea.style.left = (this.X - this.DivArea.clientWidth / 2) + "px";
    this.DivArea.style.top = (this.Y - this.DivArea.clientHeight / 2) + "px";
};

MBRulerPoint.prototype.SetPosition = function (x, y) {
    this.X = x;
    this.Y = y;
    this.Refresh();
};

MBRulerPoint.prototype.MovePosition = function (dx, dy) {
    this.X += dx;
    this.Y += dy;
    this.Refresh();
};

MBRulerPoint.prototype.SetColor = function (color) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (this.Size) + 'px" height="' + (this.Size) + 'px"  preserveAspectRatio="xMidYMid meet">';
    s += '<circle cx="' + (this.Size / 2) + '" cy="' + (this.Size / 2) + '" r="' + (this.Size / 2) + '" stroke="none" stroke-width="0" fill="' + color + '" />';
    s += '</svg>';
    this.DivArea.innerHTML = s;
};

MBRulerPoint.prototype.isMoving = function () {
    return this.mouseButtonDown;
};

$(document).ready(function () {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return;
    }
    $('head').append('<link rel="stylesheet" href="mbruler_point.css" type="text/css" media="screen" />');
});