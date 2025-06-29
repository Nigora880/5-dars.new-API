let elList = document.querySelector(".list")
let modalWrapper = document.querySelector(".modal-wrapper")
let modalInner = document.querySelector(".modal-inner")
elList.innerHTML = "Loading..."

const api = "https://fakestoreapi.com/products/"
const TOKEN = "7839711085:AAH3xr54xzKH1IsI3iSNhLhkSirC9OHYNkI"
const CHAT_ID =" -1002653141135"
const API_Message = "https://api.telegram.org/bot${TOKEN}/sendMessage"
// https://api.telegram.org/bot<token>/METHOD_NAME

// get products
const getProducts = () =>  axios(api).then(res => renderProducts(res.data, elList))
getProducts()

// render products
function renderProducts(arr, list){ 
    list.innerHTML = null
    arr.forEach(item => {
        let elItem = document.createElement("li")
        elItem.className = "w-[300px] rounded-md overflow-hidden p-3 bg-white shadow-md"
        elItem.innerHTML = `
        <img class="h-[250px] mx-auto mb-3" src="${item.image}"alt="product img"/>
        <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${item.title}</h2>
        <p class="line-clamp-3">${item.description}</p>
        <strong class="text-[20px] mb-2 inline-block">${item.price} $</strong>
        <button onclick="handleOrder(${item.id})" class="w-full cursor-pointer hover:scale-[1.02] duration-300 py-2 rounded-md bg-green-600 text-white font-semibold">Order</button>
        `
        list.append(elItem)
    })
}

// order part 
function handleOrder(id){
    modalWrapper.classList.remove("scale-0")
    modalInner.innerHTML = "Loading..."

    axios(`${api}/${id}`).then(res => {
       modalInner.innerHTML = `
   <div class="flex gap-[30px]">
       <img class="w-[200px] h-[300px]"  src="${res.data.image}" alt="" width="300" height="300"  /> 
     <div class="w-[300px]"> 
       <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${res.data.title}</h2>
       <p class="line-clamp-3">${res.data.description}description</p>
       <strong class="text-[20px] mb-2 inline-block">${res.data.price} $</strong>
    <form class="order-form space-y-2 autocomplete="off"> 
           <input class="p-2 rounded-md outline-none shadow-md w-full border-[1px]" placeholder="enter name" name="name">
           <input class="p-2 rounded-md outline-none shadow-md w-full border-[1px]" placeholder="enter phone number" name="tel">
           <input class="p-2 rounded-md outline-none shadow-md w-full border-[1px]" placeholder="enter address" name="address">
           <button type="submit" class="w-full cursor-pointer hover:scale-[1.02] duration-300 py-2 rounded-md bg-green-600 text-white font-semibold">Order</button>

    </form>
       </div>
   </div>
   `  

   let elOrderForm = document.querySelector(".order-form")
  elOrderForm.addEventListener("submit", function(e){
    e.preventDefault()
    let message = `<b>Name: ${e.target.name.value}</b> \n`
    message += `<b>Phone number: ${e.target.tel.value}</b> \n`
    message += `<b>Address: ${e.target.address.value}</b> \n`

      const data = {
                parse_mode:"html",
                chat_id:CHAT_ID,
                photo:res.data.image,
                text:message
            }
      axios.post(API_Message,data)
})
  
  
  })
}

modalWrapper.addEventListener("click", (e) => e.target.id == "wrapper" ? modalWrapper.classList.add("scale-0") : "")


