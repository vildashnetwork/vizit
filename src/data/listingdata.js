


import axios from "axios";

const response = await axios.get("https://vizit-backend-hubw.onrender.com/api/house/houses");

export const data = response.data.houses.map((house) => ({
  type: house.type,
  image: house.image,
  title: house.title,
  location: {
    address: house.location.address,
    coordinates: {
      lat: house.location.coordinates.lat,
      lng: house.location.coordinates.lng,
    },
  },
  rent: house.rent,
  bedrooms: house.bedrooms,
  bathrooms: house.bathrooms,
  area_sqm: house.area_sqm,
  amenities: house.amenities,
  isAvailable: house.isAvalable,
  postedAt: house.createdAt,
  listingId: house._id,
  description: house.description,
  how: house?.how,
  reviews: {
    overallRating: house.reviews.overallRating,
    totalReviews: house.reviews.totalReviews,
    entries: house.reviews.entries,
  },
  images: house.reviews.images,
}));
