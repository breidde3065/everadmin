document.addEventListener("DOMContentLoaded",function(){
    const loginform=document.getElementById("loginform");
    
    if(!loginform){
        console.error("Login form not found!");
        return;
    }
    
    loginform.addEventListener("submit",async function(e){
        e.preventDefault();
        const username=document.getElementById("username").value.trim();
        const password=document.getElementById("password").value.trim();
const errorMessage=document.getElementById("error-message");
try{
    const response=await fetch("http://localhost:5000/login",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password}),

    });
    const data=await response.json();
    if (response.ok){
        localStorage.setItem("authToken",data.token);
        window.location.href="/admin.html";

    }else{
        errorMessage.textContent=data.message||"invalid credentials!";
    }

}catch(error){
    console.error("Login error:",error);
    errorMessage.textContent="Server error.Please try again later.";
}

    });
});