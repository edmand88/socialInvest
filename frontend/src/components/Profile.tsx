import React, { useState, useEffect } from 'react';
import { User } from '../types'; 
import { User as UserIcon, TrendingUp, Mail, Users, Edit2, X, Check, Search, Plus, Trash2, RefreshCw } from 'lucide-react';
import { editName, editEmail } from '../services/auth';
import { getWatchlist, removeFromWatchlist, getWatchlistPrices } from '../services/watchlist';

interface ProfileProps {
    user: User | null;
}

function Profile(props: ProfileProps) {
    const { user } = props;
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.full_name || '');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [prices, setPrices] = useState<Record<string, number | string>>({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editWatchlist, setEditWatchlist] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{symbol: string, name: string}[]>([]);

    const syncMarketData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setIsRefreshing(true);
        try {
            const stocks = await getWatchlist(token);
            setWatchlist(stocks);
            const priceData = await getWatchlistPrices(token);
            setPrices(priceData);
        } catch (err) {
            console.error("Sync failed", err);
        } finally {
            setTimeout(() => setIsRefreshing(false), 600);
        }
    };

    useEffect(() => { syncMarketData(); }, []);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`http://localhost:8000/stocks/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data);
            } catch (err) { console.error('Search failed', err); }
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const handleSaveName = async () => {
        const token = localStorage.getItem('token');
        if (token && newName) {
            await editName(token, newName);
            setIsEditingName(false);
            window.location.reload(); 
        }
    };

    const handleSaveEmail = async () => {
        const token = localStorage.getItem('token');
        if (token && newEmail) {
            await editEmail(token, newEmail);
            setIsEditingEmail(false);
            window.location.reload(); 
        }
    };

    const handleAddTicker = async (ticker: string) => {
        const token = localStorage.getItem('token');
        if (!token || watchlist.includes(ticker)) return;
        await fetch(`http://localhost:8000/watchlist/${ticker}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        setSearchQuery('');
        setSearchResults([]);
        syncMarketData();
    };

    const handleRemoveTicker = async (ticker: string) => {
        const token = localStorage.getItem('token');
        if (token) {
            await removeFromWatchlist(token, ticker);
            syncMarketData();
        }
    };

    if (!user) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</h2>;

    return (
        <div style={containerStyle}>
            <div style={{...baseCardStyle, borderTop: '5px solid #007bff'}}> 
                <div style={titleWrapperStyle}>
                    <UserIcon size={20} color="#007bff" />
                    <h3 style={{...headerStyle, color: '#007bff'}}>Account Details</h3>
                </div>

                <div style={infoRowStyle}>
                    <UserIcon size={16} color="#666" /> 
                    {isEditingName ? (
                        <div style={editContainerStyle}>
                            <input value={newName} onChange={(e) => setNewName(e.target.value)} style={editInputStyle}/>
                            <button onClick={handleSaveName} style={iconSuccessButtonStyle}><Check size={14}/></button>
                            <button onClick={() => setIsEditingName(false)} style={iconCancelButtonStyle}><X size={14}/></button>
                        </div>
                    ) : (
                        <span style={rowContentStyle}>
                            <span><strong>Name:</strong> {user.full_name || 'Not set'}</span>
                            <button onClick={() => setIsEditingName(true)} style={betterEditButtonStyle}>
                                <Edit2 size={12} style={{marginRight: '4px'}}/> Edit
                            </button>
                        </span>
                    )}
                </div>
                
                <div style={infoRowStyle}>
                    <UserIcon size={16} color="#666" />
                    <span><strong>Username:</strong> {user.username}</span>
                </div>

                <div style={infoRowStyle}>
                    <Mail size={16} color="#666" />
                    {isEditingEmail ? (
                        <div style={editContainerStyle}>
                            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={editInputStyle}/>
                            <button onClick={handleSaveEmail} style={iconSuccessButtonStyle}><Check size={14}/></button>
                            <button onClick={() => setIsEditingEmail(false)} style={iconCancelButtonStyle}><X size={14}/></button>
                        </div>
                    ) : (
                        <span style={rowContentStyle}>
                            <span><strong>Email:</strong> {user.email}</span>
                            <button onClick={() => setIsEditingEmail(true)} style={betterEditButtonStyle}>
                                <Edit2 size={12} style={{marginRight: '4px'}}/> Edit
                            </button>
                        </span>
                    )}
                </div>
            </div>

            <div style={{...baseCardStyle, borderTop: '5px solid #28a745', position: 'relative', overflow: 'visible'}}>
                <div style={titleWrapperStyle}>
                    <TrendingUp size={20} color="#28a745" />
                    <h3 style={{...headerStyle, color: '#28a745'}}>Watchlist</h3>
                    <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
                        <RefreshCw 
                            size={16} 
                            color="#666" 
                            style={{ cursor: 'pointer', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} 
                            onClick={syncMarketData}
                        />
                        <button onClick={() => setEditWatchlist(!editWatchlist)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                           {editWatchlist ? <Check size={16} color="#28a745" /> : <Edit2 size={16} color="#666" />}
                        </button>
                    </div>
                </div>

                <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <div style={searchBoxStyle}>
                        <Search size={16} color="#999" />
                        <input 
                            placeholder="Search 12,000+ tickers..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            style={searchFieldStyle}
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div style={dropdownStyle}>
                            {searchResults.map(s => (
                                <div key={s.symbol} style={dropdownItemStyle} onClick={() => handleAddTicker(s.symbol)}>
                                    <div>
                                        <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{s.symbol}</div>
                                        <div style={{fontSize: '0.7rem', color: '#666'}}>{s.name}</div>
                                    </div>
                                    <Plus size={14} color="#28a745" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={stockListStyle}>
                    {watchlist.map((ticker) => {
                        const price = prices[ticker];
                        return (
                            <div key={ticker} style={stockItemStyle}>
                                <span style={tickerStyle}>{ticker}</span>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <span style={pricePlaceholderStyle}>
                                        {price ? `$${price}` : 'Live'}
                                    </span>
                                    {editWatchlist && (
                                        <button onClick={() => handleRemoveTicker(ticker)} style={{background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer'}}>
                                            <Trash2 size={14}/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{...baseCardStyle, borderTop: '5px solid black'}}> 
                <div style={titleWrapperStyle}>
                    <Users size={20} color="black" />
                    <h3 style={{...headerStyle, color: 'black'}}>Friends</h3>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>No friends added yet.</p>
            </div>

            <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
        </div>
    );
}

const betterEditButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    color: '#007bff',
    border: '1px solid #d0e2ff',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
};

const iconSuccessButtonStyle = {
    backgroundColor: '#e6fffa',
    color: '#28a745',
    border: '1px solid #b2f5ea',
    borderRadius: '4px',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
};

const iconCancelButtonStyle = {
    backgroundColor: '#fff5f5',
    color: '#dc3545',
    border: '1px solid #fed7d7',
    borderRadius: '4px',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
};

const editContainerStyle = { display: 'flex', gap: '8px', alignItems: 'center' };
const rowContentStyle = { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' };

const containerStyle = {
    display: 'flex',
    gap: '24px', 
    padding: '30px',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-start'
};

const baseCardStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    minWidth: '300px',
    flex: 1,
    display: 'flex', 
    flexDirection: 'column' as const,
    gap: '12px',
    height: 'fit-content'
};

const titleWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
};

const headerStyle = {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 'bold' as const
};

const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 0',
    color: '#444',
    borderBottom: '1px solid #f9f9f9'
};

const editInputStyle = {
    padding: '5px 8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    outline: 'none',
    width: '150px'
};

const stockListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px'
};

const stockItemStyle = {
    padding: '15px',
    borderRadius: '10px',
    backgroundColor: '#f8fff9',
    border: '1px solid #e0f2e5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const tickerStyle = { fontWeight: '800' as const, color: '#2d3436' };
const pricePlaceholderStyle = { color: '#28a745', fontSize: '0.85rem', fontWeight: 'bold' as const };

const searchBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: '#f5f7f9', borderRadius: '10px', border: '1px solid #eee' };
const searchFieldStyle = { border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' };
const dropdownStyle = { position: 'absolute' as const, top: '100%', left: 0, right: 0, backgroundColor: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', borderRadius: '10px', zIndex: 1000, marginTop: '5px', border: '1px solid #eee', overflow: 'hidden' };
const dropdownItemStyle = { padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' };

export default Profile;