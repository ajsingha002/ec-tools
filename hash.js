let data = "argha1@gmail.com";
let sha256Hash = CryptoJS.SHA256(data);
let base64 = CryptoJS.enc.Base64.stringify(sha256Hash);
let utf8 = "loren";

let websafe = (buffer) => {
    return buffer.toString('base64')
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, ''); // Remove ending '='
}

function delay(fn, ms) {
    let timer = 0
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

let validateEmail = (email) => {
    console.log(email);
    let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
    return pattern.test(email);
}

let validatePhone = (phone) => {
    let pattern = /[+][\d][\d]\d{7,11}$/g;
    let validPhone = pattern.test(phone)
    return validPhone;
}

let setValid = (id) => {
    $(id).removeClass('is-invalid');
    $(id).addClass('is-valid');
}

let setInvalid = (id) => {
    $(id).removeClass('is-valid');
    $(id).addClass('is-invalid');
}

let clearValidation = (id) => {
    $(id).removeClass('is-valid');
    $(id).removeClass('is-invalid');
}

let clearHashEmailFields = () => {
    $('#emEmailWeb64').val('');
    clearValidation('#emEmailWeb64');

    $('#emEmailSHA256').val('');
}

let clearHashPhoneFields = () => {
    $('#emPhoneWeb64').val('');
    clearValidation('#emEmailWeb64');

    $('#emPhoneSHA256').val('');
}

$('#email').on('keyup', delay(() => {
    if($('#email').val()===''||$('#email').val()===undefined) {
        clearValidation('#email');
        clearHashEmailFields();
    } else {
        if(validateEmail($('#email').val())) {
            setValid('#email');
            let sha256Hash = CryptoJS.SHA256($('#email').val());
            let base64 = CryptoJS.enc.Base64.stringify(sha256Hash);
            let websalfeBase64 = websafe(base64);
            $('#emEmailSHA256').val(sha256Hash);
            $('#emEmailWeb64').val(websalfeBase64);
            validateEmValue();
        } else {
            setInvalid('#email');
            clearHashEmailFields();
        }
    }     
},500));

$('#phone').on('keyup', delay(() => {
    let validPhone = validatePhone($('#phone').val());
    if($('#phone').val()===''||$('#phone').val()===undefined) {
        clearValidation('#phone');
        clearHashPhoneFields();
    } else {
        if(validPhone) {
            console.log('Valid Phone');
            setValid('#phone');
            let sha256Hash = CryptoJS.SHA256($('#phone').val());
            let base64 = CryptoJS.enc.Base64.stringify(sha256Hash);
            let websalfeBase64 = websafe(base64);
            $('#emPhoneSHA256').val(sha256Hash);
            $('#emPhoneWeb64').val(websalfeBase64);
            validateEmValue();
        } else {
            setInvalid('#phone');
            clearHashPhoneFields();
        }
    }
},500));

let validateEmValue = () => {
    let emVar = $('#em').val().trim();
    let isEmailAvailable = emVar.indexOf('em.')!==-1;
    let isPhoneAvailable = emVar.indexOf('pn.')!==-1;
    let emPhoneWeb64 = $('#emPhoneWeb64').val().trim();
    let emEmailWeb64 = $('#emEmailWeb64').val().trim();
    if(emVar===''||emVar===undefined) {
        clearValidation('#emPhoneWeb64');
        clearValidation('#emEmailWeb64');
    } else {
        if(isEmailAvailable & isPhoneAvailable) {
            console.log('Part1');
            let email64fromEm = emVar.substring(emVar.indexOf('em.')+3 , emVar.indexOf('~pn.')).trim();
            let phone64fromEm = emVar.substring(emVar.indexOf('~pn.')+4).trim();
            if(emPhoneWeb64===phone64fromEm) {
                console.log('Part1/1');
                setValid('#emPhoneWeb64');
            } else {
                console.log('Part1/2');
                console.log(emPhoneWeb64);
                console.log(phone64fromEm)
                setInvalid('#emPhoneWeb64');
            }
            if(emEmailWeb64===email64fromEm) {
                console.log('Part1/3');
                setValid('#emEmailWeb64');
            } else {
                console.log('Part1/4');
                setInvalid('#emEmailWeb64');
            }
        } else if(isEmailAvailable & !isPhoneAvailable) {
            console.log('Part2');
            let email64fromEm = emVar.substring(emVar.indexOf('em.')+3).trim();
            if(emEmailWeb64===email64fromEm) {
                console.log('Part2/1');
                setValid('#emEmailWeb64');
            } else {
                console.log('Part2/2');
                setInvalid('#emEmailWeb64');
            }
            clearValidation('#emPhoneWeb64');
        } else if(!isEmailAvailable & isPhoneAvailable) {
            console.log('Part3');
            let phone64fromEm = emVar.substring(emVar.indexOf('~pn.')+4).trim();
            if(emPhoneWeb64===phone64fromEm) {
                console.log('Part3/1');
                setValid('#emPhoneWeb64');
            } else {
                console.log('Part3/2');
                setInvalid('#emPhoneWeb64');
            }
            clearValidation('#emEmailWeb64');
        } else {
            console.log('Part4');
            clearValidation('#emPhoneWeb64');
            clearValidation('#emEmailWeb64');
        }
    }
}

$('#em').on('keyup', delay(validateEmValue,500));
