/*global MBRulerPoint */
/*global $ */
/*global chrome */
/*global document */
/*global window */
/*jshint strict:false */

function MBRulerGuideLines(color) {
    "use strict";
    var localthis = this;

    localthis.Visible = !(window.chrome && chrome.runtime && chrome.runtime.id);
    //localthis.Visible = false;

    localthis.Color = color;
    localthis.StrokeWidth = 1;
    localthis.Opacity = 0.5;

    localthis.FontFamily = 'Courier';
    localthis.FontSize = 16;
    localthis.LetterWidth = 10;
    localthis.LetterHeight = 15;
    localthis.FontColor = 'black';

    localthis.BackgroundColor = 'lightgrey';
    localthis.BackgroundOpacity = 1.0;
    localthis.BackgroundOffset = 3;
    localthis.StrokeColor = 'black';

    localthis.CreateNewLineXPoint();
    localthis.CreateNewLineYPoint();

    window.addEventListener("resize", function () {
            localthis.CreateGrid(false);
        }
    );
    document.addEventListener("scroll", function () {
            localthis.CreateGrid(false);
        }
    );

    window.addEventListener('mousemove', function (e) {
        localthis.mouse_monitor(e);
    });

    try {
        localthis.ReadPersistenceInformation();
        localthis.Refresh();
    }
    catch (err) {
        localthis.Visible = !(window.chrome && chrome.runtime && chrome.runtime.id);
        localthis.Reset();
    }
}

MBRulerGuideLines.prototype.mouse_monitor = function (e) {
    "use strict";
    var localthis = this,
        canSet = true;
    if (localthis.Visible) {
        if ((localthis.NewLineY !== undefined) && (!localthis.NewLineY.isMoving())) {
            canSet = true;
            if (localthis.XLines !== undefined) { // jshint ignore:line
                localthis.XLines.forEach(function check(value) {
                    if ((value.X > e.pageX - 10) && (value.X < e.pageX + 10)) {
                        canSet = false;
                    }
                });
            }
            if (canSet) {
                localthis.NewLineY.SetPosition(e.pageX, document.body.scrollTop + 5);
            }
        }
        if ((localthis.NewLineX !== undefined) && (!localthis.NewLineX.isMoving())) {
            canSet = true;
            if (localthis.YLines !== undefined) { // jshint ignore:line
                localthis.YLines.forEach(function check(value) {
                    if ((value.Y > e.pageY - 10) && (value.Y < e.pageY + 10)) {
                        canSet = false;
                    }
                });
            }
            if (canSet) {
                localthis.NewLineX.SetPosition(document.body.scrollLeft + 5, e.pageY);
            }
        }
    }
};

MBRulerGuideLines.prototype.SortXLines = function () {
    "use strict";
    var localthis = this;
    localthis.XLines.sort(function (a, b) {
        return a.X > b.X;
    });
};

MBRulerGuideLines.prototype.SortYLines = function () {
    "use strict";
    var localthis = this;
    localthis.YLines.sort(function (a, b) {
        return a.Y > b.Y;
    });
};

MBRulerGuideLines.prototype.CreateNewLineXPoint = function () {
    "use strict";
    var localthis = this;

    localthis.NewLineX = new MBRulerPoint(localthis, "NewX", 10, -100, -100, "none", "ew-resize", function (pt, name, x, y) {
        // Mousedown
        if (name === "NewX") {
            localthis.XLines.push(localthis.NewLineX);
            localthis.SortXLines();
            localthis.CreateGrid(true);
        }
    }, function (pt, name, x, y) {
        // Mousemove
        localthis.SortXLines();
        localthis.CreateGrid(true);
    }, function (pt, name, x, y) {
        // Mouseup
        if (x < document.body.scrollLeft + 10) {
            var i = localthis.XLines.indexOf(pt);
            //pt.visible = false;
            localthis.XLines.splice(i, 1);
        }
        if (name === "NewX") {
            localthis.NewLineX.Name = '';
            localthis.CreateNewLineXPoint();
        }
        localthis.SortXLines();
        localthis.CreateGrid(false);
    });
};

