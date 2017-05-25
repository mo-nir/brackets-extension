/*global MBRulerPoint */
/*global $ */
/*global chrome */
/*global window */
/*global document */
/*jshint strict:false */

function MBRulerGrid(color) {
    var localthis = this;

    this.Visible = !(window.chrome && chrome.runtime && chrome.runtime.id);
    //this.Visible = false;

    this.MinGridSize = 10;
    this.Color = color; //"rgb(255,0,0)";
    this.StrokeWidth = 1;
    this.Opacity = 0.5;

    this.OriginRef1 = new MBRulerPoint(localthis, "A", 10, 100, 100, 'red', "move", null, function () {
        // Mousemove
        localthis.CreateGrid(true);
    }, function () {
        // Mouseup
        localthis.CreateGrid(false);
    });
    this.OriginRef2 = new MBRulerPoint(localthis, "B", 10, 200, 200, 'red', "move", null, function () {
        //MouseMove
        localthis.CreateGrid(true);
    }, function () {
        // Mouseup
        localthis.CreateGrid(false);
    });

    window.addEventListener("resize", function () {
            localthis.CreateGrid(false);
        }
    );
    document.addEventListener("scroll", function () {
            localthis.CreateGrid(false);
        }
    );

    try {
        localthis.ReadPersistenceInformation();
        localthis.Refresh();
    }
    catch (err) {
        localthis.Visible = !(window.chrome && chrome.runtime && chrome.runtime.id);
        localthis.Reset();
    }
}

MBRulerGrid.prototype.Visible = undefined;

MBRulerGrid.prototype.OriginRef1 = undefined;
MBRulerGrid.prototype.OriginRef2 = undefined;

MBRulerGrid.prototype.MinGridSize = undefined;
MBRulerGrid.prototype.Color = undefined;
MBRulerGrid.prototype.StrokeWidth = undefined;
MBRulerGrid.prototype.Opacity = undefined;

MBRulerGrid.prototype.WritePersistenceInformation = function () {
    var localthis = this,
        s = "1"; // Version
    s += ";" + (localthis.Visible ? "1" : "0");
    s += ";" + localthis.OriginRef1.X + ";" + localthis.OriginRef1.Y;
    s += ";" + localthis.OriginRef2.X + ";" + localthis.OriginRef2.Y;

    localStorage['MB-Ruler Grid'] = s;
};

MBRulerGrid.prototype.ReadPersistenceInformation = function () {
    var details = localStorage['MB-Ruler Grid'].split(";");
    if (details[0] === "1") {
        if (details[1] === "1") {
            this.Visible = true;
            this.OriginRef1.SetPosition(parseFloat(details[2]), parseFloat(details[3]));
            this.OriginRef2.SetPosition(parseFloat(details[4]), parseFloat(details[5]));
        } else {
            this.Visible = false;
        }
    }
};

MBRulerGrid.prototype.Refresh = function () {
    this.OriginRef1.Refresh();
    this.OriginRef2.Refresh();
    this.CreateGrid(false);
};

MBRulerGrid.prototype.Reset = function () {
    var localthis = this;
    localthis.OriginRef1.SetPosition(100, 100);
    localthis.OriginRef2.SetPosition(200, 200);
    localthis.Refresh();
};

MBRulerGrid.prototype.SetColor = function (color) {
    this.Color = color; //"rgb(255,0,0)";
};

/**
 * @return {string}
 */
MBRulerGrid.prototype.LineStyle = function () {
    return 'stroke:' + this.Color + ';stroke-width:' + this.StrokeWidth + '; opacity: ' + this.Opacity;
};

MBRulerGrid.prototype.CreateGrid = function (showgridsize) {
    var s = '';

    if (this.Visible) {
        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="' + (document.body.scrollHeight / document.body.clientHeight * 100) + '%"  preserveAspectRatio="xMidYMid meet">';

        var percentageHeight = (document.body.clientHeight !== 0 ? document.body.scrollHeight / document.body.clientHeight * 100 : 100);
        var percentageWidth = (document.body.clientWidth !== 0 ? document.body.scrollWidth / document.body.clientWidth * 100 : 100);
        s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + (percentageWidth-1) + '%" height="' + (percentageHeight-1) + '%"  preserveAspectRatio="xMidYMid meet">';

        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"  preserveAspectRatio="xMidYMid meet">';
        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + (document.body.scrollWidth) + 'px" height="' + (document.body.scrollHeight) + 'px" preserveAspectRatio="xMidYMid meet">';

        var distX = Math.max(this.MinGridSize, Math.abs(this.OriginRef1.X - this.OriginRef2.X));
        var x = 0;
        x = this.OriginRef1.X;
        s += '<line x1="' + (x) + '" y1="0" x2="' + (x) + '" y2="' + (document.body.scrollHeight) + '" style="' + this.LineStyle() + '" />';
        while (x - distX >= 0) {
            x -= distX;
            s += '<line x1="' + (x) + '" y1="0" x2="' + (x) + '" y2="' + (document.body.scrollHeight) + '" style="' + this.LineStyle() + '" />';
        }
        x = this.OriginRef1.X;
        while (x + distX <= document.body.scrollWidth) {
            x += distX;
            s += '<line x1="' + (x) + '" y1="0" x2="' + (x) + '" y2="' + (document.body.scrollHeight) + '" style="' + this.LineStyle() + '" />';
        }

        var distY = Math.max(this.MinGridSize, Math.abs(this.OriginRef1.Y - this.OriginRef2.Y));
        var y = 0;
        y = this.OriginRef1.Y;
        s += '<line x1="0" y1="' + (y) + '" x2="' + (document.body.scrollWidth) + '" y2="' + (y) + '" style="' + this.LineStyle() + '" />';
        while (y - distY >= 0) {
            y -= distY;
            s += '<line x1="0" y1="' + (y) + '" x2="' + (document.body.scrollWidth) + '" y2="' + (y) + '" style="' + this.LineStyle() + '" />';
        }
        y = this.OriginRef1.Y;
        while (y + distY <= document.body.scrollHeight) {
            y += distY;
            s += '<line x1="0" y1="' + (y) + '" x2="' + (document.body.scrollWidth) + '" y2="' + (y) + '" style="' + this.LineStyle() + '" />';
        }

        if (showgridsize) {
            s += '<g>';
            s += '<rect x="' + (document.body.scrollLeft + 15) + '" y="' + (document.body.scrollTop + 15) + '" width="250" height="30" fill="lightgrey" stroke="black" ></rect>';
            s += '<text x="' + (document.body.scrollLeft + 15 + 10) + '" y="' + (document.body.scrollTop + 15 + 22) + '" font-family="Verdana" font-size="16" fill="blue" >grid size: ' + distX + 'px * ' + distY + 'px</text>';
            s += '</g>';
        }

        s += '</svg>';
        //console.log(s);
    }
    document.getElementById("MBRulerGrid").innerHTML = s;

    this.WritePersistenceInformation();
};

$(document).ready(function () {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return;
    }
    $('head').append('<link rel="stylesheet" href="grid/mbruler_grid.css" type="text/css" media="screen" />');
});