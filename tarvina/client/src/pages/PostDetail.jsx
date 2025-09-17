// src/pages/PostDetail.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data)).catch((err) => {
      console.error("Post detay alınamadı:", err);
      setPost(null);
    });
  }, [id]);

  if (!post) return <p className="text-center mt-10">Yükleniyor...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        Yazar: {post.authorId?.name || "Bilinmiyor"} —{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full rounded-lg mb-6"
        />
      )}

      <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