MBRulerGuideLines.prototype.CreateNewLineYPoint = function () {
    "use strict";
    var localthis = this;

    localthis.NewLineY = new MBRulerPoint(localthis, "NewY", 10, -100, -100, "none", "ns-resize", function (pt, name, x, y) {
        // Mousedown
        if (name === "NewY") {
            localthis.YLines.push(localthis.NewLineY);
            //localthis.NewLineY.SetColor("black");
            localthis.SortYLines();
            localthis.CreateGrid(true);
        }
    }, function (pt, name, x, y) {
        // Mousemove
        localthis.SortYLines();
        localthis.CreateGrid(true);
    }, function (pt, name, x, y) {
        // Mouseup
        if (y < document.body.scrollTop + 10) {
            var i = localthis.YLines.indexOf(pt);
            //pt.visible = false;
            localthis.YLines.splice(i, 1);
        }
        if (name === "NewY") {
            localthis.NewLineY.Name = '';
            localthis.CreateNewLineYPoint();
        }
        localthis.SortYLines();
        localthis.CreateGrid(false);
    });
};

MBRulerGuideLines.prototype.Visible = undefined;

MBRulerGuideLines.prototype.NewLineX = undefined;
MBRulerGuideLines.prototype.NewLineY = undefined;

MBRulerGuideLines.prototype.XLines = [];
MBRulerGuideLines.prototype.YLines = [];

MBRulerGuideLines.prototype.Color = undefined;
MBRulerGuideLines.prototype.StrokeWidth = undefined;
MBRulerGuideLines.prototype.Opacity = undefined;

MBRulerGuideLines.prototype.FontFamily = undefined;
MBRulerGuideLines.prototype.FontSize = undefined;
MBRulerGuideLines.prototype.FontColor = undefined;
MBRulerGuideLines.prototype.LetterWidth = undefined;
MBRulerGuideLines.prototype.LetterHeight = undefined;

MBRulerGuideLines.prototype.BackgroundColor = undefined;
MBRulerGuideLines.prototype.BackgroundOpacity = undefined;
MBRulerGuideLines.prototype.StrokeColor = undefined;
MBRulerGuideLines.prototype.BackgroundOffset = undefined;

MBRulerGuideLines.prototype.Refresh = function () {
    //this.OriginRef1.Refresh();
    //this.OriginRef2.Refresh();
    "use strict";
    this.CreateGrid(false);
};

MBRulerGuideLines.prototype.Reset = function () {
    var localthis = this;
    localthis.XLines = [];
    localthis.YLines = [];
    localthis.Refresh();
};

MBRulerGuideLines.prototype.WritePersistenceInformation = function () {
    var localthis = this,
        i = 0,
        s = "1"; // Version
    s += ";" + (localthis.Visible ? "1" : "0");

    s += ";" + localthis.XLines.length.toString();
    for (i=0; i < localthis.XLines.length; i++) {
        s += ";" + localthis.XLines[i].X.toString();
    }

    s += ";" + localthis.YLines.length.toString();
    for (i=0; i < localthis.YLines.length; i++) {
        s += ";" + localthis.YLines[i].Y.toString();
    }
    localStorage['MB-Ruler Guide Lines'] = s;
    //console.log("Write: " + s);
};

MBRulerGuideLines.prototype.ReadPersistenceInformation = function () {
    var localthis = this;
    //console.log("Read: " + localStorage['MB-Ruler Guide Lines']);
    var details = localStorage['MB-Ruler Guide Lines'].split(";");
    if (details[0] === "1") {
        if (details[1] === "1") {
            this.Visible = true;
            var i = 0,
                p = 2,
                anz = parseInt(details[p]);
            for (i=0; i < anz; i++) {
                p++;
                localthis.NewLineX.Name = '';
                localthis.NewLineX.X = parseFloat(details[p]);
                localthis.XLines.push(localthis.NewLineX);
                localthis.CreateNewLineXPoint();
                localthis.SortXLines();
            }
            p++;
            anz = parseInt(details[p]);
            for (i=0; i < anz; i++) {
                p++;
                localthis.NewLineY.Name = '';
                localthis.NewLineY.Y = parseFloat(details[p]);
                localthis.YLines.push(localthis.NewLineY);
                localthis.CreateNewLineYPoint();
                localthis.SortYLines();
            }
        } else {
            this.Visible = false;
        }
    }
};

