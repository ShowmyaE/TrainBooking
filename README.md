# TrainBooking

POST CALL
https://trainbooking-rkuh.onrender.com/signUp

body {
    "username": "showmya",
"password": "showmya@2001",
"email":"showmya@2001"
 }

POST We will get Brearer Token If success
https://trainbooking-rkuh.onrender.com/loginIn

Body {
    "username": "showmya",
"password": "showmya@2001"
 
}
POST with Brearer token in header
https://trainbooking-rkuh.onrender.com/addtrain

Body
    {"train_name": "Mangalore Express","source": "Station B","destination": "Station D","seat_capacity":"950","arrival_time_at_source":"14:00:00","arrival_time_at_destination": "20:30:00"
}

GET
https://trainbooking-rkuh.onrender.com/getseat?source=Station B&destination=Station D



