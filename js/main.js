document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'interactive') {
        document.getElementById('content').style.visibility = "hidden";
    } else if (state == 'complete') {
        setTimeout(function () {
            document.getElementById('interactive');
            document.getElementById('whitescreen').style.visibility = "hidden";
            document.getElementById('content').style.visibility = "visible";
            setInterval(loading, 3000);
        }, 1000);
    }
};

var dir = 0;
var x = 50;
var y = 50;
var log = [];
var pr = [];
var prc = 0;
var winW = window.innerWidth;
var winH = window.innerHeight;
var rocks = [];
var rocksTypes = [];
var rocksElements = ["#rock1", "#rock2", "#rock3", "#rock4", "#rock5", "#rock6", "#rock7", "#rock8", "#rock9", "#rock10"];
var types = ["Mudstone", "Sandstone", "Shale", "Conglomerate", "Basalt", "Meteorite", "Cobalt", "Andesite"];
var lcrType = "";
var cPics = 0;
var slideIndex = 1;
var picsElements = ["#show-pic1", "#show-pic2", "#show-pic3", "#show-pic4", "#show-pic5", "#show-pic6", "#show-pic7", "#show-pic8", "#show-pic9", "#show-pic10"];
var currentMapBg = "url('images/mars-land.jpg')";

$(document).ready(function () {
    for (var i = 0; i < 10; i++) {
        rocks.push([0, 0]);
        xc = Math.floor(Math.random() * (winH - 150 - 60)) + 60;
        yc = Math.floor(Math.random() * (winW - 40 - 40)) + 40;
        rocks[i][0] = xc;
        rocks[i][1] = yc;
        $(rocksElements[i]).css({
            'top': xc,
            'left': yc
        });
        var type = types[Math.floor(Math.random() * types.length)];
        rocksTypes[i] = type;
    }
    roverCloseToRock();
});

$(document).ready(function () {
    var cmdBtn = $("#btn-command");
    cmdBtn.click(function () {
        var userCommand = document.getElementById("user-command").value.trim().toUpperCase(),
            cmd = userCommand.split(" ");
        document.getElementById("user-command").value = "";
        if (userCommand !== "" && userCommand !== "LOG") {
            log.unshift(userCommand);
        }
        if (cmd.length == 1) {
            if (cmd[0] == "LOG") {
                printLog();
                log.unshift("LOG");
            } else if (cmd[0] == "RCK") {
                collectRock();
            } else if (cmd[0] == "RLS") {
                releaseRock();
            } else if (cmd[0] == "PIC") {
                takePic();
            } else if (cmd[0] == "ANL") {
                rockAnalysis();
            }
        } else if (cmd.length == 2) {
            if (cmd[0] == "TRN" && cmd[1] == "L") {
                turnLeft();
            } else if (cmd[0] == "TRN" && cmd[1] == "R") {
                turnRight();
            }
        } else if (cmd.length == "3") {
            if (cmd[0] == "MOV" && cmd[1] == "F" && !(isNaN(cmd[2]))) {
                move(Math.abs(cmd[2]));
            } else if (cmd[0] == "MOV" && cmd[1] == "B" && !(isNaN(cmd[2]))) {
                move(-1 * Math.abs(cmd[2]));
            }
        }
    });
});

function printLog() {
    var logMsg = "Commands Executed Recently:\n";
    for (var i = 0; i < log.length; i++) {
        logMsg += log[i] + "\n";
    }
    alert(logMsg);
}

function help() {
    var helpMsg = "MOV - Moves the rover forward (F) or backward (B) by a specified number of steps.\nTRN -  Turns the rover left (L) or right (R) by 15 degrees.\nRCK - Collects rocks for analysis. The rover has a container for the rocks with a limited space and can collect no more than five rocks.\nRLS - Releases the last collected rock from the container. Executing this command five times makes the rover clean its container for rocks.\nANL - Performs a chemical analysis on the last collected rock.\nPIC - Takes a picture of the area. The rover can save up to ten photos.\nLOG - Prints the list of the commands executed recently.";
    alert(helpMsg);
}

