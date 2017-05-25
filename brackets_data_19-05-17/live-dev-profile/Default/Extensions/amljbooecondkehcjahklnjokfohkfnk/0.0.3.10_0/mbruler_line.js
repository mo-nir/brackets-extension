/*global MBRulerPoint */
/*global document */
/*global chrome */
/*global window */
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

function MBRulerLine(name, parentDivName, x, y, movecallback) {
    this.Name = name;
    this.DivName = name;//$('#'+this.SrcAreaName)[0];
    this.MoveCallBack = movecallback;

    var parentDiv = $("#MBRulerEndLine")[0];
    this.DivArea = document.createElement('div');

    this.DivArea.id = this.Name;
    this.DivArea.classList.add("mbrulerline");

    var localthis = this;

    this.StartPoint = new MBRulerPoint(localthis, "A", 10, 100, 150, 'red', undefined, null, function () {
        localthis.DrawLine();
    }, null);

    this.EndPoint = new MBRulerPoint(localthis, "B", 10, (document.body.clientWidth - 100), 150, 'red', undefined, null, function () {
        localthis.DrawLine();
    }, null);

    //parentDiv.appendChild(this.DivArea);
    document.getElementById("MBRulerLines").appendChild(this.DivArea);
//    document.body.appendChild(this.DivArea);
    //document.body.insertBefore(this.DivArea, parentDiv)

    this.DrawLine();
}

MBRulerLine.prototype.Name = undefined;
MBRulerLine.prototype.DivArea = undefined;
MBRulerLine.prototype.DivName = undefined;
MBRulerLine.prototype.MoveCallBack = undefined;

MBRulerLine.prototype.mouseButtonDown = false;

MBRulerLine.prototype.StartPoint = undefined;
MBRulerLine.prototype.EndPoint = undefined;

MBRulerLine.prototype.HideScrollbarTimer = undefined;

// Mouse Events

MBRulerLine.prototype.DrawLine = function () {
    var localthis = this;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="'+(document.body.scrollHeight/document.body.clientHeight*100)+'%"  preserveAspectRatio="xMidYMid meet">';
    //console.log('<line x1="'+localthis.StartPoint.X+'" y1="'+localthis.StartPoint.Y+'" x2="'+localthis.EndPoint.X+'" y2="'+localthis.EndPoint.Y+'" style="stroke:rgb(255,255,0);stroke-width:1; opacity: 0.7" />');
    s += '<line x1="'+this.StartPoint.X+'" y1="'+this.StartPoint.Y+'" x2="'+this.EndPoint.X+'" y2="'+this.EndPoint.Y+'" style="stroke:rgb(255,255,0);stroke-width:1; opacity: 0.7" />';
    //s +='<text text-anchor="middle" x="'+( (this.StartPoint.X+this.EndPoint.X) / 2)+'" y="'+( (this.StartPoint.Y+this.EndPoint.Y) / 2)+'" fill="red" transform="rotate(30 20,40)">'+this.Length()+'</text>';

    var xp = ( (this.StartPoint.X+this.EndPoint.X) / 2);
    var yp = ( (this.StartPoint.Y+this.EndPoint.Y) / 2);

//    s +='<text text-anchor="middle" x="'+( (this.StartPoint.X+this.EndPoint.X) / 2)+'" y="'+( (this.StartPoint.Y+this.EndPoint.Y) / 2)+'" fill="black" stroke="white">'+this.Length()+'px</text>';
    s += '<text text-anchor="middle" x="' + (xp - 1) + '" y="' + (yp - 1) + '" fill="white" >' + this.Length() + 'px</text>';
    s += '<text text-anchor="middle" x="' + (xp - 1) + '" y="' + (yp + 1) + '" fill="white" >' + this.Length() + 'px</text>';
    s += '<text text-anchor="middle" x="' + (xp + 1) + '" y="' + (yp - 1) + '" fill="white" >' + this.Length() + 'px</text>';
    s += '<text text-anchor="middle" x="' + (xp + 1) + '" y="' + (yp + 1) + '" fill="white" >' + this.Length() + 'px</text>';

    s += '<text text-anchor="middle" x="' + (xp) + '" y="' + (yp) + '" fill="black" >' + this.Length() + 'px</text>';
    s += '</svg>';
    localthis.DivArea.innerHTML = s;
};

/**
 * @return {number}
 */
MBRulerLine.prototype.Length = function () {
    "use strict";
    var length = Math.sqrt((this.StartPoint.X - this.EndPoint.X) * (this.StartPoint.X - this.EndPoint.X) + (this.StartPoint.Y - this.EndPoint.Y) * (this.StartPoint.Y - this.EndPoint.Y));
    length = Math.round(length * 100) / 100;
    return length;
};


$(document).ready(function () {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return;
    }
    $('head').append('<link rel="stylesheet" href="mbruler_line.css" type="text/css" media="screen" />');
});