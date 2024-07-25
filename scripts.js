const Modal ={ 
    open(){
        //abrir modal
        //adicionar a class active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },

    close(){
        //fechar o modal
        //remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const Storage = { 
    get() {
    return JSON.parse(localStorage.getItem("gringotts:transactions")) || []
    },

    set(transactions) {
    localStorage.setItem("gringotts:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {

    //pegar as transações  e se for > que 0, somar a uma variavel e retornar a variavel
     // para cada transação (se > que 0), usar .forEach
     //variáveis são os nomes simbolicos
     //(var e let são variaveis locais, uma simples adição de valor sem o uso de let ou var se torna global.
     
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) { 
        Transaction.all.splice(index, 1)

       App.reload()
    },

    incomes() { 
     
     let income = 0;

     Transaction.all.forEach(transaction => {

        if( transaction.amount > 0 ) { //se for > que 0
            income += transaction.amount; //somar e retornar a variavel
        }
     })
     
     return income;
    }  ,

    expenses() {

     let expense = 0;

     Transaction.all.forEach(transaction => {

        if( transaction.amount < 0 ) { //se for < que 0
            expense += transaction.amount;
        }
     })

     return expense;
    },

 total() {
   //entradas - saídas
    
    return Transaction.incomes() + Transaction.expenses();
  }
}


 
const DOM = { 

    // substituir os dados do HTML cm os do JS

    transactionsContainer: document.querySelector('#data-table #showNewTransaction'),

    addTransaction(transaction, index) {
           const tr = document.createElement('tr')
           tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
           tr.dataset.index = index
        
           DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description"> ${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="/images/minus.svg" alt=" Remover Transação">
            </td>
        
        `
        return html
    },
   
    updateBalance() {
      document
      .getElementById('incomeDisplay')
              .innerHTML = Utils.formatCurrency(Transaction.incomes())
      document
      .getElementById('expenseDisplay')
              .innerHTML = Utils.formatCurrency(Transaction.expenses())
      document
      .getElementById('totalDisplay')
              .innerHTML = Utils.formatCurrency( Transaction.total())
     //chamar o elemento: getElement
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },

    formatDate (date) {
        const splittedDate = date.split("-")
        return`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

      formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g, "")

        value =  Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    //verificar se as informações foram preenchidas
    //formatar os dados p salvar
    //salvar
    //apagar os dados do formulário
    //feche modal
    //atualizar a aplicação
    // "trim" faz uma limpeza de espaços vazios

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

getValues() {
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
},

validateFields(){
        const { description, amount, date } = Form.getValues()

       if(
           description.trim() === "" ||
           amount.trim() === "" ||
           date.trim() === "" ) { 
               throw new Error("Por favor, preencha todos os campos.")
           }
},

formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)
    
    return {
        description,
        amount,
        date
    }
},

clearFields() { 
   Form.description.value = ""
   Form.amount.value = ""
   Form.date.value = ""
},

submit(event) {
    event.preventDefault()

    try { 
       Form.validateFields()
       const transaction = Form.formatValues()
       Transaction.add(transaction)
       Form.clearFields()
       Modal.close()
    }
    catch (error) {
        alert(error.message)
    } 
  } 
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

