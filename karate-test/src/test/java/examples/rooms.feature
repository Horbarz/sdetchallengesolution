Feature: Room Inventory

Background:
  * url 'https://automationintesting.online'

Scenario: Retrieve available rooms
  Given path '/api/room/'
  When method get
  Then status 200
  And match response.rooms == '#[]'
  And match response.rooms[0] == '#object'
  And match response.rooms[*].roomPrice == '#[] #number'
  
Scenario: Verify room exists with valid price
  Given path '/api/room/'
  When method get
  Then status 200
  * def hasValidRoom = karate.filter(response.rooms, function(x){ return x.roomPrice > 0 })
  * assert hasValidRoom.length > 0
  And match response.rooms[0].roomid == '#number'
  And match response.rooms[0].roomName == '#string'
