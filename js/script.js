let price = 1.87;
let cid = [['PENNY', 1.01], ['NICKEL', 2.05], ['DIME', 3.1], ['QUARTER', 4.25], ['ONE', 90], ['FIVE', 55], ['TEN', 20], ['TWENTY', 60], ['ONE HUNDRED', 100]];

const priceSpan = document.getElementById("price");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const totalMoney = document.querySelector(".total span");
const cidUl = document.querySelector("ul.cid");

// make the price dynamically written in the page
priceSpan.textContent = ` $${price}`;

// generate the money in drawer
function cidGenerator(cid) {
    cidUl.innerHTML = ""
    for (let i = 0; i < cid.length; i++) {
        cidUl.innerHTML += `<li>${cid[i][0]}: ${cid[i][1]}</li>`
    }
    const total = cid.reduce((acc , ele) => acc + ele[1], 0);
    const totalMoney1 = parseFloat(total)
    totalMoney.textContent = `$${totalMoney1.toFixed(2)}`;
    return totalMoney1.toFixed(2)
}
cidGenerator(cid)

// main function 
purchaseBtn.addEventListener("click", () => {
    const value = parseFloat(cash.value);
    const valueEntered = parseFloat(value.toFixed(2));
    cash.value = "";
    if (valueEntered === "" || valueEntered < price) {
        alert("Customer does not have enough money to purchase the item");
        return
    };

    if (valueEntered === price) {
        changeDue.textContent = "No change due - customer paid with exact cash";
        return
    }
    
    if (valueEntered > price) {
        let remainderMoney = valueEntered - price;
        const totalMoneyInDrawer = cidGenerator(cid)
        if (remainderMoney > totalMoneyInDrawer ) {
            changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
            return
        }
        function calculateAmountOfMoneyRequiredFromDrawer(cid, target) {
            // define value of each denomination in cents (cents not decimal to prevent the problem in calculating dicimals in js)
            const denominationValues = {
                "PENNY": 1,
                "NICKEL": 5,
                "DIME": 10,
                "QUARTER": 25,
                "ONE": 100,
                "FIVE": 500,
                "TEN": 1000,
                "TWENTY": 2000,
                "ONE HUNDRED": 10000
            };
            cid.sort((a, b) => denominationValues[b[0]] - denominationValues[a[0]]);
            const result = [];
            // Convert target to cents
            let restMoney = Math.round(target * 100);
            for (const [denomination, total] of cid) {
                const value = denominationValues[denomination];
                let amountToUse = 0;
                let totalCents = Math.round(total * 100); // Convert total to cents
                while (restMoney >= value && totalCents - amountToUse >= value) {
                    amountToUse += value;
                    restMoney -= value;
                }
                if (amountToUse > 0) {
                    result.push([denomination, (amountToUse / 100).toFixed(2)]);
                }
            }
        
            if (restMoney > 0) {
                changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
                return;
            }

            if (restMoney=== 0) {
                updateCid(result,cid);
                const total = parseFloat(cidGenerator(cid));
                if (total === 0) {
                    changeDue.innerHTML = `Status: CLOSED`;
                }
                if (total > 0) {
                    changeDue.innerHTML = `Status: OPEN`
                }
                for (const [denomination, amount] of result) {
                    changeDue.innerHTML += ` ${denomination}: $${amount}`
                }
            }
        }
        calculateAmountOfMoneyRequiredFromDrawer(cid, remainderMoney)
    }
})
function updateCid(result, cid) {
    for (const [denomination, amount] of result) {
        for (let i = 0; i < cid.length; i++) {
            if (cid[i][0] === denomination) {
                const finalAmount = cid[i][1] - parseFloat(amount);
                // toFixed() return string so we should parse it after rounding to avoid errors in calculations
                const final = finalAmount.toFixed(2);
                cid[i][1] = parseFloat(final);
            }
        }
    }
    cidGenerator(cid)
}
