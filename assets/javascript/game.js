$(document).ready(function () {

    // Initialize characters
    var character = {
        id: ["Cloud", "Squall", "Lightning", "Noctis"],
        hp: [100, 120, 140, 160],
        atk: [22, 18, 14, 10],
        ct: [15, 20, 25, 30],
        clr: ["rgba(63, 168, 230, 0.7)", "rgba(17, 153, 46, 0.6)", "rgba(199, 60, 136, 0.7)", "rgba(56, 56, 56, 0.7)"]
    }

    var mainChar = "";
    var enemyList = ["", "", ""];
    var attacker = 0;
    var defender = 0;

    var winHeight = ($(window).height() - 450) / 2 + $(window).scrollTop();
    var winWidth = ($(window).width() - 300) / 2 + $(window).scrollLeft();

    var gameStatus = "ready";
    var aniSpeed = 600;

    // Display logo
    $("#logo").css({ top: winHeight - 250, left: winWidth - 150 });
    $("#ff").css({ top: winHeight + 180, left: winWidth - 200 });
    $("footer").css("right", winWidth + 40);

    // Create characters
    var mainScreen = $(".container");

    for (var i = 0; i < character.id.length; i++) {
        // Put the element at the center of screen
        var char = $("<div class='character'>").attr("id", character.id[i]).css({
            top: winHeight,
            left: (winWidth + i * 300 - 450)
        });

        var pic = $("<img>").attr({
            alt: character.id[i],
            id: character.id[i] + "Pic",
            src: "./assets/images/" + character.id[i] + ".png",
            class: "charPic",
            hp: character.hp[i],
            atk: character.atk[i],
            ct: character.ct[i]
        });

        var nameBox = $("<div class='overlay'>").attr("id", character.id[i] + "Tag").css("background-color", character.clr[i]);
        var nameText = $("<div class='charName'>").text(character.id[i]).attr("id", character.id[i] + "Name");

        nameBox.append(nameText);

        char.append(pic);
        char.append(nameBox);
        mainScreen.append(char);
        char.hide();
    }

    // Create 'attack' button and 'vs' sign
    var atkBtn = $("<button>").text("ATTACK").attr("id", "attack");
    atkBtn.css({ position: "absolute", top: winHeight + 470, left: winWidth - 200 });
    mainScreen.append(atkBtn);
    atkBtn.hide();

    // Start game button
    $("html").on("click", function () {
        if (gameStatus === "ready") {
            gameStatus = "select";
            $("#logo").animate({ top: 0, left: 160, width: 165, height: 200 }, aniSpeed);
            $("#ff").animate({ top: 80, left: 100, width: 350, height: 67 }, aniSpeed);
            $("footer").animate({ right: 50 }, aniSpeed);
            for (var i = 0; i < character.id.length; i++) {
                $("#" + character.id[i]).delay(i * 300).fadeIn(aniSpeed);
            }
        }
    });

    // Select characters
    $(".charPic").on("click", function () {
        if (gameStatus === "select") {
            var selection = $(this).attr("id");
            selection = selection.substring(0, selection.length - 3)
            if (mainChar === "") {
                mainChar = selection;
                selectedMainChar(selection);
            } else if (mainChar != selection && enemyList[0] === "") {
                enemyList[0] = selection;
                firstEnemy(selection);
            } else if (mainChar != selection && enemyList[0] != selection) {
                enemyList[1] = selection;
                secondEnemy(selection);
            }
        }
    });

    // Selected main character
    function selectedMainChar(m) {
        var x = 0;
        for (var i = 0; i < 4; i++) {
            if (m === character.id[i]) {
                attacker = i;
                $("#attack").css("background-color", character.clr[i]);
                $("#" + m + "Tag").css("height", "50px");
                $("#" + m + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
                $("#" + m).delay(0).animate({ left: (winWidth - 300) }, aniSpeed);
                $("#" + m + "Name").text("Attacker");
            } else {
                $("#" + character.id[i]).delay(0).animate({ width: 200, top: (winHeight + 75), left: (winWidth + x++ * 200 + 100) }, aniSpeed);
            }
        }
    };

    // Selected 1st enemy
    function firstEnemy(e1) {
        var y = 0;
        for (var i = 0; i < 4; i++) {
            if (e1 === character.id[i]) {
                defender = i;
                $("#" + e1 + "Tag").css("height", "50px");
                $("#" + e1 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
                $("#" + e1).delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
                $("#" + e1 + "Name").text("Defender");
            } else if (mainChar != character.id[i]) {
                $("#" + character.id[i]).delay(0).animate({ width: 150, top: (winHeight + y++ * 225), left: (winWidth + 550) }, aniSpeed);
            }
        }

        fighting();
    };

    // Selected 2nd enemy
    function secondEnemy(e2) {
        var e1 = enemyList[0];

        defender = $.inArray(e2, character.id);
        $("#" + e2 + "Tag").css("height", "50px");
        $("#" + e2 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
        $("#" + e2).delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
        $("#" + e2 + "Name").text("Defender");

        // Find last enemy
        for (var i = 0; i < 4; i++) {
            var e3 = character.id[i];
            if (e3 != mainChar && e3 != enemyList[0] && e3 != e2) {
                enemyList[2] = e3;
                i = 4;
            }
        }
        $("#" + e3).delay(0).animate({ width: 150, top: (winHeight), left: (winWidth + 550) }, aniSpeed);
        $("#" + e1).delay(0).animate({ width: 150, top: (winHeight + 225), left: (winWidth + 550) }, aniSpeed);

        defeated(e1); // test
        thirdEnemy(); // test
    };

    // 3rd enemy
    function thirdEnemy() {
        var e2 = enemyList[1];
        var e3 = enemyList[2];

        $("#" + e3 + "Tag").css("height", "50px");
        $("#" + e3 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
        $("#" + e3).delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
        $("#" + e3 + "Name").text("Defender");

        $("#" + e2).delay(0).animate({ width: 150, top: (winHeight), left: (winWidth + 550) }, aniSpeed);
        defeated(e2);

        fighting();
    };

    // Defeated
    function defeated(d) {
        $("#" + d + "Pic").css({
            "-webkit-filter": "grayscale(100%) brightness(40%) blur(2px)",
            filter: "grayscale(100%) brightness(40%) blur(2px)"
        });
        $("#" + d + "Tag").css({ width: 100, height: 30, top: 120, left: 30, "background-color": "rgba(150, 0, 0, 0.3)" });
        $("#" + d + "Name").text("Defeated");
    }

    // Fighting mode
    function fighting() {
        gameStatus = "fight";
        atkBtn.fadeIn(800);


    }

})