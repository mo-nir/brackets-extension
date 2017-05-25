/*global MBRulerTriangularRuler */
/*global MBRulerGrid */
/*global MBRulerGuideLines */
/*global $ */
/*global chrome */
/*global window */
/*global document */

/*jslint node: true */
/*jshint strict:false */

function AdjustClientareaSize() {
    "use strict";
    //var baseElements = $('.mbrulerbase')
    //console.log("AdjustClientareaSize("+document.body.scrollWidth+","+document.body.scrollHeight+")");

    $('.mbrulerbase').each(function (index, element) {
        $(element).css("width", (10) + "px");  //css("background-color" , "transparent");
        $(element).css("height", (10) + "px");  //css("background-color" , "transparent");
    });
    // die Größen erst verkleinern, damit nur der eigentliche Kontent bei der Größenberechnung heran gezogen wird
    $('.mbrulerbase').each(function (index, element) {
        $(element).css("width", (document.body.scrollWidth) + "px");  //css("background-color" , "transparent");
        $(element).css("height", (document.body.scrollHeight) + "px");  //css("background-color" , "transparent");
    });
}

var LastIconClickTime = [0, 0, 0, 0];
/**
 * @return {number}
 */
function MilliSecondsTime() {
    "use strict";
    var d = new Date();
    return d.getTime();
}

window.addEventListener("resize", function () {
        AdjustClientareaSize();
    }
);
document.addEventListener("scroll", function () {
        AdjustClientareaSize();
    }
);

function HideToggleBars() {
    "use strict";
    $(".MBRulerGuideLinesToggle").fadeOut(1000);
    $(".MBRulerTriangularToggle").fadeOut(1000);
    $(".MBRulerGridToggle").fadeOut(1000);
}

function ShowToggleBars(includeLayers) {
    "use strict";
    $(".MBRulerGuideLinesToggle").fadeIn(300);
    $(".MBRulerTriangularToggle").fadeIn(300);
    $(".MBRulerGridToggle").fadeIn(300);
}

$(document).ready(function () {
    "use strict";
    var div = document.createElement('div');

    document.body.appendChild(div);
    div.id = 'MBRulerView';
    div.classList.add("mbrulerbase");

    var myInnerHTML = '<div id="MBRulerGrid" class="mbrulerbase"></div>';
    myInnerHTML += '<div id="MBRulerTriangular" class="mbrulertriangular"></div>';
    myInnerHTML += '<div id="MBRulerGuideLines" class="mbrulerbase"></div>';
    myInnerHTML += '<div id="MBRulerNodes" class="mbrulerbase"><div id="MBRulerEndNode"></div></div>';
    myInnerHTML += '<div id="MBRulerLines" class="mbrulerbase"><div id="MBRulerEndLine"></div></div>';
    myInnerHTML += '<div id="MBRulerMenu" class="mbrulertriangular">' +
                       '<div id="MBRulerShowInstruments" class="MBRulerShowInstruments"></div>' +
                       '<div id="MBRulerHideInstruments" class="MBRulerHideInstruments"></div>' +
                       '<div id="MBRulerGridToggle" class="MBRulerGridToggle"></div><div id="MBRulerTriangularToggle" class="MBRulerTriangularToggle"></div><div id="MBRulerGuideLinesToggle" class="MBRulerGuideLinesToggle"></div>' +
                   '</div>';
    document.getElementById("MBRulerView").innerHTML = myInnerHTML;

    AdjustClientareaSize();

    var grid = new MBRulerGrid("rgb(255,0,0)");
    document.getElementById("MBRulerGridToggle").addEventListener("click", function () {
        //console.log("dt = " +( MilliSecondsTime() - LastIconClickTime));
        if (MilliSecondsTime() - LastIconClickTime[0] > 400) {
            //console.log("Click");
            grid.Visible = !grid.Visible;
            grid.Refresh();
            LastIconClickTime[0] = MilliSecondsTime();
        } else {
            //console.log("Double-Click");
            grid.Reset();
            grid.Visible = true;
            grid.Refresh();
            LastIconClickTime[0] = 0;
        }
        //console.log("LastIconClickTime = " + LastIconClickTime);
    });

    var triangularruler = new MBRulerTriangularRuler();
    document.getElementById("MBRulerTriangularToggle").addEventListener("click", function () {
        if (MilliSecondsTime() - LastIconClickTime[1] > 400) {
            //console.log("Click");
            triangularruler.Visible = !triangularruler.Visible;
            triangularruler.Refresh();
            LastIconClickTime[1] = MilliSecondsTime();
        } else {
            triangularruler.Reset();
            triangularruler.Visible = true;
            triangularruler.Refresh();
            LastIconClickTime[1] = 0;
        }
    });

    var guidelines = new MBRulerGuideLines();
    document.getElementById("MBRulerGuideLinesToggle").addEventListener("click", function () {
        if (MilliSecondsTime() - LastIconClickTime[2] > 400) {
            //console.log("Click");
            guidelines.Visible = !guidelines.Visible;
            guidelines.Refresh();
            LastIconClickTime[2] = MilliSecondsTime();
        } else {
            guidelines.Reset();
            guidelines.Visible = true;
            guidelines.Refresh();
            LastIconClickTime[2] = 0;
        }
    });

    document.getElementById("MBRulerHideInstruments").addEventListener("click", function () {
        if (MilliSecondsTime() - LastIconClickTime[3] > 400) {
            HideToggleBars(true);
            grid.Visible = false;
            grid.Refresh();

            triangularruler.Visible = false;
            triangularruler.Refresh();

            guidelines.Visible = false;
            guidelines.Refresh();

            localStorage['MB-Ruler MainControl visible'] = "0";

            LastIconClickTime[3] = MilliSecondsTime();
            $(".MBRulerHideInstruments").fadeOut(1000, function () {
                if (LastIconClickTime[3] !== 0) {
                    $(".MBRulerShowInstruments").fadeIn(300);
                }
            });
        } else {
            HideToggleBars(true);
            document.getElementById("MBRulerShowInstruments").style.display = "none";
            document.getElementById("MBRulerHideInstruments").style.display = "none";
            LastIconClickTime[3] = 0;
        }
    });

    document.getElementById("MBRulerShowInstruments").addEventListener("click", function () {
        ShowToggleBars(true);
        $(".MBRulerHideInstruments").fadeIn(300);
        $(".MBRulerShowInstruments").fadeOut(300);
        localStorage['MB-Ruler MainControl visible'] = "1";
    });

    if (localStorage['MB-Ruler MainControl visible'] === "0") {
        $(".MBRulerGuideLinesToggle").hide();
        $(".MBRulerTriangularToggle").hide();
        $(".MBRulerGridToggle").hide();
        $('.MBRulerHideInstruments').hide();

        $('.MBRulerShowInstruments').show();
    } else {
        $(".MBRulerGuideLinesToggle").show();
        $(".MBRulerTriangularToggle").show();
        $(".MBRulerGridToggle").show();
        $('.MBRulerHideInstruments').show();

        $('.MBRulerShowInstruments').hide();
    }
});
