const your_name = document.querySelector("#yourName");
const your_email = document.querySelector("#yourEmail");
const your_password = document.querySelector("#yourPassword");
const remember_me = document.querySelector("#yourname");
const btn_create_account = document.querySelector("#btnCreateAccount");
const btn_showpassword = document.querySelector("#showPassword");
const modal = document.querySelector("#myModal");


// LIST OF EVENTSLISTENDER
btn_create_account.addEventListener('click', (e) => {
    formCreateAccount(your_name.value,your_email.value,your_password.value);
}); 
your_name.addEventListener('change', (name_evt) => {
    inputCheckValueOnChage(name_evt.target.value, name_evt);
})
your_email.addEventListener('change', (name_evt) => {
    inputCheckValueOnChage(your_email.value, name_evt);
})
your_password.addEventListener('change', (name_evt) => {
    inputCheckValueOnChage(your_password.value, name_evt);
})
btn_showpassword.addEventListener('click', () => {
    toggleClass()
})




// FORM INPUT VALIDATION
const inputCheckValueOnChage =  (inputValue, inputName) => {
       
    switch (inputName.target.id) {
        case 'yourName': 
            if (inputValue.length < 6) {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".name-error-feedback").innerHTML = "should more than 6 character" // Add label error notification
            } else {
                inputName.target.closest('div.form-input').removeAttribute('error-notif','');
                inputName.target.closest('div.form-input').setAttribute('success-notif','');
            }
            break;
        case 'yourEmail': 
            var validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (inputValue.match(validRegex)) {
                inputName.target.closest('div.form-input').removeAttribute('error-notif','');
                inputName.target.closest('div.form-input').setAttribute('success-notif','');
            } else {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".email-error-feedback").innerHTML = "incorrect email format" // Add label error notification
            }
            break;
        case 'yourPassword': 
            var passwordLower = /[a-z]+/;
            var passwordCapital = /[A-Z]+/;
            var passwordNumber = /[0-9]+/;
            var passwordSpecial = /[$@#&!]+/;
            if (inputValue.length < 10) {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".pw-error-feedback").innerHTML = "should more than 10 character" // Add label error notification
            } else if (!inputValue.match(passwordLower)) {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".pw-error-feedback").innerHTML = "password should have small letter" // Add label error notification
            } else if (!inputValue.match(passwordCapital)) {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".pw-error-feedback").innerHTML = "password should have Capital letter" // Add label error notification
            } else if (!inputValue.match(passwordNumber)) {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".pw-error-feedback").innerHTML = "password should have Number" // Add label error notification
            } else if (!inputValue.match(passwordSpecial)) {
                inputName.target.closest('div.form-input').removeAttribute('success-notif','');
                inputName.target.closest('div.form-input').setAttribute('error-notif','');
                document.querySelector(".pw-error-feedback").innerHTML = "password should have Special character" // Add label error notification
            } else {
                inputName.target.closest('div.form-input').removeAttribute('error-notif','');
                inputName.target.closest('div.form-input').setAttribute('success-notif','');
            }
            break;
    }
}

// FORM CREATE ACCOUNT FUNCTION
const formCreateAccount = (name, email, password) => {
    let array = [your_name, your_email, your_password]
    array.forEach(elem => {
        var parentDiv = elem.closest('.form-input');
    
        if (parentDiv.hasAttribute('error-notif')) {
            switch (elem.id) {
                case 'yourName':
                    document.querySelector(".name-error-feedback").innerHTML = "please follow correct format"
                    break;
                case 'yourEmail':
                    document.querySelector(".email-error-feedback").innerHTML = "please follow email format"
                    break;
                case 'yourPassword':
                    document.querySelector(".pw-error-feedback").innerHTML = "Input strong password"
                    break;
            }
        } else if (elem.value == "") {
            switch (elem.id) {
                case 'yourName':
                    parentDiv.setAttribute('error-notif','');
                    document.querySelector(".name-error-feedback").innerHTML = "your name is required"
                    break;
                case 'yourEmail':
                    parentDiv.setAttribute('error-notif','')
                    document.querySelector(".email-error-feedback").innerHTML = "your email is required"
                    break;
                case 'yourPassword':
                    parentDiv.setAttribute('error-notif','')
                    document.querySelector(".pw-error-feedback").innerHTML = "password is required"
                    break;
            }
        } else if (!(your_name.closest('.form-input').hasAttribute('error-notif')) && !(your_email.closest('.form-input').hasAttribute('error-notif')) && !(your_password.closest('.form-input').hasAttribute('error-notif')) && array[array.length -1] === elem) {
                    var myModal = new bootstrap.Modal(document.getElementById('myModal'))
                    myModal.show()
                    document.querySelector('#accountName').innerHTML = `${name}`
        }
    });
}

// Toggle Class
 const toggleClass = () => {
    let divElement = document.getElementById('showPassword');
    divElement.classList.toggle("show");

    if (divElement.classList.contains('show')) {
        your_password.removeAttribute('type', 'password');
        your_password.setAttribute('type', 'text');
    } else {
        your_password.removeAttribute('type', 'text');
        your_password.setAttribute('type', 'password');
    }

 }