TABLE users {
  id INTEGER PK
  firstName STRING
  lastName STRING
  email STRING UNIQUE
  username STRING UNIQUE
  password STRING
}

TABLE spots {
  id INTEGER PK
  ownerId INTEGER
  address STRING
  city STRING
  state STRING
  country STRING
  lat FLOAT
  lng FLOAT
  name STRING
  description STRING
  price FLOAT
  createdAt DATE
  updatedAt DATE
  previewImage STRING
}

TABLE SpotImages {
  id INTEGER PK
  url STRING
  preview BOOLEAN
}

TABLE reviews {
  id INTEGER PK
  userId INTEGER
  spotId INTEGER
  review STRING
  stars FLOAT
  createdAt TIMESTAMP
  updatedAt TIMESTAMP

}

TABLE bookings {
  id INTEGER PK
  spotId INTEGER
  userId INTEGER
  startDate DATE
  endDate DATE
  createdAt TIMESTAMP
  updatedAt TIMESTAMP
}

Ref: users.id < spots.ownerId
Ref: spots.previewImage < SpotImages.url
Ref: reviews.userId < users.id
Ref: reviews.spotId < spots.id
Ref: bookings.spotId < spots.id
Ref: bookings.userId < users.id
