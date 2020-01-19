
// EVENT LISTENERS
document.querySelector('.login').addEventListener('click',
    function() {
        document.querySelector('#modal-login').style.display = 'flex';
    }
);
document.querySelector('.signup').addEventListener('click',
    function() {
        document.querySelector('#modal-signup').style.display = 'flex';
    }
);
document.querySelector('.closePopupLogin').addEventListener('click',
    function() {
        document.querySelector('#modal-login').style.display = 'none';
    }
);
document.querySelector('.closePopupSignup').addEventListener('click',
    function() {
        document.querySelector('#modal-signup').style.display = 'none';
    }
);