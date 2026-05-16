interface UserCardProps {
  username: string;
  avatar?: string;
  nickname: string;
  bio?: string;
  college?: string;
  major?: string;
  articleCount?: number;
  followerCount?: number;
  followingCount?: number;
}

export default function UserCard({
  username,
  avatar,
  nickname,
  bio,
  college,
  major,
  articleCount = 0,
  followerCount = 0,
  followingCount = 0,
}: UserCardProps) {
  return (
    <div className="surface rounded-2xl overflow-hidden noise">
      <div className="h-24 bg-gradient-to-br from-primary/12 via-primary/6 to-accent/12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-100/20" />
      </div>

      <div className="px-5 pb-5">
        <div className="avatar placeholder -mt-10 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-content shadow-lg shadow-primary/15 ring-3 ring-base-100 flex items-center justify-center">
            <span className="text-2xl font-bold">{nickname?.[0] || '?'}</span>
          </div>
        </div>

        <h2 className="text-lg font-bold tracking-tight">{nickname}</h2>
        <p className="text-xs text-base-content/40 font-medium">@{username}</p>

        {bio && (
          <p className="text-[13px] mt-2.5 text-base-content/55 surface-soft rounded-xl px-3.5 py-2.5 leading-relaxed">
            {bio}
          </p>
        )}

        {(college || major) && (
          <div className="mt-3 space-y-1.5 text-[13px] text-base-content/50">
            {college && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{college}</span>
              </div>
            )}
            {major && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{major}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="surface-soft rounded-xl py-3 text-center">
            <p className="font-bold text-base gradient-text">{articleCount}</p>
            <p className="text-[10px] text-base-content/30 mt-0.5 font-medium">文章</p>
          </div>
          <div className="surface-soft rounded-xl py-3 text-center">
            <p className="font-bold text-base gradient-text">{followingCount}</p>
            <p className="text-[10px] text-base-content/30 mt-0.5 font-medium">关注</p>
          </div>
          <div className="surface-soft rounded-xl py-3 text-center">
            <p className="font-bold text-base gradient-text">{followerCount}</p>
            <p className="text-[10px] text-base-content/30 mt-0.5 font-medium">粉丝</p>
          </div>
        </div>
      </div>
    </div>
  );
}
