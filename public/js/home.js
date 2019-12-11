const menuTemplate = document.querySelector("#menu-template").innerHTML;
const summaryTemplate = document.querySelector("#summary-template").innerHTML;

let items;
let transactions;

let transactionSummary;
let itemOption;

$(document).ready(async () => {
   items = await getItems();
   transactions = items.map((item) => {
      return {
         idItem: item._id,
         itemName: item.itemName,
         quantity: 0,
         date: Date.now()
      }
   });

   transactionSummary = new TransactionSummary("item-summary", transactions, summaryTemplate);
   itemOption = new ItemOption("item-options", items, menuTemplate, transactionSummary);

   transactionSummary.render();
   itemOption.render();

   transactionSummary.loadEventHandler();
   itemOption.loadEventHandler();
});

//UTILITY
async function getItems () {
   let items = [];
   try {
      let response = await fetch('/API/item');
      items = await response.json();
   } catch (e) {
      console.error(e);
   }
   return items;
}

//COMPONENT
class TransactionSummary {
   constructor(id, transactions, template) {
      this.transactions = transactions;
      this.elem = document.querySelector(`#${id}`);
      this.template = template;
   }

   render() {
      const html = Mustache.render(this.template,{transactions: this.transactions});
      this.elem.insertAdjacentHTML("beforeend", html);
      this.elem.querySelector("#datePicker").value = new Date().toDateInputValue();
   }

   loadEventHandler() {
      this.elem.querySelector("form").addEventListener("submit", async (event) => {
         event.preventDefault();
         let tempString = this.elem.querySelector("#datePicker").value;
         let epochTime = new Date(tempString).getTime();

         let payload = transactions.map((transaction) => {
            transaction.date = epochTime;
            return transaction;
         });


         let json;
         try {
            const response = await fetch('/API/transaction-batch/session', {
               method: 'POST',
               mode: 'cors',
               credentials: 'same-origin',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload)
            });
            json = await response.json();
         } catch (e) {
            console.error(e);
            alert("Data gagal ditambahkan");
            return;
         }

         alert("Data berhasil ditambahkan");
         this.resetForm();
      });
   }

   resetForm() {
      for (let i = 0; i < this.transactions.length; i++) {
         this.transactions[i].quantity = 0;
         let tempQuantity = this.elem.querySelector(`#summary-${this.transactions[i].idItem}-quantity`);
         tempQuantity.textContent = this.transactions[i].quantity;
      }
   }

   addTransaction(id) {
      let tempIdx = this.transactions.findIndex(x => x.idItem == id);
      this.transactions[tempIdx].quantity++;
      let tempQuantity = this.elem.querySelector(`#summary-${id}-quantity`);
      tempQuantity.textContent = this.transactions[tempIdx].quantity;
   }
}

class ItemOption {
   constructor(id, items, template, summary) {
      this.items = items;
      this.elem = document.querySelector(`#${id}`);
      this.template = template;
      this.itemButtons = [];
      this.summary = summary;
   }

   render() {
      const html = Mustache.render(this.template,{items: this.items});
      this.elem.insertAdjacentHTML("beforeend", html);
   }

   loadEventHandler() {
      this.items.forEach((item) => {
         const $a = this.elem.querySelector(`#item-${item._id}`);

         $a.addEventListener('click', (event) => {
            event.preventDefault();
            this.summary.addTransaction(item._id);
         });

         this.itemButtons.push($a);
      });
   }
}

Date.prototype.toDateInputValue = (function() {
   var local = new Date(this);
   local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
   return local.toJSON().slice(0,10);
});