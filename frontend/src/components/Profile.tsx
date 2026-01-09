import React from 'react';
import { User } from '../types'; 
import { User as UserIcon, TrendingUp, Mail, Users } from 'lucide-react';

interface ProfileProps {
    user: User | null;
}

function Profile(props: ProfileProps) {
    const user = props.user;

    if (user) {
        return (
            <div style={containerStyle}>
                <div style={{...baseCardStyle, borderTop: '5px solid #007bff'}}> 
                    <div style={titleWrapperStyle}>
                        <UserIcon size={20} color="#007bff" />
                        <h3 style={{...headerStyle, color: '#007bff'}}>Account Details</h3>
                    </div>

                    <div style={infoRowStyle}>
                        <UserIcon size={16} color="#666" /> 
                        <span><strong>Name:</strong> {user.full_name}</span>
                    </div>
                    
                    <div style={infoRowStyle}>
                        <UserIcon size={16} color="#666" />
                        <span><strong>Username:</strong> {user.username}</span>
                    </div>
                    <div style={infoRowStyle}>
                        <Mail size={16} color="#666" />
                        <span><strong>Email:</strong> {user.email}</span>
                    </div>
                </div>

                <div style={{...baseCardStyle, flex: 2, borderTop: '5px solid #28a745'}}>
                    <div style={titleWrapperStyle}>
                        <TrendingUp size={20} color="#28a745" />
                        <h3 style={{...headerStyle, color: '#28a745'}}>Watchlist</h3>
                    </div>

                    <div style={stockListStyle}>
                        {['AAPL', 'TSLA', 'NVDA'].map((ticker) => (
                            <div key={ticker} style={stockItemStyle}>
                                <span style={tickerStyle}>{ticker}</span>
                                <span style={pricePlaceholderStyle}>+2.4%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{...baseCardStyle, borderTop: '5px solid black'}}> 
                    <div style={titleWrapperStyle}>
                        <Users size={20} color="black" />
                        <h3 style={{...headerStyle, color: 'black'}}>Friends</h3>
                    </div>
                </div>
            </div>
        )
    }

    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</h2>;
}

const containerStyle = {
    display: 'flex',
    gap: '24px', 
    padding: '30px',
    flexWrap: 'wrap' as const
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
    fontWeight: 'bold'
};

const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    color: '#444',
    borderBottom: '1px solid #f9f9f9'
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

const tickerStyle = {
    fontWeight: '800',
    color: '#2d3436'
};

const pricePlaceholderStyle = {
    color: '#28a745',
    fontSize: '0.85rem',
    fontWeight: 'bold'
};

export default Profile;