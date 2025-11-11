Run this command to load data in your database:
python manage.py loaddata sample_data.json

Base URL:
http://127.0.0.1:8000/

Home page APIs:

1.  GET /apis/categories/

[
{
"id": 3,
"name": "Lenses",
"description": "",
"image": "http://127.0.0.1:8000/media/categories/Azure_Vision_Blue_Lenses.jpg",
"count": 3
},
{
"id": 5,
"name": "Accessories",
"description": "",
"image": "http://127.0.0.1:8000/media/categories/beaded_chain.jpeg",
"count": 3
},
{
"id": 4,
"name": "Sports",
"description": "",
"image": null,
"count": 3
},
{
"id": 2,
"name": "Sunglasses",
"description": "",
"image": "http://127.0.0.1:8000/media/categories/Solaris_Goldline_q0bfKuC.jfif",
"count": 3
},
{
"id": 1,
"name": "Eyeglasses",
"description": "",
"image": "http://127.0.0.1:8000/media/categories/Dual-Tone_MetalPlastic_Eyeglasses.jfif",
"count": 4
}
]

2. GET /apis/featured-products/

ratings and reviews not implemented yet

[
{
"id": 1,
"name": "Aurum Edge",
"price": "3299.00",
"image": "http://127.0.0.1:8000/media/products/Dual-Tone_MetalPlastic_Eyeglasses.jfif",
"tag": null
},
{
"id": 2,
"name": "Solaris Goldline",
"price": "2599.00",
"image": "http://127.0.0.1:8000/media/products/Solaris_Goldline.jfif",
"tag": ""
},
{
"id": 3,
"name": "Noir Axis",
"price": "2399.00",
"image": "http://127.0.0.1:8000/media/products/Noir_Axis.jfif",
"tag": null
},
{
"id": 4,
"name": "Ray-Ban Eclipse",
"price": "4499.00",
"image": "http://127.0.0.1:8000/media/products/Ray-Ban_Eclipse.jfif",
"tag": null
}
]

3. GET /apis/hero-slides/

[
{
"id": 1,
"title": "See Yourself in Perfect Vision",
"subtitle": "Try on glasses virtually with our advanced AR technology",
"cta": "Try Virtual Fitting",
"image": "http://127.0.0.1:8000/media/hero_slides/Dual-Tone_MetalPlastic_Eyeglasses.jfif"
},
{
"id": 2,
"title": "Designer Frames Collection",
"subtitle": "Premium quality eyewear from top brands worldwide",
"cta": "Shop Collection",
"image": "http://127.0.0.1:8000/media/hero_slides/Solaris_Goldline.jfif"
},
{
"id": 3,
"title": "Prescription Made Easy",
"subtitle": "Upload your prescription and get custom lenses delivered",
"cta": "Upload Prescription",
"image": "http://127.0.0.1:8000/media/hero_slides/prescription_glasses.jfif"
}
]

ProductDetail page APIs:

1. GET products/<int: id>/

{
"id": 1,
"name": "Aurum Edge",
"description": "Sleek dual-tone eyeglasses featuring a deep black-brown plastic upper rim and a refined metallic lower frame. Designed for subtle sophistication that pairs with any look.",
"price": "3299.00",
"stock_status": "In stock",
"brand": "Vincent Chase",
"frame_material": [
"Plastic",
"Metal"
],
"color": [
"Brown",
"Black"
],
"gender": "U",
"image": "http://127.0.0.1:8000/media/products/Dual-Tone_MetalPlastic_Eyeglasses.jfif",
"category": "Eyeglasses"
}

Category page API:

1. GET /apis/products/?category=Eyeglasses OR /apis/products/

You can enter the tag in db from admin panel yourself.

