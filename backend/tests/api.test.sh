#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3001/api"

# Store tokens
ADMIN_TOKEN=""
LANDLORD_TOKEN=""
AGENT_TOKEN=""
RENTER_TOKEN=""

echo "Starting API tests..."

# Test user authentication
echo -e "\n${GREEN}Testing Authentication Endpoints${NC}"

# Test admin login
echo "Testing admin login..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myproperty.com","password":"password123"}')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin login successful${NC}"
else
  echo -e "${RED}✗ Admin login failed${NC}"
  exit 1
fi

# Test landlord login
echo "Testing landlord login..."
LANDLORD_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"landlord@example.com","password":"password123"}')
LANDLORD_TOKEN=$(echo $LANDLORD_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$LANDLORD_TOKEN" ]; then
  echo -e "${GREEN}✓ Landlord login successful${NC}"
else
  echo -e "${RED}✗ Landlord login failed${NC}"
fi

# Test property creation
echo -e "\n${GREEN}Testing Property Endpoints${NC}"

echo "Creating new property as landlord..."
PROPERTY_RESPONSE=$(curl -s -X POST "$BASE_URL/properties" \
  -H "Authorization: Bearer $LANDLORD_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "description": "A test property listing",
    "price": 1500.00,
    "address": "123 Test St",
    "bedrooms": 2,
    "bathrooms": 1,
    "area_sqft": 1000,
    "property_type": "apartment"
  }')

PROPERTY_ID=$(echo $PROPERTY_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$PROPERTY_ID" ]; then
  echo -e "${GREEN}✓ Property creation successful${NC}"
else
  echo -e "${RED}✗ Property creation failed${NC}"
fi

# Test property approval
echo "Testing property approval as admin..."
APPROVAL_RESPONSE=$(curl -s -X PATCH "$BASE_URL/properties/$PROPERTY_ID/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}')

if [[ $APPROVAL_RESPONSE == *"approved"* ]]; then
  echo -e "${GREEN}✓ Property approval successful${NC}"
else
  echo -e "${RED}✗ Property approval failed${NC}"
fi

# Test property listing
echo "Testing property listing..."
PROPERTIES_RESPONSE=$(curl -s -X GET "$BASE_URL/properties" \
  -H "Authorization: Bearer $LANDLORD_TOKEN")

if [[ $PROPERTIES_RESPONSE == *"Test Property"* ]]; then
  echo -e "${GREEN}✓ Property listing successful${NC}"
else
  echo -e "${RED}✗ Property listing failed${NC}"
fi

# Test contact message
echo -e "\n${GREEN}Testing Contact Endpoints${NC}"

echo "Creating contact message..."
CONTACT_RESPONSE=$(curl -s -X POST "$BASE_URL/contact" \
  -H "Authorization: Bearer $RENTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"property_id\": \"$PROPERTY_ID\",
    \"message\": \"I am interested in viewing this property\"
  }")

if [[ $CONTACT_RESPONSE == *"message"* ]]; then
  echo -e "${GREEN}✓ Contact message creation successful${NC}"
else
  echo -e "${RED}✗ Contact message creation failed${NC}"
fi

echo -e "\n${GREEN}API Tests Completed${NC}"
