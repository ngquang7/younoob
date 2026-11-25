import { useAuth } from '../../utils/AuthContext';

export default function UserProfile () {
    const {user} = useAuth();
    const avatarSrc = user?.avatarUrl || '/public/unk.png';
    const username = user ? user.username : 'unknown';
    const description = user ? 'View channel' : 'not login yet';
    return (
        <div className="flex items-start gap-3 ml-4 mt-3">
                <img
                    src={avatarSrc}
                    alt={username}
                    className="w-35 h-35 rounded-full object-cover border border-[#303030]"
                />

            <div className="flex flex-col items-top">
                <h1 className="text-4xl font-bold text-white">{username}</h1>
                <p className="text-gray-400 text-sm mt-3">
                    <span className="font-bold text-white">@{username}</span> • {description}
                </p>
                <div className="flex items-center gap-3 text-l text-gray-200 mb-1 w-fit">
                    <p className="text-gray-400 text-sm mt-3 items-start">
                        {user ? 'Welcome to your channel' : 'not login yet'}
                    </p>
                </div>

            </div>
        </div>
    );
}