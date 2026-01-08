import React from 'react';
import { User } from '../types'; 

interface ProfileProps {
    user: User | null;
}

function Profile(props: ProfileProps) {
    const user = props.user;

    if (user){
        return (
            <div> 
                <h2> {user.username} </h2>
                <h2> {user.email} </h2>
                <h2> {user.points} </h2>
            </div>
        )
    }

    return <h2>Loading profile...</h2>;
}

export default Profile;