MBRulerGuideLines.prototype.SetColor = function (color) {
    "use strict";
    this.Color = color; //"rgb(255,0,0)";
};

/**
 * @return {string}
 */
MBRulerGuideLines.prototype.LineStyle = function () {
    "use strict";
    return 'stroke:' + this.Color + ';stroke-width:' + this.StrokeWidth + '; opacity: ' + this.Opacity;
};

MBRulerGuideLines.prototype.CreateGrid = function (showgridsize) {
    //var baseview = document.getElementById("MBRulerView");
    var s = '';

    if (this.Visible) {

        var localthis = this;
        var percentageHeight = (document.body.clientHeight !== 0 ? document.body.scrollHeight / document.body.clientHeight * 100 : 100);
        var percentageWidth = (document.body.clientWidth !== 0 ? document.body.scrollWidth / document.body.clientWidth * 100 : 100);
        s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + (percentageWidth-1) + '%" height="' + (percentageHeight-1) + '%"  preserveAspectRatio="xMidYMid meet">';

        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="' + (percentageHeight) + '%"  preserveAspectRatio="xMidYMid meet">';
        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"  preserveAspectRatio="xMidYMid meet">';

        s += '<rect x="' + (10) + '" y="' + (document.body.scrollTop) + '" width="' + (document.body.scrollWidth - 10) + '" height="' + (10) + '" style="stroke:black; fill:lightgrey; opacity:0.5"></rect>'; // horizontale Titelzeile
        s += '<rect x="' + (document.body.scrollLeft) + '" y="' + (10) + '" width="' + (10) + '" height="' + (document.body.scrollHeight - 10) + '" style="stroke:black; fill:lightgrey; opacity:0.5"></rect>'; // vertikale Titelzeile

        var i;
        var lineLen = 10;
        for (i = 1; i < (document.body.scrollWidth / 10); i++) {
            lineLen = 3;
            if (i % 5 === 0) { lineLen = 6; }
            if (i % 10 === 0) { lineLen = 10; }
            s += '<line x1="' + (i * 10) + '" y1="' + (document.body.scrollTop) + '" x2="' + (i * 10) + '" y2="' + (document.body.scrollTop + lineLen) + '" style="stroke:black; fill:lightgrey; opacity:1.0" />';
        }

        for (i = 1; i < (document.body.scrollHeight / 10); i++) {
            lineLen = 3;
            if (i % 5 === 0) { lineLen = 6; }
            if (i % 10 === 0) { lineLen = 10; }
            s += '<line x1="' + (document.body.scrollLeft) + '" y1="' + (i * 10) + '" x2="' + (document.body.scrollLeft + lineLen) + '" y2="' + (i * 10) + '" style="stroke:black; fill:lightgrey; opacity:1.0" />';
        }

        // Hilfslinien zeichnen
        if (localthis.XLines != undefined) { // jshint ignore:line
            localthis.XLines.forEach(
                function drawLine(value) {
                    s += '<line x1="' + (value.X-0.25) + '" y1="' + (0) + '" x2="' + (value.X-0.25) + '" y2="' + (document.body.scrollHeight) + '" style="stroke:black; fill:lightgrey; opacity:1.0" />';
                    s += '<line x1="' + (value.X+0.25) + '" y1="' + (0) + '" x2="' + (value.X+0.25) + '" y2="' + (document.body.scrollHeight) + '" style="stroke:white; fill:lightgrey; opacity:1.0" />';
                    value.SetPosition(value.X, document.body.scrollTop + 5);
                }
            );
        }

        if (localthis.YLines != undefined) { // jshint ignore:line
            localthis.YLines.forEach(
                function drawLine(value) {
                    s += '<line x1="' + (0) + '" y1="' + (value.Y-0.25) + '" x2="' + (document.body.scrollWidth) + '" y2="' + (value.Y-0.25) + '" style="stroke:black; fill:lightgrey; opacity:1.0" />';
                    s += '<line x1="' + (0) + '" y1="' + (value.Y+0.25) + '" x2="' + (document.body.scrollWidth) + '" y2="' + (value.Y+0.25) + '" style="stroke:white; fill:lightgrey; opacity:1.0" />';
                    value.SetPosition(document.body.scrollLeft + 5, value.Y);
                }
            );
        }

        // Pixelposition der Hilfslinien zeichnen
        if (localthis.XLines != undefined) { // jshint ignore:line
            localthis.XLines.forEach(
                function drawLinePixelPosition(value) {
                    s += localthis.PosXInfoField(value.X);
                }
            );
            if (localthis.XLines.length > 0) {
                s += localthis.DistXInfoField(0, localthis.XLines[0].X);
                for (i=1; i < localthis.XLines.length; i++) {
                    s += localthis.DistXInfoField(localthis.XLines[i-1].X, localthis.XLines[i].X);
                }
                s += localthis.DistXInfoField(localthis.XLines[localthis.XLines.length-1].X, document.body.scrollWidth);
            }
        }

        if (localthis.YLines != undefined) { // jshint ignore:line
            localthis.YLines.forEach(
                function drawLinePixelPosition(value) {
                    s += localthis.PosYInfoField(value.Y);
                }
            );
            if (localthis.YLines.length > 0) {
                s += localthis.DistYInfoField(0, localthis.YLines[0].Y);
                for (i=1; i < localthis.YLines.length; i++) {
                    s += localthis.DistYInfoField(localthis.YLines[i-1].Y, localthis.YLines[i].Y);
                }
                s += localthis.DistYInfoField(localthis.YLines[localthis.YLines.length-1].Y, document.body.scrollHeight);
            }

        }
        s += '</svg>';
        //console.log(s);
    }
    document.getElementById("MBRulerGuideLines").innerHTML = s;

    this.WritePersistenceInformation();
};

