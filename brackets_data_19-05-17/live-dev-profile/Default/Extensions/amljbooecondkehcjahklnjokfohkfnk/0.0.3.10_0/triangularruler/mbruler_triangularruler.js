/*global MBRulerPoint */
/*global $ */
/*global chrome */
/*global document */
/*global window */
/*jshint strict:false */

function MBRulerTriangularRuler() {

    var localthis = this;

    this.Visible = !(window.chrome && chrome.runtime && chrome.runtime.id);
    //this.Visible = false;

    this.MinGridSize = 10;
    this.Color = "rgb(255,0,0)";
    this.StrokeWidth = 1;
    this.Opacity = 0.5;

    var screenCenterX = document.body.scrollLeft + 0.5 * window.innerWidth;
    var screenCenterY = document.body.scrollTop + 0.75 * window.innerHeight;
    var triangleSize = 0.25 * window.innerWidth;

    this.AnglePointRight = new MBRulerPoint(localthis, "B1", 10, screenCenterX + triangleSize, screenCenterY, 'red', "move", null, function () {
        localthis.AnglePointLeft.SetPosition(localthis.Origin.X + (localthis.Origin.X - localthis.AnglePointRight.X), localthis.Origin.Y + (localthis.Origin.Y - localthis.AnglePointRight.Y));
        localthis.CreateRuler();
    }, null);

    this.AnglePointLeft = new MBRulerPoint(localthis, "B2", 10, screenCenterX - triangleSize, screenCenterY, 'red', "move", null, function () {
        localthis.AnglePointRight.SetPosition(localthis.Origin.X + (localthis.Origin.X - localthis.AnglePointLeft.X), localthis.Origin.Y + (localthis.Origin.Y - localthis.AnglePointLeft.Y));
        localthis.CreateRuler();
    }, null);

    this.Origin = new MBRulerPoint(localthis, "A", 10, screenCenterX, screenCenterY, 'red', "move", function () {
        localthis.OriginMemX = localthis.Origin.X;
        localthis.OriginMemY = localthis.Origin.Y;
    }, function () {
        localthis.AnglePointRight.MovePosition(localthis.Origin.X - localthis.OriginMemX, localthis.Origin.Y - localthis.OriginMemY);
        localthis.AnglePointLeft.MovePosition(localthis.Origin.X - localthis.OriginMemX, localthis.Origin.Y - localthis.OriginMemY);

        localthis.OriginMemX = localthis.Origin.X;
        localthis.OriginMemY = localthis.Origin.Y;
        localthis.CreateRuler();
    }, null);

    this.DistancePoint = new MBRulerPoint(localthis, "D", 10, screenCenterX, screenCenterY - 40, 'blue', "move", null, function () {
        localthis.DistancePointMoved = true;
        localthis.CreateRuler();
    }, null);
    localthis.DistancePointMoved = false;

    localthis.OriginMemX = this.Origin.X;
    localthis.OriginMemY = this.Origin.Y;

    window.addEventListener("resize", function () {
            localthis.CreateRuler();
        }
    );
    document.addEventListener("scroll", function () {
            localthis.CreateRuler();
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

MBRulerTriangularRuler.prototype.Visible = undefined;
MBRulerTriangularRuler.prototype.Origin = undefined;
MBRulerTriangularRuler.prototype.OriginMemX = undefined;
MBRulerTriangularRuler.prototype.OriginMemY = undefined;
MBRulerTriangularRuler.prototype.AnglePointRight = undefined;
MBRulerTriangularRuler.prototype.AnglePointLeft = undefined;

MBRulerTriangularRuler.prototype.DistancePoint = undefined;
MBRulerTriangularRuler.prototype.DistancePointMoved = undefined;

MBRulerTriangularRuler.prototype.MinGridSize = undefined;
MBRulerTriangularRuler.prototype.Color = undefined;
MBRulerTriangularRuler.prototype.StrokeWidth = undefined;
MBRulerTriangularRuler.prototype.Opacity = undefined;

MBRulerTriangularRuler.prototype.Refresh = function () {
    this.Origin.Refresh();
    this.AnglePointRight.Refresh();
    this.AnglePointLeft.Refresh();
    this.DistancePoint.Refresh();
    this.CreateRuler();
};

MBRulerTriangularRuler.prototype.Reset = function () {
    var localthis = this;
    var screenCenterX = document.body.scrollLeft + 0.5 * window.innerWidth;
    var screenCenterY = document.body.scrollTop + 0.75 * window.innerHeight;
    var triangleSize = 0.25 * window.innerWidth;
    localthis.Origin.SetPosition(screenCenterX, screenCenterY);
    localthis.AnglePointRight.SetPosition(screenCenterX + triangleSize, screenCenterY);
    localthis.AnglePointLeft.SetPosition(screenCenterX - triangleSize, screenCenterY);
    localthis.DistancePointMoved = false;
    localthis.Refresh();
};

MBRulerTriangularRuler.prototype.WritePersistenceInformation = function () {
    var localthis = this,
        s = "1"; // Version
    s += ";" + (localthis.Visible ? "1" : "0");
    s += ";" + localthis.Origin.X + ";" + localthis.Origin.Y;
    s += ";" + localthis.AnglePointRight.X + ";" + localthis.AnglePointRight.Y;
    s += ";" + localthis.AnglePointLeft.X + ";" + localthis.AnglePointLeft.Y;
    s += (localthis.DistancePointMoved ? ";" + localthis.DistancePoint.X + ";" + localthis.DistancePoint.Y : ";;");

    localStorage['MB-Ruler Triangular Ruler'] = s;
};

MBRulerTriangularRuler.prototype.ReadPersistenceInformation = function () {
    var details = localStorage['MB-Ruler Triangular Ruler'].split(";");
    if (details[0] === "1") {
        if (details[1] === "1") {
            this.Visible = true;
            this.Origin.SetPosition(parseFloat(details[2]), parseFloat(details[3]));
            this.AnglePointRight.SetPosition(parseFloat(details[4]), parseFloat(details[5]));
            this.AnglePointLeft.SetPosition(parseFloat(details[6]), parseFloat(details[7]));
            if (details[8].length === 0) {
                this.DistancePointMoved = false;
            } else {
                this.DistancePointMoved = true;
                this.DistancePoint.setPosition(parseFloat(details[8]), parseFloat(details[9]));
            }
        } else {
            this.Visible = false;
        }
    }
};

/**
 * @return {string}
 */
MBRulerTriangularRuler.prototype.LineStyle = function () {
    return 'stroke:' + this.Color + ';stroke-width:' + this.StrokeWidth + '; opacity: ' + this.Opacity;
};

/**
 * @return {string}
 */
MBRulerTriangularRuler.prototype.GreenLineStyle = function () {
    return 'stroke:rgb(0,128,0);stroke-width:' + this.StrokeWidth + '; opacity: 0.9';
};

/**
 * @return {string}
 */
MBRulerTriangularRuler.prototype.RedLineStyle = function () {
    return 'stroke:rgb(255,0,0);stroke-width:' + this.StrokeWidth + '; opacity: 1.0; fill:none';
};

function angleBetweenPoints(p1, p2) {
    if (p1.X === p2.X && p1.Y === p2.Y) {
        return Math.PI / 2;
    } else {
        return Math.atan2(p2.Y - p1.Y, p2.X - p1.X);
    }
}

function toDegrees(rad) {
    return rad * (180 / Math.PI);
}

function pointDist(x1, y1, x2, y2) {
    //var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function PointDist(A, B) {
    return pointDist(A.X, A.Y, B.X, B.Y);
}

/**
 * @return {number}
 */
function CalcAngle2(dx, dy) {
    var result = 0;
    if (dy > 0) {
        if (dx < 0) {
            result = -Math.atan(dy / dx);
        } else {
            if (dx > 0) {
                result = Math.PI - Math.atan(dy / dx);
            } else {
                result =  Math.PI / 2;
            }
        }
    } else {
        if (dx < 0) {
            result = 2 * Math.PI -  Math.atan(dy / dx);
        } else {
            if (dx > 0) {
                result = Math.PI - Math.atan(dy / dx);
            } else {
                result = 3 * Math.PI / 2;
            }
        }
    }
    return result;
}

/**
 * @return {number}
 */
function CalcAngle3(A, M, B) {
    var ang1 = 180 / Math.PI * CalcAngle2(A.X - M.X, A.Y - M.Y);
    var ang2 = 180 / Math.PI * CalcAngle2(B.X - M.X, B.Y - M.Y);
    ang1 += 180;
    if (ang1 > 360) { ang1 -= 360; }
    ang2 += 180;
    if (ang2 > 360) { ang2 -= 360; }
    //ang1 -= 180;
    //ang2 -= 180;
    var result = ang1 - ang2;
    while (result >= 360) { result -= 360; }
    while (result < 0) { result += 360; }
    return result;
}

/**
 * @return {string}
 */
MBRulerTriangularRuler.prototype.GetTransform = function () {

    var angle = toDegrees(angleBetweenPoints(this.Origin, this.AnglePointRight));
    var scale = pointDist(this.Origin.X, this.Origin.Y,  this.AnglePointRight.X, this.AnglePointRight.Y) / 100.0;

    this.StrokeWidth = 0.8 / scale;

    return 'translate(' + this.Origin.X + ' ' + this.Origin.Y + ')  scale(' + scale + ') rotate(' + angle + ' 0 0) ';
    //return 'rotate('+(angle)+' 0 0)';
    //return 'rotate(20 100 100) translate(100 200) scale(3)';
};

/**
 * @return {number}
 */
MBRulerTriangularRuler.prototype.ValueLength = function () {
    return Math.round(100.0 * PointDist(this.Origin, this.DistancePoint)) / 100.0;
};

/**
 * @return {number}
 */
MBRulerTriangularRuler.prototype.ValueAngle = function () {
    var angle = CalcAngle3(this.DistancePoint, this.Origin, this.AnglePointRight);
    if (angle < 0) {
        angle += 180;
    }
    return Math.round(100.0 * angle) / 100.0;
};

MBRulerTriangularRuler.prototype.AdjustDistancePoint = function () {
    if (!this.DistancePointMoved) {
        var angle = angleBetweenPoints(this.Origin, this.AnglePointRight) - Math.PI / 2;
        this.DistancePoint.SetPosition(this.Origin.X + 40 * Math.cos(angle), this.Origin.Y + 40 * Math.sin(angle));
    }
};

/**
 * @return {string}
 */
MBRulerTriangularRuler.prototype.GreenSvgLine = function (x1, y1, x2, y2) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2= "' + x2 + '" y2="' + y2 + '" style="' + this.GreenLineStyle() + '" />';
};

function isOdd(num) { return num % 2; }

MBRulerTriangularRuler.prototype.CreateRuler = function () {
    var transform = this.GetTransform();
    var angle = toDegrees(angleBetweenPoints(this.Origin, this.AnglePointRight));

    this.AdjustDistancePoint();

    var s = "";
    if (this.Visible) {
        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">'; //    preserveAspectRatio="xMidYMid meet"
        //s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + (document.body.scrollWidth) + 'px" height="' + (document.body.scrollHeight) + 'px" preserveAspectRatio="xMidYMid meet">';
        var percentageHeight = (document.body.clientHeight !== 0 ? document.body.scrollHeight / document.body.clientHeight * 100 : 100);
        var percentageWidth = (document.body.clientWidth !== 0 ? document.body.scrollWidth / document.body.clientWidth * 100 : 100);
        s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + (percentageWidth-1) + '%" height="' + (percentageHeight-1) + '%"  preserveAspectRatio="xMidYMid meet">';

        s += '<g transform="' + transform + '" >';
        s += '<line x1="-100" y1=  "0" x2="100" y2=  "0" style="' + this.GreenLineStyle() + '" />';
        s += '<line x1=   "0" y1="-100" x2="100" y2=  "0" style="' + this.GreenLineStyle() + '" />';
        s += '<line x1="-100" y1="0" x2=    "0" y2="-100" style="' + this.GreenLineStyle() + '" />';
        s += '<line x1="0" y1="0" x2=    "0" y2="-100" style="' + this.GreenLineStyle() + '" />';

        s += '<line x1="0" y1="0" x2=    "-50" y2="-50" style="' + this.GreenLineStyle() + '" />';
        s += '<line x1="0" y1="0" x2=    "50" y2="-50" style="' + this.GreenLineStyle() + '" />';

        var i = 0;
        var scale = pointDist(this.Origin.X, this.Origin.Y,  this.AnglePointRight.X, this.AnglePointRight.Y) / 100.0;
        // Linien auf der Hypothenuse
        for (i = 0; i <= 9 * scale; i++) {
            if (i !== 0) {
                s += '<line x1="' + (i * 10 / scale) + '" y1=  "0" x2="' + (i * 10 / scale) + '" y2=  "-2" style="' + this.GreenLineStyle() + '" />';
                s += '<line x1="' + (-i * 10 / scale) + '" y1=  "0" x2="' + (-i * 10 / scale) + '" y2=  "-2" style="' + this.GreenLineStyle() + '" />';
            }
        }

        var cosVal = 0,
            sinVal = 0,
            innerRadius = 0,
            outerRadius = 0;

        for (i = 1; i <= 17; i++) {
            if ((i !== 0) && (i !== 9)) {
                cosVal = Math.cos(Math.PI / 180.0 * i * 5);
                sinVal = Math.sin(Math.PI / 180.0 * i * 5);
                innerRadius = 0;
                outerRadius = 0;
                if (isOdd(i)) {
                    innerRadius = 68.5;
                    outerRadius = 70.71067811865475;
                } else {
                    innerRadius = 65;
                    outerRadius = 70.71067811865475;
                }
                s += this.GreenSvgLine(sinVal * innerRadius, -cosVal * innerRadius, sinVal * outerRadius, -cosVal * outerRadius);
                s += this.GreenSvgLine(-sinVal * innerRadius, -cosVal * innerRadius, -sinVal * outerRadius, -cosVal * outerRadius);

                // Gradzahlen schreiben
                if (!isOdd(i)) {
                    innerRadius = 60;
                    s += '<text text-anchor="middle" alignment-baseline="middle" x="' + (sinVal * innerRadius) + '" y="' + (-cosVal * innerRadius) + '" stroke="#AAAAAA" stroke-width="0.05" fill="#111111" style="font-size:4.9px" transform="rotate(' + (i * 5) + ' ' + (sinVal * innerRadius) + ' ' + (-cosVal * innerRadius) + ')" >' + (90 - i * 5) + '</text>';
                    s += '<text text-anchor="middle" alignment-baseline="middle" x="' + (-sinVal * innerRadius) + '" y="' + (-cosVal * innerRadius) + '" stroke="#AAAAAA" stroke-width="0.05" fill="#111111" style="font-size:4.9px"  transform="rotate(' + (-i * 5 ) + ' ' + (-sinVal * innerRadius) + ' ' + (-cosVal * innerRadius) + ')" >' + (90 + i * 5) + '</text>';

                    innerRadius = 55;
                    s += '<text text-anchor="middle" alignment-baseline="middle" x="' + (sinVal * innerRadius) + '" y="' + (-cosVal * innerRadius) + '" stroke="#AAAAAA" stroke-width="0.05" fill="#111111" style="font-size:4.9px" transform="rotate(' + (i * 5) + ' ' + (sinVal * innerRadius) + ' ' + (-cosVal * innerRadius) + ')" >' + (90 + i * 5) + '</text>';
                    s += '<text text-anchor="middle" alignment-baseline="middle" x="' + (-sinVal * innerRadius) + '" y="' + (-cosVal * innerRadius) + '" stroke="#AAAAAA" stroke-width="0.05" fill="#111111" style="font-size:4.9px"  transform="rotate(' + (-i * 5) + ' ' + (-sinVal * innerRadius) + ' ' + (-cosVal * innerRadius) + ')" >' + (90 - i * 5) + '</text>';
                }
            }
            //s +='<line x1="'+(i*10)+'" y1=  "0" x2="'+(i*10)+'" y2=  "-2" style="'+this.GreenLineStyle()+'" transform="'+transform+'" />';
        }
        i = 0;
        innerRadius = 57.5;
        cosVal = Math.cos(Math.PI / 180.0 * i * 5);
        sinVal = Math.sin(Math.PI / 180.0 * i * 5);
        s += '<text text-anchor="middle" alignment-baseline="middle" x="' + (sinVal * innerRadius) + '" y="' + (-cosVal * innerRadius) + '" stroke="#AAAAAA" stroke-width="0.05" fill="black" style="font-size:5px" transform="rotate(' + (i * 4.5) + ' ' + (sinVal * innerRadius) + ' ' + (-cosVal * innerRadius) + ')" >' + (90 - i * 5) + '</text>';

        s += '<path d="M70.71067811865475 0 A 70.71067811865475 70.71067811865475 0 0 0 -70.71067811865475 0" fill="none" style="' + this.GreenLineStyle() + '"/>';

        if (this.DistancePointMoved) {
            var circleCenterY = -40;
            s += '<circle cx="0" cy="' + circleCenterY + '" r="8" fill="#CCCCCC" stroke="black" stroke-width="0.1" />';
            s += '<text text-anchor="middle" alignment-baseline="middle" x="0" y="-41.7" style="font-size:2.8px" transform="rotate(' + (-angle) + ' 0 ' + circleCenterY + ')">d=' + this.ValueLength() + '</text>';
            s += '<text text-anchor="middle" alignment-baseline="middle" x="0" y="-37.0" style="font-size:2.8px" transform="rotate(' + (-angle) + ' 0 ' + circleCenterY + ')">&alpha;=' + this.ValueAngle() + '°</text>';

            var ax = 10 * Math.cos(this.ValueAngle()*Math.PI / 180 );
            var ay = -10 * Math.sin(this.ValueAngle()*Math.PI / 180 );
            if (this.ValueAngle() <= 180) {
                s += '<path d="M10 0 A 10 10 0 0 0 ' + ax + ' ' + ay + '" fill="none" style="' + this.RedLineStyle() + '"/>';
            } else {
                s += '<path d="M10 0 A 10 10 0 1 0 ' + ax + ' ' + ay + '" fill="none" style="' + this.RedLineStyle() + '"/>';
            }
        }

        s += '</g>';

        s += '<line x1="' + (this.Origin.X) + '" y1="' + (this.Origin.Y) + '" x2= "' + (this.DistancePoint.X) + '" y2="' + (this.DistancePoint.Y) + '" style="' + this.RedLineStyle() + '" />';

        s += '</svg>';
    }
    //console.log(s);
    document.getElementById("MBRulerTriangular").innerHTML = s;
    this.WritePersistenceInformation();
};

$(document).ready(function () {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return;
    }
    $('head').append('<link rel="stylesheet" href="triangularruler/mbruler_triangularruler.css" type="text/css" media="screen" />');
});