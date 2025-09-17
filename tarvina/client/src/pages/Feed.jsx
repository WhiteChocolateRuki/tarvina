// Feed.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error("Feed yüklenemedi:", err);
        setPosts([]);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Akış</h1>

      {posts.length === 0 ? (
        <p className="text-center">Henüz yazı yok.</p>
      ) : (
        <div className="post-card grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    
    </div>
    
  );
}
