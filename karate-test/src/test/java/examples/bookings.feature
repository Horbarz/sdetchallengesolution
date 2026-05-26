Feature: Booking Creation
  Testing the booking creation endpoint

Background:
  * url 'https://automationintesting.online'

Scenario: Create a new booking
  # Step 1: Get available rooms to find a valid roomid
  Given path '/api/room/'
  When method get
  Then status 200
  * def roomid = response.rooms[0].roomid
  * assert roomid != null

  # Step 2: Create booking with the retrieved roomid
  * def firstNames = ['James', 'Oliver', 'Emma', 'Oba', 'Peter', 'Ava', 'Noah', 'Isabella']
  * def lastNames = ['Adetoba', 'Johnson', 'Williams', 'Brown', 'Jones', 'Samuel', 'Ken', 'Abioye']
  * def randName = function(arr){ return arr[Math.floor(Math.random() * arr.length)] }
  * def firstname = randName(firstNames)
  * def lastname = randName(lastNames)
  * def futureDate = function(days){ var d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().substring(0, 10) }
  * def offset = Math.floor(Math.random() * 300) + 30
  * def checkin = futureDate(offset)
  * def checkout = futureDate(offset + 1)
  * def requestBody = ({ firstname: firstname, lastname: lastname, depositpaid: true, bookingdates: { checkin: checkin, checkout: checkout }, roomid: roomid })
  Given path '/api/booking/'
  And header Content-Type = 'application/json'
  And request requestBody
  When method post
  Then status 201
  And match response.bookingid == '#number'
  And match response.firstname == firstname
  And match response.lastname == lastname
  And match response.depositpaid == true
  And match response.bookingdates.checkin == checkin
  And match response.bookingdates.checkout == checkout
  And match response.bookingid == '#number'
  * assert response.bookingid > 0