//I usually prototype directly on string in m jquery version
//String.prototype.width = function(svg, string, font, aclass) {
/*
MBRulerGuideLines.prototype.stringSize = function(svg, string, font, aclass) {
    var f = font || '12px arial';

    var text = svg.append("svg:text")
        .attr('class', aclass)
        .attr("x", 0)
        .attr("y", 0)
        .style("font", f)
        .style("opacity", 0)
        .text(string);

    return text.node().getBBox();
}
*/

/**
 * @return {number}
 */
MBRulerGuideLines.prototype.TextWidth = function (text) {
    return text.length * this.LetterWidth;
};

/**
 * @return {number}
 */
MBRulerGuideLines.prototype.TextHeight = function (text) {
    return this.LetterHeight;
};

/**
 * @return {number}
 */
MBRulerGuideLines.prototype.TextboxWidth = function (text) {
    return this.TextWidth(text) + 2 * this.BackgroundOffset;
};

/**
 * @return {number}
 */
MBRulerGuideLines.prototype.TextboxHeight = function (text) {
    return this.TextHeight(text) + 2 * this.BackgroundOffset;
};

/**
 * @return {string}
 */
MBRulerGuideLines.prototype.PosXInfoField = function (pos) {
    var s ='';
    var text = pos.toString();
    s += '<rect x="'+(pos-this.TextboxHeight(text) / 2)+'" y="'+(document.body.scrollTop+10)+'" width="'+this.TextboxHeight(text)+'" height="'+this.TextboxWidth(text)+'" style="stroke:'+this.StrokeColor+'; fill:'+this.BackgroundColor+'; opacity:'+this.BackgroundOpacity+'" ></rect>';
    s += '<text text-anchor="left" alignment-baseline="middle" text x="'+(pos)+'" y="'+(document.body.scrollTop+14)+'" font-family="'+this.FontFamily+'" font-size="'+this.FontSize+'" fill="'+this.FontColor+'" transform="rotate(90 '+(pos)+' '+(document.body.scrollTop+13)+')" >'+(text)+'</text>';
    return s;
};

