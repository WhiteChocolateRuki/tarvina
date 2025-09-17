import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const contentExcerpt =
    post.content.length > 300
      ? post.content.substring(0, 300) + "..."
      : post.content;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* Görsel (opsiyonel) */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Başlık ve Rozetler */}
        <div className="flex items-center mb-3">
          <h3 className="text-xl font-bold text-gray-900 mr-2">{post.title}</h3>

          {post.isWinner && (
            <span className="px-2 py-1 text-xs bg-yellow-400 text-black rounded-full">
              🏆 Kazanan
            </span>
          )}
          {post.badge && (
            <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
              {post.badge}
            </span>
          )}
        </div>

        {/* İçerik */}
        <p className="text-gray-700 mb-4">{contentExcerpt}</p>

        {/* Yazar + Tarih */}
        <div className="text-sm text-gray-500 mb-4">
          {post.authorId?.name ? (
            <span className="block font-medium">Yazar: {post.authorId.name}</span>
          ) : (
            <span className="block font-medium">Yazar: Bilinmiyor</span>
          )}
          <span className="block">
            Tarih: {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Devamını Oku */}
        <Link 
          to={`/posts/${post._id}`} 
          className="read-more-link w-full mt-auto"
        >
          Devamını Oku
        </Link>

      </div>
    </div>
  );
}
