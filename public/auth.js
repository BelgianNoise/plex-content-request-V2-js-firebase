var loginoutbtn = document.querySelector('.login');
var loginForm = document.querySelector('#login-form');
var loginModal = document.querySelector('#modal-login');

// automatisch melding tonen bij logout of login
let h = 0;
firebase.auth().onAuthStateChanged(function (user) {
    ++h; 
    if (user) {
        loginoutbtn.textContent = 'Afmelden';
    } else {
        loginoutbtn.textContent = 'Aanmelden';
    }
    if(h < 2) return;
    var messField = document.querySelector('.mess-field');
    var messList = document.querySelector('.messages');
    messList.innerHTML = "";
    var p = document.createElement('p');

    if (user) {
        p.textContent = "Welkom terug " + user.displayName + "!";
    } else {
        p.textContent = "Je bent succesvol afgemeld!";
    }
    db.collection('requests').orderBy('date').get().then(function (querySnapshot) {
        document.querySelector('#request-list').innerHTML = '';
        querySnapshot.forEach(function (doc) {
            renderRequest(doc);
        });
        }).catch(function (error) {
            console.log(error);
        });
    messList.appendChild(p);
    messField.style.display = 'grid';
    setTimeout(()=>messField.style.display = 'none',5000);
});

// LOGIN ENZO

loginoutbtn.addEventListener('click', (e) => {
    if(!firebase.auth().currentUser){
        e.preventDefault();
        loginModal.style.display = 'flex';
    }else{
        e.preventDefault();
        auth.signOut();
    }
});

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    var email = loginForm['login-email'].value;
    var password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password)
        .then(function (response) { 
            loginModal.style.display = 'none';
        })
        .catch(function (error) {
            console.log(error);
            // error laten zien of toch niet haha alleen voor mij hihihihihiihih
        });
});

document.querySelector('.closePopupLogin').addEventListener('click', e => {
        e.preventDefault();
        loginModal.style.display = 'none';
    }
);
/*
// =================================================================
// ALLES MET REGISTER DUS VOOR WEG TE GOOIEN OFZO LATER KENDEM =====
// =================================================================
document.querySelector('.signup').addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('#modal-signup').style.display = 'flex';
    }
);
document.querySelector('.closePopupSignup').addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('#modal-signup').style.display = 'none';
    }
);

var signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var username = signupForm['signup-username'].value;
    var email = signupForm['signup-email'].value;
    var password = signupForm['signup-password'].value;

    auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        result.user.updateProfile({displayName: username});
        signupForm.reset();
        document.querySelector('#modal-signup').style.display = 'none';
        var messField = document.querySelector('.mess-field');
        var messList = document.querySelector('.messages');
        messList.innerHTML = "";
        var p = document.createElement('p');
        p.textContent = "Hallo " + username + ", je bent succesvol geregistreerd!";
        messList.appendChild(p);
        messField.style.display = 'grid';
        setTimeout(()=>messField.style.display = 'none',5000);
    }).catch(function(error) {
        console.log(error);
        // error laten zien of toch niet haha alleen voor mij hihihihihiihih
    });
});
*/