function move(movs) {
    x += movs * Math.sin(dir * Math.PI / 180);
    y += movs * Math.cos(dir * Math.PI / 180);
    $("#rover").css({
        "top": x,
        "left": y
    });
    if (prc >= 5) {
        roverCloseToRockWarning();
    } else {
        roverCloseToRock();
    }
}

function turn() {
    $("#rover").css({
        'transform': 'rotate(' + dir + 'deg)'
    });
}

function turnRight() {
    dir += 15;
    if (dir >= 360) {
        dir -= 360;
    }
    turn();
}

function turnLeft() {
    dir += -15;
    if (dir < 0) {
        dir += 360;
    }
    turn();
}

function collectRock() {
    for (var r = 0; r < rocks.length; r++) {
        if (rocks[r] !== "0") {
            var rx = rocks[r][0],
                ry = rocks[r][1];
            if ((x >= rx - 55 && x <= rx + 15) && (y >= ry - 55 && y <= ry + 15)) {
                if (prc >= 5) {
                    alert("Rocks Container is full, can't collect more than five rocks!");
                    roverCloseToRockWarning();
                } else {
                    $(rocksElements[r]).css("display", "none");
                    pr.push(r);
                    rocks[r] = "0";
                    prc++;
                    $("#rockBtn").text("RCK(" + prc + ")");
                    lcrType = rocksTypes[pr[pr.length - 1]];
                }
            }
        }
    }
}

function releaseRock() {
    if (prc < 1) {
        alert("Rocks Container is empty!");
    } else {
        prc--;
        var lastRock = pr.pop();
        rocks[lastRock] = [x, y];
        lcrType = rocksTypes[pr[pr.length - 1]];
        $(rocksElements[lastRock]).css({
            'display': 'block',
            'top': x,
            'left': y
        });
        $("#rockBtn").text("RCK(" + prc + ")");
        roverCloseToRock();
    }
}

function roverCloseToRock() {
    for (var rock = 0; rock < rocks.length; rock++) {
        var rx = rocks[rock][0],
            ry = rocks[rock][1];
        if ((x >= rx - 55 && x <= rx + 15) && (y >= ry - 55 && y <= ry + 15)) {
            $(rocksElements[rock]).css("background", "#a6cb12");
        } else {
            $(rocksElements[rock]).css("background", "transparent");
        }
    }
}

function roverCloseToRockWarning() {
    for (var rock = 0; rock < rocks.length; rock++) {
        if (rock !== "0") {
            var rx = rocks[rock][0],
                ry = rocks[rock][1];
            if ((x >= rx - 55 && x <= rx + 15) && (y >= ry - 55 && y <= ry + 15)) {
                $(rocksElements[rock]).css("background", "#db2d43");
            } else {
                $(rocksElements[rock]).css("background", "transparent");
            }
        }
    }
}

function picsCount() {
    $("#picBtn").text("PIC(" + cPics + ")");
    if (cPics == 1) {
        $("#pics-count").text(cPics + " Picture");
    } else {
        $("#pics-count").text(cPics + " Pictures");
    }
}

function takePic() {
    if (cPics >= 10) {
        alert("The Rover can't save more than 10 pictures!");
    } else {
        for (var i = 0; i < 10; i++) {
            if ($(picsElements[i]).hasClass("empty")) {
                var newPic = $("#map").clone().appendTo($(picsElements[i]));
                $(picsElements[i]).addClass("not-empty");
                $(picsElements[i]).removeClass("empty");
                $(picsElements[i] + " #empty-pic").hide();
                break;
            }
        }
        newPic.css({
            'background': currentMapBg,
            'background-repeat': 'no-repeat'
        });
        cPics++;
        picsCount();
    }
}

function deletePics() {
    if (cPics > 0) {
        var ask = confirm("Delete all the saved pictures?");
        if (ask == true) {
            cPics = 0;
            for (var i = 0; i < 10; i++) {
                $(picsElements[i]).addClass("empty");
                $(picsElements[i]).removeClass("not-empty");
                $(picsElements[i] + " #empty-pic").show();
                $(picsElements[i] + " div").remove();
            }
            picsCount();
        }
    } else {
        alert("There is no pictures to delete.")
    }
}

