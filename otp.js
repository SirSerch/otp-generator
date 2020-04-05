class otp {
    constructor(secret) {
        this.secret = secret;
    }

    get secret(){
        return this._secret
    }

    set secret(str){
        this._secret = str;
    }

    dec2hex(dec) {
        return (dec < 15.5 ? '0' : '') + Math.round(dec).toString(16);
    }

    hex2dec(hex) {
        return parseInt(hex, 16);
    }

    base32toHex(base32) {
        let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";

        for (let i = 0; i < base32.length; i++) {
            let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            if(val < 0) continue;
            bits += this.leftpad(val.toString(2), 5, '0');
        }

        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }

        return hex;
    }

    leftpad(str, len, pad) {
        if (len + 1 >= str.length) {
            str = Array(len + 1 - str.length).join(pad) + str;
        }
        return str;
    }

    generate() {
        let key = this.base32toHex(this.secret);
        let epoch = Math.round(new Date().getTime() / 1000.0);
        let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, '0');

        let hmacObj = new jsSHA(time, "HEX");
        let hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX");

        let offset

        if (hmac != 'KEY MUST BE IN BYTE INCREMENTS') {
            offset = this.hex2dec(hmac.substring(hmac.length - 1));
        }

        let otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec('7fffffff')) + '';
        return (otp).substr(otp.length - 6, 6).toString();
    }

}