let url = new URL(window.location.href);
let param = url.searchParams.get("key");
let secretCode = document.getElementById("secretCode");
let share = document.getElementById("link");
share.value = window.location.href

if (param != null && param.length > 0) secretCode.value = param;

let code = new otp(secretCode.value);

function copy(element) {
    element.select();
    document.execCommand('copy');
    console.log("Copied");
}

function setSecret() {
    if (secretCode.value != "") {
        code.secret = secretCode.value;
        setCode(code.generate());
        share.value = location.protocol + '//' + location.host + location.pathname + '?key=' + secretCode.value
        setQR(code.secret);
    }

}

function setQR(secret) {
    let img = document.getElementById("QRCode");
    img.src = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/OTPGenerator?secret=" + secret;
}

function setCode(code) {
    document.getElementById("otp").innerHTML = code;
}

function timer() {
    let time = Math.round(new Date().getTime() / 1000.0);
    let countDown = 30 - (time % 30);
    if (time % 30 == 0) setCode(code.generate());
    return countDown;
}

(function () {
    setCode(code.generate());
    setInterval(function () {
        document.getElementById("progress").style.width = (timer() * 100) / 30 + '%';
    }, 1000);
})();
