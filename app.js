const supportedCards= {
    visa: "visa", mastercard: "mastercard"
}

;

const countries=[ {
    code: "US",
        currency: "USD",
        country: 'United States'
}

,
    {
    code: "NG",
        currency: "NGN",
        country: 'Nigeria'
}

,
    {
    code: 'KE',
        currency: 'KES',
        country: 'Kenya'
}

,
    {
    code: 'UG',
        currency: 'UGX',
        country: 'Uganda'
}

,
    {
    code: 'RW',
        currency: 'RWF',
        country: 'Rwanda'
}

,
    {
    code: 'TZ',
        currency: 'TZS',
        country: 'Tanzania'
}

,
    {
    code: 'ZA',
        currency: 'ZAR',
        country: 'South Africa'
}

,
    {
    code: 'CM',
        currency: 'XAF',
        country: 'Cameroon'
}

,
    {
    code: 'GH',
        currency: 'GHS',
        country: 'Ghana'
}

];

const startApp=()=> {
    fetchBill();
}

;

//Holds app data
const appState= {}

;

//formats Users bill as currency
const formatAsMoney=(amount, buyerCountry)=> {
    const country=countries.find((el)=> el.country===buyerCountry);

    if (country) {
        return amount.toLocaleString(`en-$ {
                country.code
            }

            `,
                {
                style: 'currency', currency: country.currency
            }

        );
    }

    else {
        return amount.toLocaleString('en-US', {
                style: 'currency', currency: 'USD'
            }

        );
    }
}

//Used to mark an input entry as invalid or not
const flagIfInvalid=(field, isValid)=> {
    if (isValid) {
        field.classList.remove("is-invalid")
    }

    else {
        field.classList.add("is-invalid")
    }
}

//Used to check if card expiry date complies with MM/YY format
const expiryDateFormatIsValid=(target)=> {
    const fieldMatches=target.value.match(/[\d] {
            2
        }

        \/[\d] {
            2
        }

        /);
    const cardExpDate=target.value.split("/");
    const cardExpMonth=cardExpDate[0];
    const cardExpYear=cardExpDate[1];
    const today=new Date();
    const currentMonth=today.getMonth()+1;
    const currentYear=today.getFullYear().toString().slice(-2);

    let isValid=false;

    if (fieldMatches) {
        if (+(currentYear==cardExpYear)) {
            if (+(cardExpMonth >=currentMonth)) {
                isValid=true
            }
        }

        else if (+(currentYear < cardExpYear)) {
            isValid=true
        }
    }

    return isValid;
}

//Detects if card is Visa, Master Card or others
const detectCardType=( {
        target
    }

)=> {
    const creditCardType=document.querySelector('[data-credit-card]');
    const cardImage=document.querySelector('[data-card-type]');

    if (Number(String(target.value.charAt(0)))===4) {
        creditCardType.classList.add('is-visa');
        creditCardType.classList.remove('is-mastercard');
        cardImage.src=supportedCards.visa;
        return "is-visa";
    }

    else if (Number(String(target.value.charAt(0)))===5) {
        creditCardType.classList.add('is-mastercard');
        creditCardType.classList.remove('is-visa');
        cardImage.src=supportedCards.mastercard;
        return "is-mastercard";
    }

    else {
        creditCardType.classList.remove('is-mastercard');
        creditCardType.classList.remove('is-visa');
        cardImage.src='http://placehold.it/120x60.png?text=Card';
    }

}

//Delegates to expiryDateFormatIsValid to check if card date is valid, then use flagIfInvalid to indicate that card date is valid or not
const validateCardExpiryDate=( {
        target
    }

)=> {
    const isValidDate=expiryDateFormatIsValid(target) if (isValidDate) {
        flagIfInvalid(target, true);
        return true;
    }

    else {
        flagIfInvalid(target, false);
        return false;
    }
}

//Used to check if card holder name is in the appropriate format
const validateCardHolderName=( {
        target
    }

)=> {
    const cardHolder=target.value.split(" ");
    const [name,
    surname,
    ...others]=cardHolder let isValid=false;

    if (others.length) {
        isValid=false;
    }

    else if (name && name.length >=3 && surname && surname.length >=3) {
        isValid=true;
    }

    flagIfInvalid(target, isValid);
    return isValid;


}

//Use to validate credit card number
const validateWithLuhn=(digits)=> {

    //Loop through digits array starting from the second to last item and double each item, if doubled value is greater than 9, then subtract 9 from it
    for (let i=digits.length - 2; i >=0; i -=2) {
        let num=Number(digits[i])+Number(digits[i]);

        if (num > 9) {
            digits[i]=num - 9;
        }

        else {
            digits[i]=num;
        }
    }

    //Sum the doubled values
    const luhnSum=digits.reduce((a, b)=> Number(a) + Number(b), 0);

    //If sum is has remainder after dividing 10, then the credit card is valid else it's invalid
    if ((luhnSum % 10)==0) {
        return true
    }

    else {
        return false
    }

}

//Indicates that a card is valid or not
const validateCardNumber=()=> {
    const cardNumberInputs=[...document.querySelectorAll("[data-cc-digits] input")];
    const validityDiv=document.querySelector("[data-cc-digits]") let cardNumber="";
    const cardNumberArray=[];

    //Collect all values from all card inputs as a String
    cardNumberInputs.map((cardNumberInput)=> {
            cardNumber +=cardNumberInput.value.substring(0, 4);
        }

    ) //Push each of the String characters to items in array

    for (let i=0; i < cardNumber.length; i++) {
        cardNumberArray.push(cardNumber[i]);
    }

    const validate=validateWithLuhn(cardNumberArray) if (validate) {
        validityDiv.classList.remove("is-invalid");
        return true;
    }

    else {
        validityDiv.classList.add("is-invalid");
        return false;
    }
}

//Sets up the UI
const uiCanInteract=()=> {
    document.querySelector("[data-cc-digits] input:nth-child(1)") .addEventListener("blur", (e)=> {
            detectCardType(e);
        }

    );

    document.querySelector("[data-cc-info] input:nth-child(1)") .addEventListener("blur", (e)=> {
            validateCardHolderName(e);
        }

    );

    document.querySelector("[data-cc-info] input:nth-child(2)") .addEventListener("blur", (e)=> {
            validateCardExpiryDate(e);
        }

    );

    document.querySelector("[data-pay-btn]").addEventListener("click", validateCardNumber);

    document.querySelector("[data-cc-digits] input:nth-child(1)").focus();
}

//Displays the total payment bill
const displayCartTotal=( {
        results
    }

)=> {
    const [data]=results;

    const {
        itemsInCart,
        buyerCountry
    }

    =data;
    appState.items=itemsInCart;
    appState.country=buyerCountry;
    appState.bill=itemsInCart.reduce((a, b)=> (a.price * a.qty) + (b.price * b.qty));
    appState.billFormatted=formatAsMoney(appState.bill, appState.country);
    document.querySelector("[data-bill]").textContent=appState.billFormatted;
    uiCanInteract();
}

//Fetch bill from api
const fetchBill=()=> {
    const api="https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
    fetch(api) .then(response=> response.json()) .then(data=> displayCartTotal(data)) .catch(error=> console.log('Warning:', error));
}

//Starts the app
startApp();