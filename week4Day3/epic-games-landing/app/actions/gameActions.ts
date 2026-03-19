'use server';

export async function fetchHeroSectionData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/hero`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) throw new Error('Failed to fetch hero data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return [];
  }
}

export async function fetchGamesOnSale() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/games-on-sale`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch games on sale');
    return await response.json();
  } catch (error) {
    console.error('Error fetching games on sale:', error);
    return [];
  }
}

export async function fetchFeaturedGames() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/featured-games`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch featured games');
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured games:', error);
    return [];
  }
}

export async function fetchFreeGames() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/free-games`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch free games');
    return await response.json();
  } catch (error) {
    console.error('Error fetching free games:', error);
    return [];
  }
}

export async function fetchTopSellers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/top-sellers`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch top sellers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top sellers:', error);
    return [];
  }
}

export async function fetchBestSellers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/best-sellers`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch best sellers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

export async function fetchTopUpcomingGames() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/upcoming-games`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch upcoming games');
    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
}

export async function fetchResourceLinks() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/resource-link`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) throw new Error('Failed to fetch resource links');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resource links:', error);
    return [];
  }
}
