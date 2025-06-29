let elList = document.querySelector(".list")
let modalWrapper = document.querySelector(".modal-wrapper")
let modalInner = document.querySelector(".modal-inner")
elList.innerHTML = "Loading..."

const api = "https://fakestoreapi.com/products"

const TOKEN = "8120408127:AAHBl7lt-PlJUWtMys7-tnJnAwyWPSk8qi8"
const CHAT_ID = "-1002697534326"
// const API_Message = `https://api.telegram.org/bot${TOKEN}/sendMessage`
const API_Message = `https://api.telegram.org/bot${TOKEN}/sendPhoto`


// Get Products
const getProducts = () => axios(api).then(res => renderProducts(res.data, elList))
getProducts()
// Get Products

// Render Products
function renderProducts(arr, list) {
    list.innerHTML = null
    arr.forEach(item => {
        let elItem = document.createElement("li")
        elItem.className = "w-[300px] rounded-md overflow-hidden p-3 bg-white shadow-md"
        elItem.innerHTML = `
            <img class="h-[250px] mx-auto mb-3" src="${item.image}" alt="Product img"/>
            <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${item.title}</h2>
            <p class="line-clamp-3 mb-1">${item.description}</p>
            <strong class="text-[20px] mb-2 inline-block">${item.price} $</strong>
            <button onclick="handleOrder(${item.id})" class="w-full cursor-pointer hover:scale-[1.02] duration-300 py-2 rounded-md bg-green-600 text-white font-semibold">Order</button>
        `
        list.append(elItem)
    })
}
// Render Products

// Order Part
function handleOrder(id) {
    modalWrapper.classList.remove("scale-0")
    modalInner.innerHTML = "Loading..."

    axios(`${api}/${id}`).then(res => {
        modalInner.innerHTML = `
        <div class="flex gap-[30px]">
                <img class="w-[300px] h-[400px]" src="${res.data.image}" alt="" width="300" height="300"/>
                <div class="w-[300px]">
                    <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${res.data.title}</h2>
                    <p class="line-clamp-3 mb-1">${res.data.description}</p>
                    <strong class="text-[20px] mb-2 inline-block">${res.data.price} $</strong>
                    <form class="order-form space-y-2" autocomplete="off">
                        <input type="text" class="p-2 rounded-md outline-none shadow-md w-full border-[1px]" placeholder="Enter name" name="name"/>
                        <input type="tel" class="p-2 rounded-md outline-none shadow-md w-full border-[1px]" placeholder="Enter phone number" name="phone"/>
                        <input type="text" class="p-2 rounded-md outline-none shadow-md w-full border-[1px]" placeholder="Enter address" name="address"/>
                        <button type="submit" class="w-full cursor-pointer hover:scale-[1.02] duration-300 py-2 rounded-md bg-green-600 text-white font-semibold">Order</button>
                    </form>
                </div>
            </div>
        `

        let elOrderForm = document.querySelector(".order-form")
        elOrderForm.addEventListener("submit", function (e) {
            e.preventDefault()
            let message = `<b>Title: ${res.data.title}</b> \n`
            message += `<b>Description: ${res.data.description}</b> \n`
            message += `<b>Price: ${res.data.price}$</b> \n`
            message += `--------------------------------- \n`
            message += `<b>Name: ${e.target.name.value}</b> \n`
            message += `<b>Phone number: ${e.target.phone.value}</b> \n`
            message += `<b>Address: ${e.target.address.value}</b> \n`

            // const data = { Message uchun
            //     parse_mode:"html",
            //     text:message,
            //     chat_id:CHAT_ID
            // }

            const data = {
                parse_mode:"html",
                chat_id:CHAT_ID,
                photo:res.data.image,
                caption:message
            }

            axios.post(API_Message,data).then(() => modalWrapper.classList.add("scale-0"))
        })
    })


}
// Order Part

modalWrapper.addEventListener("click", (e) => e.target.id == "wrapper" ? modalWrapper.classList.add("scale-0") : "")


