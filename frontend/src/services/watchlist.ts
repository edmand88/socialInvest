const API_URL = "http://localhost:8000";

export const getWatchlist = async (token: string): Promise<string[]> => {
    const res = await fetch(`${API_URL}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
};

export const addToWatchlist = async (token: string, ticker: string) => {
    await fetch(`${API_URL}/watchlist/${ticker}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const removeFromWatchlist = async (token: string, ticker: string) => {
    await fetch(`${API_URL}/watchlist/${ticker}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getWatchlistPrices = async (token: string) => {
    const res = await fetch(`${API_URL}/watchlist/prices`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
};