Feature: Branding Verification

Background:
  * url 'https://automationintesting.online'

Scenario: Validate B&B branding information
  Given path '/api/branding/'
  When method get
  Then status 200
  And match response.name == 'Shady Meadows B&B'
  And match response.contact == { email: '#string', name: '#string', phone: '#string' }
  And match response.contact.email == '#regex [a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}'
  And match response.contact.phone == '#string'
  And match response.contact.name == 'Shady Meadows B&B'
  And match response.description == '#string'


