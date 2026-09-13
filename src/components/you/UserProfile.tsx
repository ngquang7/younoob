interface UserProfileProps {
    username: string;
    userId: string;
    avatar?: string;
}

export default function UserProfile({ 
    username, 
    userId, 
    avatar
}: UserProfileProps) {
    return (
        <div className="flex items-start gap-3 ml-4 mt-3">
            {avatar ? (
                <img 
                    src={avatar} 
                    alt={username} 
                    className="w-35 h-35 rounded-full object-cover border border-[#303030]" 
                />
            ) : (
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white shadow-md">
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
            )}
            <div className="flex flex-col items-top">
                <h1 className="text-4xl font-bold text-white">{username}</h1>
                <p className="text-gray-400 text-sm mt-3">
                    <span className="font-bold text-white">@{userId}</span> • View channel
                </p>
                <div className="flex items-center gap-3 text-l text-gray-200 mb-1 w-fit">
                    <p className="text-gray-400 text-sm mt-3 items-start">
                        Mr. Quang
                    </p>
                </div> 

            </div>
        </div>
    );
}