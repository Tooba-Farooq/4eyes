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
"image": "http://127.0.0.1:8000/media/products/Dual-Tone_MetalPlastic_Eyeglasses.jfif"
},
{
"id": 2,
"name": "Solaris Goldline",
"price": "2599.00",
"image": "http://127.0.0.1:8000/media/products/Solaris_Goldline.jfif"
},
{
"id": 3,
"name": "Noir Axis",
"price": "2399.00",
"image": "http://127.0.0.1:8000/media/products/Noir_Axis.jfif"
},
{
"id": 4,
"name": "Ray-Ban Eclipse",
"price": "4499.00",
"image": "http://127.0.0.1:8000/media/products/Ray-Ban_Eclipse.jfif"
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
