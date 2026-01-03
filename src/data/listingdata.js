// export const data =
//   [

//     {
//       "type": "Modern Room",
//       "image": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
//       "title": "New Bell Standard Apartment",
//       "location": {
//         "address": "New Bell, Douala, Cameroon",
//         "coordinates": {
//           "lat": 4.0321,
//           "lng": 9.7089
//         }
//       },
//       "rent": "42,000 XFA",
//       "bedrooms": 1,
//       "bathrooms": 1,
//       "area_sqm": 48,
//       "amenities": ["Security", "Balcony", "Wi-Fi"],
//       "isAvailable": true,
//       "postedAt": "2025-10-19T15:10:00Z",
//       "listingId": "apt-newbell-standard-019",
//       "description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste velit id illum earum.Rem provident nostrum qui tenetur, assumenda quam distinctio eligendi minus maxime, itaque dolorem?Eveniet consectetur velit ad minus fuga, nulla nam, ratione, blanditiis in consequatur quas?Illum tempore quidem, sunt consequatur vero iure. Quo dicta magnam culpa error non.Aperiam impedit necessitatibus molestias reprehenderit. Accusantium eligendi quidem delectus earum ullam, inventore sed.Similique, soluta debitis, itaque ad aperiam mollitia rem nam asperiores accusamus, in tempore?Voluptatibus temporibus ab expedita nulla officia earum alias possimus consequatur, voluptates cum ipsa.Minus beatae quis veritatis nesciunt? Excepturi iusto iste doloremque ipsum eveniet possimus. Blanditiis!Perferendis repellat numquam nisi, amet debitis hic necessitatibus repellendus ipsam reiciendis aspernatur ",
//       reviews: {
//         overallRating: 4.7,
//         totalReviews: 3,
//         entries: [
//           {
//             name: "Sarah J.",
//             rating: 5,
//             comment: "Absolutely loved living here! The apartment is beautiful, spacious, and the building amenities are fantastic. The location is unbeatable, close to everything I needed. Highly recommend!"
//           },
//           {
//             name: "Michael T.",
//             rating: 4,
//             comment: "Great apartment with modern finishes. The staff is very responsive to maintenance requests. Only minor issue was occasional street noise, but overall a wonderful experience."
//           },
//           {
//             name: "Jessica L.",
//             rating: 5,
//             comment: "Perfect for families! The nearby park and schools were a huge plus. The apartment itself is very well-maintained and felt very safe. Vizit Verified status gave us peace of mind."
//           }]
//       },
//       images:
//         [
//           "https://images.unsplash.com/photo-1600585154340-9636a0dcd5a5?w=500",
//           "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500",
//           "https://images.unsplash.com/photo-1600573472550-8090be8bfb6c?w=500",
//           "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=500",
//           "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500",
//           "https://images.unsplash.com/photo-1600585154084-4e8fe7c3f2ac?w=500",
//           "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
//           "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500",
//           "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=500",
//           "https://images.unsplash.com/photo-1600585154340-9636a0dcd5a5?w=500"
//         ],

//     }

//   ]








import axios from "axios";

const response = await axios.get("http://localhost:6300/api/house/houses");

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
