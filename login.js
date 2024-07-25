
const Form = {
    email: document.querySelector('input#email'),
    password: document.querySelector('input#password'),

    getValues() {
        return{
            email: Form.email.value,
            password: Form.password.value,
        }
    },

    validateFields() {
        const { email, password } = Form.getValues()

    if( email.trim() === "" ||  password.trim() === "" ) 
    { 
            throw new Error("E-mail ou senha não preenchidos")
        }
    },

    clearFields() { 
        Form.email.value = ""
        Form.password.value = ""
     },

    submit(event) {
        event.preventDefault()
    
        try { 
           Form.validateFields()
           Form.clearFields()
           /*redirecionar a pagina para a index html*/
           window.location.href = "https://gringotts.vercel.app/home.html";

        }
        catch (error) {
            alert(error.message)
        } 
      } 
}

 
