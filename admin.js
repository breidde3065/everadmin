//const { response } = require("express");

document.addEventListener("DOMContentLoaded",function(){
    
const imageUpload=document.getElementById('imageUpload');
const imagePreview=document.getElementById('imagePreview');
const title=document.getElementById("Title");
const description=document.getElementById("description");
const uploadbtn=document.getElementById("uploadbtn");
const price=document.getElementById("price");
const productlist=document.createElement("ul");
productlist.id="productlist";
document.body.appendChild(productlist);


imageUpload.addEventListener("change",function(event){
    const file=event.target.files[0];

    if(file){
        const reader=new FileReader();
        reader.onload=function(e){
            imagePreview.innerHTML=`<img src="${e.target.result}" alt="Image Preview">`;
        };
        reader.readAsDataURL(file);

    }else{
        imagePreview.innerHTML="Preview";
    }
});
function uploadImage(){
    const file=imageUpload.files[0];
    const TitleText=title.value.trim();
    const descText=description.value.trim();
    const priceText=price.value.trim();
    
    if(!file){
        alert("Please enter a file.");
        return;
    }
    if(!TitleText){
        alert("Please enter a title");
        return;
    }
    if(!descText){
        alert("Please enter a description");
        return;
    }
    if(!priceText || isNaN(priceText)){
        alert("Please enter a valid price");
        return;
    }
  //  alert("Product details uploaded!");
const imageData= new FormData();
imageData.append("image",file);
console.log([...imageData.entries()]);
//sending a POST request to the backend API to upload product details
fetch("https://breidde3065.github.io/myEvergreen/uploads",{
    method:"POST",//using POST method to send data to the backend
    body:imageData, //sends imagedata object which contains image
})
.then(response => response.json())//returns response in json format
.then(data =>{
   
const imageUrl=data.imageUrl;
if(!imageUrl)
    {throw new Error("Image upload failed");

}

return fetch("http://localhost:5000/products",{
   method:"POST",
headers:{"Content-Type":"application/json"},
   body: JSON.stringify({
    title:TitleText,
    description:descText,
    price:parseFloat(priceText),
    imageUpload:imageUrl
   }),
});
})


//handling response from the server
.then(response=>{
    //checks if response from server is not okay(status code other than 200-299)
    if(!response.ok){
        throw new Error(`Server error: ${response.status} ${response.statusText}`);//throws error with status code and status messsage

    }
    return  response.json();//parsing the request as JSON
})
.then(data=>{
    alert(data.message);//displaying success message from the server
    //clearing the input field after successful upload
    title.value="";
    description.value="";
    
    price.value="";
    imageUpload.value="";
    imagePreview.innerHTML="Preview";//resetting the preview section
    console.log("Upload Response:",data);
    fetchProducts();
})
//handling errors if the request fails
.catch(error=>{
    console.error("Error:",error);//logging the error in the console for debugging
    alert("Upload failed. Please try again."+ error.message);//displays an error msg to the user
});
}
function deleteProduct(id){
    if(confirm("Are you sure you want to delete this product?")){
        fetch(`http://localhost:5000/products/${id}`,{method: "DELETE"})
        .then(response=>response.json())
        .then(data=>{
            alert(data.message);
            fetchProducts();
        })
       
        .catch(error=>{
            console.error("Error deleting product:",error);
            alert("Failed to delete product.");
        });
    
    }
}

function fetchProducts() {
    fetch("http://localhost:5000/products")
        .then(response =>{ 
            
           if (!response.ok){
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            return  response.json();
})
        .then(products => {
            const productlist = document.getElementById("productlist");
            if(!productlist){
                console.error("Error: Product list element not found.");
                return;
            }
            productlist.innerHTML = ""; // Clear existing list

if(Array.isArray(products)){
   

            products.forEach(product => {
                const li = document.createElement("li");
               const img=document.createElement("img");
               img.src=product.imageUpload;
               img.alt=product.title;
               img.style.maxWidth="150px";
               
               const lititle=document.createElement("h3");
               lititle.textContent=product.title;

               const lidescription=document.createElement("p");
               lidescription.textContent=product.description;

               const liprice=document.createElement("p");
               liprice.textContent=`Price:$${product.price}`;

               
            
       
               
        const deletebtn=document.createElement("button");
        deletebtn.textContent="Delete";
        deletebtn.addEventListener("click",function(){
            deleteProduct(product.id);
        });
               /* li.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <img src="${product.imageUpload}" alt="${product.title}" style="max-width:100px;">
                    
                    `;*/
                    li.appendChild(img);
                    li.appendChild(lititle);
                    li.appendChild(lidescription);
                    li.appendChild(liprice);
                    li.appendChild(deletebtn);
                productlist.appendChild(li);
            });
        }
    })
        .catch(error => console.error("Error fetching products:", error));
}





//function loadProducts(){
  //  fetch("http://localhost:5000/products")
    //.then(response=>response.json())
    //.then(data=>{
      //  productlist.innerHTML="";
        //data.forEach(product=>{
          //  const listItem= document.createElement("li");
            //listItem.innerHTML=`
            //<img src="${product.image_url}" alt="${product.title}" width="100">
           // <strong>${product.title}</strong>
            //<p>${product.description}</p>
            //<button onclick="editProduct(${product.id},'${product.title}','${product.description}')">Edit</button>
           //<button onclick="deleteProduct(${product.id})">Delete</button>
            //`;
           // productlist.appendChild(listItem);
        //});

   // })
   // .catch(error=>console.error("Error fetching products:", error));
//}
function editProduct(id,currentimageUpload,currentTitle,currentDescription,currentPrice){
    
    
    const newimageUpload=prompt("Upload image:",currentimageUpload);
    const newTitle=prompt("Enter  title:", currentTitle);
    const newDescription= prompt("Enter description:",currentDescription);
const newPrice=prompt("Enter price:",currentPrice);

    if(newimageUpload !==null && newTitle.trim() !== null&& newDescription.trim() !==null && newPrice !== null){
        fetch(`http://localhost:5000/products/${id}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({imageUpload:newimageUpload,title:newTitle, description:newDescription,price:newPrice}),
        })
        .then(response=>response.json())
        .then(data=>{
            alert(data.message);
            fetchProducts();
        })
        .catch(error=>console.error("Error updating product:", error));
    }

}


fetchProducts();
//loadProducts();

uploadbtn.addEventListener("click",function(event)
{
    event.preventDefault();
    uploadImage();
});

console.log("script loaded successfully!");
});