/**
 * @return {string}
 */
MBRulerGuideLines.prototype.DistXInfoField = function (posA, posB) {
    var s ='';
    var text = (posB-posA).toString();
    var yOffset = (Math.abs(posB-posA) < 50 ? Math.max(this.TextboxWidth(posA.toString()), this.TextboxWidth(posB.toString())) : 0);
    s += '<rect x="'+((posA+posB) / 2 - this.TextboxWidth(text) / 2)+'" y="'+(document.body.scrollTop+10+yOffset)+'" width="'+this.TextboxWidth(text)+'" height="'+this.TextboxHeight(text)+'" style="stroke:'+this.StrokeColor+'; fill:'+this.BackgroundColor+'; opacity:'+this.BackgroundOpacity+'" ></rect>';
    s += '<text text-anchor="Left" dominant-baseline="hanging" text x="'+((posA+posB) / 2 - this.TextWidth(text) / 2)+'" y="'+(document.body.scrollTop+15+yOffset)+'" font-family="'+this.FontFamily+'" font-size="'+this.FontSize+'" fill="'+this.FontColor+'" >'+(posB-posA)+'</text>';
    return s;
};

/**
 * @return {string}
 */
MBRulerGuideLines.prototype.PosYInfoField = function (pos) {
    var s ='';
    var text = pos.toString();
    s += '<rect x="'+(document.body.scrollLeft+10)+'" y="'+(pos - this.TextboxHeight(text) / 2)+'" width="'+this.TextboxWidth(text)+'" height="'+this.TextboxHeight(text)+'" style="stroke:'+this.StrokeColor+'; fill:'+this.BackgroundColor+'; opacity:'+this.BackgroundOpacity+'" ></rect>';
    s += '<text text-anchor="left" alignment-baseline="middle" text x="'+(document.body.scrollLeft+12)+'" y="'+(pos)+'" font-family="'+this.FontFamily+'" font-size="'+this.FontSize+'" fill="'+this.FontColor+'" >'+(pos)+'</text>';
    return s;
};

/**
 * @return {string}
 */
MBRulerGuideLines.prototype.DistYInfoField = function (posA, posB) {
    var s ='';
    var text = (Math.abs(posB-posA)).toString();
    var xOffset = (Math.abs(posB-posA) < 50 ? Math.max(this.TextboxWidth(posA.toString()), this.TextboxWidth(posB.toString())) : 0);
    s += '<rect x="'+(document.body.scrollLeft+10+xOffset)+'" y="'+((posA+posB) / 2 - this.TextboxWidth(text) / 2)+'" width="'+this.TextboxHeight(text)+'" height="'+this.TextboxWidth(text)+'" style="stroke:'+this.StrokeColor+'; fill:'+this.BackgroundColor+'; opacity:'+this.BackgroundOpacity+'" ></rect>';
    s += '<text text-anchor="Center" dominant-baseline="ideographic" text x="'+(document.body.scrollLeft+10+xOffset)+'" y="'+((posA+posB) / 2 - this.TextWidth(text) / 2)+'" font-family="'+this.FontFamily+'" font-size="'+this.FontSize+'" fill="'+this.FontColor+'" transform="rotate(90 '+(document.body.scrollLeft+10+xOffset)+' '+((posA+posB) / 2 - this.TextWidth(text) / 2)+')">'+(text)+'</text>';
    return s;
};

$(document).ready(function() {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return;
    }
    $('head').append('<link rel="stylesheet" href="guidelines/guidelines.css" type="text/css" media="screen" />');
});
