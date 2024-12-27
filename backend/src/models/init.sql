-- Sample data for testing

-- Admin user
INSERT INTO users (email, password_hash, role, full_name, phone)
VALUES (
    'admin@myproperty.com',
    '$2a$10$Z9iaLiYWl.0d7PAXqMWtnONg3eQUJAoPQj7xzV8yvlLRvHAn.ccDK', -- password123
    'admin',
    'System Administrator',
    '+1234567890'
);

-- Sample landlord
INSERT INTO users (email, password_hash, role, full_name, phone)
VALUES (
    'landlord@example.com',
    '$2a$10$Z9iaLiYWl.0d7PAXqMWtnONg3eQUJAoPQj7xzV8yvlLRvHAn.ccDK', -- password123
    'landlord',
    'John Doe',
    '+1234567891'
);

-- Sample agent
INSERT INTO users (email, password_hash, role, full_name, phone)
VALUES (
    'agent@example.com',
    '$2a$10$Z9iaLiYWl.0d7PAXqMWtnONg3eQUJAoPQj7xzV8yvlLRvHAn.ccDK', -- password123
    'agent',
    'Jane Smith',
    '+1234567892'
);

-- Sample renter
INSERT INTO users (email, password_hash, role, full_name, phone)
VALUES (
    'renter@example.com',
    '$2a$10$Z9iaLiYWl.0d7PAXqMWtnONg3eQUJAoPQj7xzV8yvlLRvHAn.ccDK', -- password123
    'renter',
    'Bob Wilson',
    '+1234567893'
);

-- Sample properties
INSERT INTO properties (
    title,
    description,
    price,
    address,
    bedrooms,
    bathrooms,
    area_sqft,
    property_type,
    status,
    owner_id
)
SELECT
    'Modern Downtown Apartment',
    'Beautiful modern apartment in the heart of downtown with amazing city views.',
    2500.00,
    '123 Main St, Downtown',
    2,
    2,
    1200.50,
    'apartment',
    'approved',
    id
FROM users WHERE email = 'landlord@example.com';

INSERT INTO properties (
    title,
    description,
    price,
    address,
    bedrooms,
    bathrooms,
    area_sqft,
    property_type,
    status,
    owner_id
)
SELECT
    'Luxury Beach House',
    'Stunning beachfront property with private access to the beach.',
    5000.00,
    '456 Beach Rd, Seaside',
    4,
    3,
    2500.75,
    'house',
    'pending',
    id
FROM users WHERE email = 'agent@example.com';

-- Sample property images
INSERT INTO property_images (property_id, image_url, is_primary)
SELECT
    id,
    'https://example.com/images/apartment1.jpg',
    true
FROM properties WHERE title = 'Modern Downtown Apartment';

INSERT INTO property_images (property_id, image_url, is_primary)
SELECT
    id,
    'https://example.com/images/house1.jpg',
    true
FROM properties WHERE title = 'Luxury Beach House';

-- Sample contact messages
INSERT INTO contact_messages (
    property_id,
    sender_id,
    receiver_id,
    message
)
SELECT
    p.id,
    u1.id,
    u2.id,
    'I am interested in viewing this property. When would be a good time?'
FROM
    properties p,
    users u1,
    users u2
WHERE
    p.title = 'Modern Downtown Apartment'
    AND u1.email = 'renter@example.com'
    AND u2.email = 'landlord@example.com';
