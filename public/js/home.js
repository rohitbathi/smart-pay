var maxAmount = parseInt(document.querySelector('#maxamount').innerText);
var sendMoney = document.querySelector('#sendmoney');
var error = document.querySelector('#error');
var userName = document.querySelector('#userId')
var username = document.querySelector('#curUser')


sendMoney.addEventListener('keyup',(e)=>{
    var amount = parseInt(document.querySelector('#amount').value);
    console.log(amount, maxAmount);
    if(amount>maxAmount){
        error.innerHTML = '<p>You dont have that much money</p>';
    }else if(userName.value == username.value){
        error.innerHTML = '<p>You cant enter your name</p>'
    }else if(amount<0){
        error.innerHTML = '<p>Enter correct amount</p>'
    }else{
        error.innerHTML = '';
    }
});

sendMoney.addEventListener('submit',(e)=>{
    var amount = parseInt(document.querySelector('#amount').value);
    if(amount>maxAmount && amount > 0){
        e.preventDefault()
        error.innerHTML = '<p>You dont have that much money</p>';
    }else if(userName.value == username.value){
        e.preventDefault()
        error.innerHTML = '<p>You cant enter your name</p>'
    }else if(amount<0){
        e.preventDefault()
        error.innerHTML = '<p>Enter correct amount</p>'
    }else{
        error.innerHTML = '';
    }
});
