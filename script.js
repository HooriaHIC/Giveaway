const $ = jQuery;
let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color =
        possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
}

function Draw() {
    const results = [];

    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -30;
            particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
}

window.addEventListener(
    "resize",
    function () {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
}

// Initialize
canvas.width = W;
canvas.height = H;
Draw();
$("#test-btn").click(function () {
    $(".success-checkmark").css("display", "block");
    document.getElementById("notice_img").style.display = "none";
    document.getElementById("notice_head").textContent = "Succeeded!";
    document.getElementById("notice_p").text = "We've done the test you can now start the giveaway";
    $(".check-icon").hide();
    setTimeout(function () {
        $(".check-icon").show();
    }, 10);
});

function changeNote() {
    document.getElementById("setup").setAttribute("class", "");
    document.getElementById("notice").style.display = "block";
    document.getElementById("form_cont").style.display = "none";
    document.getElementById("changenote").style.display = "none";
    document.getElementById("participant-area").style.display = "none";
    document.getElementById("part_cont").style.display = "block";
    document.getElementById("nav").style.display = "none";
    document.getElementById("jumbotron").style.display = "none";

}
let usernames = [];

function main() {
    document.getElementById("notice").style.display = "none";
    document.getElementById("part_cont").style.display = "block";
    document.getElementById("nav").style.display = "none";
    document.getElementById("jumbotron").style.display = "none";
    const inp = document.getElementById("main_input");
    //console.log(inp.value);
    function createNode(element) {
        return document.createElement(element);
    }

    function append(parent, el) {
        return parent.appendChild(el);
    }
    document.getElementById("form_cont").style.display = "none";
    const ul = document.getElementById('authors');
    const url = '' + inp.value + '?__a=1';
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            let authors = data.graphql.shortcode_media.edge_media_to_parent_comment.edges;
            return authors.map(function (author) {
                let li = createNode('li'),
                    img = createNode('img'),
                    span = createNode('span'),
                    p = createNode("p");
                li.setAttribute("id", "participate");
                li.setAttribute("class", "participate");
                p.innerHTML = `<span>${author.node.owner.username}</span> <ps>${author.node.text}</ps>`;
                img.src = author.node.owner.profile_pic_url;
                append(li, img);

                append(li, span);
                append(li, p);
                append(ul, li);
                usernames.push(author.node.owner);
                //randomElements = $("li#participate").get().sort(function(){ 
                //return Math.round(Math.random() * 24)
                //}).slice(0,5)
                //$(randomElements).css("display", "block")

                var cards = $(".participate");
                for (var i = 0; i < cards.length; i++) {
                    var target = Math.floor(Math.random() * cards.length - 1) + 1;
                    var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
                    cards.eq(target).before(cards.eq(target2));
                }
                var count = data.graphql.shortcode_media.edge_media_to_parent_comment.count;
                document.getElementById("total_part").innerHTML = "Total: " + "<span class='comment_count'>" + count + "</span>";

                console.log(usernames)
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    document.getElementById("setup").setAttribute("class", "");
    document.getElementById("participant-area").style.display = "none";
    document.getElementById("changenote").style.display = "none";
    document.getElementById("timer-area").style.display = "block";
    var randomNum = Math.floor(Math.random() * (usernames.length));
    var randomTimerNum = Math.floor(Math.random() * 30) + 1;

    var fiveMinutes = 1 * randomTimerNum,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
    document.getElementById("form").setAttribute("class", "hidden");
}

function startTimer(duration, display) {
    var timer = duration,
        minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer == 0) {
            timer = 0;
            document.getElementById("timer-area").style.display = "none";
            document.getElementById("participant-area").style.display = "block";
            document.getElementById("changenote").style.display = "block";
        }

    }, 500);
}

function shuffle() {
    document.getElementById("notice").style.display = "none";
    document.getElementById("participant-area").style.display = "none";
    document.getElementById("changenote").style.display = "none";

    function countdown(parent, callback) {
        function count() {

            if (paragraph) {
                paragraph.remove();
            }

            if (texts.length === 0) {
                clearInterval(interval);
                callback();
                return;
            }
            var text = texts.shift();
            paragraph = document.createElement("p");
            paragraph.textContent = text;
            paragraph.className = text + " nums";

            parent.appendChild(paragraph);

        }
        var texts = ['5', '4', '3', '2', '1'];
        var paragraph = null;
        var interval = setInterval(count, 1000);
    }

    countdown(document.getElementById("readyGo"), function () {

        document.getElementById("readyGo").innerHTML = '<p class="nums" style="display: none;"> </p>';
        if (document.getElementById("readyGo").innerHTML = '<p class="nums" style="display: none;"> </p>') {
            document.getElementById("winner").style.display = "flex";
            document.getElementById("canvas").style.display = "block";
            document.getElementById("winner_h1").style.display = "block";
            document.getElementById("winners_p").style.display = "block";
            document.getElementById("changenoter").style.display = "block";
        }

    });

    var randomNum = Math.floor(Math.random() * (usernames.length));
    document.getElementById("shuffle-btn").style.display = "none";
    document.getElementById("winner_name").innerHTML = usernames[randomNum].username;
    document.getElementById("winner_avatar").setAttribute("src", usernames[randomNum].profile_pic_url)
    console.log(usernames[randomNum])

}