[
{
"id": 1,
"name": "Aurum Edge",
"price": "3299.00",
"image": "http://127.0.0.1:8000/media/products/Dual-Tone_MetalPlastic_Eyeglasses.jfif",
"tag": null
},
{
"id": 9,
"name": "Hybrid Eyeglasses",
"price": "3200.00",
"image": "http://127.0.0.1:8000/media/products/Hybrid_Eyeglasses.jpg",
"tag": null
},
{
"id": 15,
"name": "CrystalEdge Transparent Glasses",
"price": "4200.00",
"image": "http://127.0.0.1:8000/media/products/CrystalEdge_Transparent_Glasses.webp",
"tag": null
},
{
"id": 16,
"name": "PureRound Metal Eyeglasses",
"price": "4600.00",
"image": "http://127.0.0.1:8000/media/products/PureRound_Metal_Eyeglasses.jpg",
"tag": null
}
]

Authentication APIs

1. POST http://127.0.0.1:8000/apis/auth/login/

input: {
"email": "toobafar004@gmail.com",
"password": "mypassword123"
}

output: {
"message": "Login successful.",
"user": {
"name": "",
"email": "toobafar004@gmail.com",
"phone": null
},
"tokens": {
"refresh": "eyJh.WSmTZAONHzzroSLspFKTinP0gpatNHVe9dNVGipvo1Y",
"access": "eyJhbGciOiJIUzIgG52wR1nuc"
}
}

2. POST http://127.0.0.1:8000/apis/auth/register/

input: {
"name": "John Doe",
"email": "john@example.com",
"phone": "03001234567",
"password": "mypassword123"
}

output: {
"message": "Account created successfully.",
"user": {
"name": "John Doe",
"email": "john@example.com",
"phone": "03001234567"
},
"tokens": {
"refresh": "eyJ0eXAiOiJKV1QiLCJh...",
"access": "eyJ0eXAiOiJKV1QiLCJh..."
}
}

Since token are given on register you can automatically log them in.

Checkout APIs:

1. POST http://127.0.0.1:8000/apis/place-order/
   input :
   {
   "name": "Tooba Farooq",
   "email": "tooba@example.com",
   "phone": "03001234567",
   "address": "NED University, Karachi",
   "instructions": "Deliver between 2–4 PM",
   "discount_code": "WELCOME10",
   "payment_method": "cod/card",
   "items": [
   {
   "product": 1,
   "quantity": 2,
   "price": 750
   },
   {
   "product": 5,
   "quantity": 1,
   "price": 300
   }
   ]
   }

output:
{
"message": "Order placed successfully!",
"order_id": 2,
"payment_method": "card",
"total": 1800.0
}

Before checkout you can give user 2 options checkout as user or login to checkout faster

Stripe Payment API:

1. POST http://127.0.0.1:8000/apis/place-order/

input:
{
"name": "Test User",
"email": "test@example.com",
"phone": "1234567890",
"address": "123 Test St",
"payment_method": "card",
"items": [
{"product": 1, "quantity": 4, "price": 5000}
]
}

output:
{
"message": "Order placed successfully!",
"order_id": 6,
"payment_method": "card",
"total": 20000.0
}

2. POST http://127.0.0.1:8000/apis/create-checkout-session/

input:
{
"order_id": 6
}

output:
{
"url": "https://checkout.stripe.com/c/pay/cs_test_a15ODcGB4JSUl"
}

INSTRUCTIONS:

1. First make a .env file with these variables
   STRIPE*SECRET_KEY=sk_test*
   STRIPE*PUBLISHABLE_KEY=pk_test*
   STRIPE*WEBHOOK_SECRET=whsec*

Now from stripe get secret key and publishable key and enter it

2. Install Stripe CLI and enter its PATH in environment variables

3. Open cmd in the directory where stripe.exe exists
   run command stripe login and give access from browser
   then run command stripe listen --forward-to http://127.0.0.1:8000/apis/stripe-webhook/
   and paste the webhook in .env file and then you can use these apis do payment and check if the order status in db is updated or not.