function rockAnalysis() {
    $("#rock-analysis").show();
    var na2o = "2.5%", // Sodium oxide
        mgo = "8.1%", // Magnesium oxide
        al2o3 = "7.6%", // Aluminium oxide
        sio2 = "51.2%", // Silicon dioxide
        so3 = "4.2%", // Sulfur trioxide
        cl = "0.7%", // Chlorine
        k2o = "0.4%", // Potassium oxide
        cao = "7.1%", // Calcium oxide
        tio2 = "1.4%", // Titanium dioxide
        feo = "16.8%"; // Iron(II) oxide
    var anl = $("#analysis");
    if (prc !== 0) {
        $("#no-rocks").hide();
        type = "<b style='text-decoration: underline;'>>> Rock Type: </b>" + "<span class='green-c'>" + lcrType + "</span>";
        ch = "<br><br><b style='text-decoration: underline;'>>> Chemical elements:</b>";
        ch += "<br><b>Sodium oxide </b>(<i>Na<sub>2</sub>O</i>): " + "<span class='green-c'>" + na2o + "</span>";
        ch += "<br><b>Magnesium oxide </b>(<i>MgO</i>): " + "<span class='green-c'>" + mgo + "</span>";
        ch += "<br><b>Aluminium oxide </b>(<i>Al<sub>2</sub>O<sub>3</sub></i>): " + "<span class='green-c'>" + al2o3 + "</span>";
        ch += "<br><b>Silicon dioxide </b>(<i>SiO<sub>2</sub></i>): " + "<span class='green-c'>" + sio2 + "</span>";
        ch += "<br><b>Sulfur trioxide </b>(<i>SO<sub>3</sub></i>): " + "<span class='green-c'>" + so3 + "</span>";
        ch += "<br><b>Chlorine </b>(<i>Cl</i>): " + "<span class='green-c'>" + cl + "</span>";
        ch += "<br><b>Potassium oxide </b>(<i>K<sub>2</sub>O</i>): " + "<span class='green-c'>" + k2o + "</span>";
        ch += "<br><b>Calcium oxide </b>(<i>CaO</i>): " + "<span class='green-c'>" + cao + "</span>";
        ch += "<br><b>Titanium dioxide </b>(<i>TiO<sub>2</sub></i>): " + "<span class='green-c'>" + tio2 + "</span>";
        ch += "<br><b>Iron(II) oxide </b>(<i>FeO</i>): " + "<span class='green-c'>" + feo + "</span>";
        all = type + ch;
        $("#an").text("");
        var i = 0;
        var txt = "Analysing...";
        var speed = 50;

        function typeWriter() {
            if (i < txt.length) {
                document.getElementById("an").innerHTML += txt.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
        $("#loading-anl #bar").show();

        function main() {
            document.getElementById("an").innerHTML = "Analysis Results";
            anl.append(all);
            anl.fadeIn(500);
            $("#anl-ok").show();
            $("#loading-anl #bar").hide();
        }
        setTimeout(main, 2020);
    } else {
        $("#an").text("Chemical Analysis On The Last Collected Rock");
        $("#loading-anl #bar").hide();
        $("#no-rocks").show();
        $("#anl-ok").hide();
    }
}

function toggleToolsBar() {
    var toolsBar = $("#tools-bar"),
        icon = $("#toggle-tools-icon"),
        removeIcon = "fa-minus-circle",
        gearIcon = "fa-cog";
    if (toolsBar.is(":visible")) {
        toolsBar.toggle(400);
        icon.removeClass(removeIcon);
        icon.addClass(gearIcon);
    } else {
        toolsBar.toggle(400);
        icon.removeClass(gearIcon);
        icon.addClass(removeIcon);
    }
}

function loading() {
    $("#loading").fadeOut(900);
}

$(document).ready(function () {
    var moveBtn = $("#btn-mov"),
        trnLBtn = $("#trn-l"),
        trnRBtn = $("#trn-r"),
        logBtn = $("#log"),
        helpBtn = $("#help"),
        rockBtn = $("#rockBtn"),
        rlsBtn = $("#rlsBtn"),
        picBtn = $("#picBtn"),
        anlBtn = $("#anlBtn"),
        anlOk = $("#anl-ok"),
        nextPicBtn = $("#next-pic"),
        prevPicBtn = $("#prev-pic"),
        userCmd = $("#user-command"),
        sc1 = $("#s-c-1"),
        sc2 = $("#s-c-2"),
        sBg1 = $("#s-bg-1"),
        sBg2 = $("#s-bg-2"),
        sBg3 = $("#s-bg-3"),
        showPics = $("#show-pics"),
        closePics = $("#close-pics"),
        dltPic = $("#remove-pic"),
        closeAnl = $("#close-anl");
    var body = $("body"),
        color1 = "#C34832",
        color2 = "#DF6032",
        bg1 = "url('images/mars-land.jpg')",
        bg2 = "url('images/mars-land-2.jpg')",
        bg3 = "url('images/mars-land-3.jpg')";

    // Move
    moveBtn.click(function () {
        var direction = document.getElementById("back-forw");
        direction = direction.options[direction.selectedIndex].value;
        var movs = document.getElementById("movs");
        movs = Math.abs(movs.value);
        log.unshift("MOV " + direction + " " + movs);
        if (direction == "F") {
            move(movs);
        } else {
            move(-1 * movs);
        }
    });
    // Trun Left
    trnLBtn.click(function () {
        log.unshift("TRN L");
        turnLeft();
    });
    // Trun Right
    trnRBtn.click(function () {
        log.unshift("TRN R");
        turnRight();
    });
    // Collect Rocks
    rockBtn.click(function () {
        log.unshift("RCK");
        collectRock();
    });
    // Release The Last Collected Rock
    rlsBtn.click(function () {
        log.unshift("RLS");
        releaseRock();
    });
    // Analyse Rocks
    anlBtn.click(function () {
        log.unshift("ANL");
        rockAnalysis();
    });
    // Take A Picture
    picBtn.click(function () {
        log.unshift("PIC");
        takePic();
    });
    // Print LOG
    logBtn.click(function () {
        printLog();
        log.unshift("LOG");
    });
    // Remove All Pictures
    dltPic.click(function () {
        deletePics();
    });
    // Next/previous Controls
    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("show-pic");
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }
    // Next Picture
    nextPicBtn.click(function () {
        plusSlides(1);
    });
    // Previous Picture
    prevPicBtn.click(function () {
        plusSlides(-1);
    });
    // Change Surface Color/BG
    function bgOptions() {
        body.css({
            'background-repeat': 'no-repeat'
        });
    }
    sc1.click(function () {
        body.css("background", color1);
        currentMapBg = color1;
    });
    sc2.click(function () {
        body.css("background", color2);
        currentMapBg = color2;
    });
    sBg1.click(function () {
        body.css("background-image", bg1);
        bgOptions();
        currentMapBg = bg1;
    });
    sBg2.click(function () {
        body.css("background-image", bg2);
        bgOptions();
        currentMapBg = bg2;
    });
    sBg3.click(function () {
        body.css("background-image", bg3);
        bgOptions();
        currentMapBg = bg3;
    });
    // Show/Hide Token Pictures
    showPics.click(function () {
        $("#pics").show();
    });
    closePics.click(function () {
        $("#pics").hide();
    });
    // Close Rock Analysis
    closeAnl.click(function () {
        $("#rock-analysis").hide();
        $("#analysis").text("");
        $("#anl-ok").hide();
    });
    anlOk.click(function () {
        $("#rock-analysis").hide();
        $("#analysis").text("");
        $(this).hide();
    });
    // Hide Control Buttons When Typing
    userCmd.focusin(function () {
        $("#cmd-btns").hide();
    });
    userCmd.focusout(function () {
        $("#cmd-btns").show();
    });
    // Help
    helpBtn.click(function () {
        help();
    });
});