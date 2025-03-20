import { NextResponse } from 'next/server';

// Google Maps API endpoints
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';
const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export async function POST(request: Request) {
  try {
    const { address, type } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key is not configured' },
        { status: 500 }
      );
    }

    if (type === 'geocode') {
      // Get coordinates from address
      const geocodeResponse = await fetch(
        `${GEOCODE_API_URL}?address=${encodeURIComponent(address)}&key=${apiKey}`
      );

      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== 'OK') {
        return NextResponse.json(
          { error: 'Failed to geocode address', details: geocodeData.status },
          { status: 400 }
        );
      }

      const location = geocodeData.results[0].geometry.location;
      const formattedAddress = geocodeData.results[0].formatted_address;

      // Find nearby restaurants
      const nearbySearchResponse = await fetch(
        `${PLACES_API_URL}/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&type=restaurant&key=${apiKey}`
      );

      const nearbyData = await nearbySearchResponse.json();

      if (nearbyData.status !== 'OK') {
        return NextResponse.json(
          { error: 'Failed to find nearby restaurants', details: nearbyData.status },
          { status: 400 }
        );
      }

      // Get details for the input address (assuming it's a restaurant)
      let businessDetails = null;

      // Try to find the business in the nearby results first
      const matchingBusiness = nearbyData.results.find(
        (place: any) => place.vicinity.toLowerCase().includes(address.toLowerCase())
      );

      if (matchingBusiness) {
        const detailsResponse = await fetch(
          `${PLACES_API_URL}/details/json?place_id=${matchingBusiness.place_id}&fields=name,rating,user_ratings_total,formatted_phone_number,opening_hours,price_level,types,formatted_address&key=${apiKey}`
        );

        const detailsData = await detailsResponse.json();

        if (detailsData.status === 'OK') {
          businessDetails = detailsData.result;
        }
      }

      // Get top competitors (other nearby restaurants)
      const competitors = nearbyData.results
        .filter((place: any) => place.place_id !== (matchingBusiness?.place_id || ''))
        .slice(0, 3)
        .map((place: any) => ({
          id: place.place_id,
          name: place.name,
          rating: place.rating,
          vicinity: place.vicinity,
          types: place.types,
        }));

      return NextResponse.json({
        location,
        formattedAddress,
        businessDetails,
        competitors,
        nearbyCount: nearbyData.results.length
      });
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in Google Maps API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}