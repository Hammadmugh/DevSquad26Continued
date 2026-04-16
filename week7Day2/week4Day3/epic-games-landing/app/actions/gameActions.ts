'use server';

// Helper function to get the base URL for API calls
const baseUrl = process.env.NEXT_PUBLIC_API_URL

export async function fetchHeroSectionData() {
  try {
    console.log('Fetching hero from:', `${baseUrl}/api/hero`);
    const response = await fetch(`${baseUrl}/api/hero`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Hero data fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching hero data:', error);
    return [];
  }
}

export async function fetchGamesOnSale() {
  try {
    console.log('Fetching games on sale from:', `${baseUrl}/api/games-on-sale`);
    const response = await fetch(`${baseUrl}/api/games-on-sale`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Games on sale fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching games on sale:', error);
    return [];
  }
}

export async function fetchFeaturedGames() {
  try {
    console.log('Fetching featured games from:', `${baseUrl}/api/featured-games`);
    const response = await fetch(`${baseUrl}/api/featured-games`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Featured games fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching featured games:', error);
    return [];
  }
}

export async function fetchFreeGames() {
  try {
    console.log('Fetching free games from:', `${baseUrl}/api/free-games`);
    const response = await fetch(`${baseUrl}/api/free-games`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Free games fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching free games:', error);
    return [];
  }
}

export async function fetchTopSellers() {
  try {
    console.log('Fetching top sellers from:', `${baseUrl}/api/top-sellers`);
    const response = await fetch(`${baseUrl}/api/top-sellers`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Top sellers fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching top sellers:', error);
    return [];
  }
}

export async function fetchBestSellers() {
  try {
    console.log('Fetching best sellers from:', `${baseUrl}/api/best-sellers`);
    const response = await fetch(`${baseUrl}/api/best-sellers`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Best sellers fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching best sellers:', error);
    return [];
  }
}

export async function fetchTopUpcomingGames() {
  try {
    console.log('Fetching upcoming games from:', `${baseUrl}/api/upcoming-games`);
    const response = await fetch(`${baseUrl}/api/upcoming-games`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Upcoming games fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching upcoming games:', error);
    return [];
  }
}

export async function fetchResourceLinks() {
  try {
    console.log('Fetching from:', `${baseUrl}/api/resource-link`);
    const response = await fetch(`${baseUrl}/api/resource-link`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    const res = await response.json();
    console.log('✅ Resource links fetched:', res);
    return res;
  } catch (error) {
    console.error('❌ Error fetching resource links:', error);
    return [];
  }
}
