import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, deletePost, updatePost } from "../features/postsSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: allPosts, loading, error } = useSelector((state) => state.posts);
  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    console.log("🔎 user object:", user);
    console.log("🔎 allPosts:", allPosts);
  }, [user, allPosts]);

 
  const userPosts = allPosts.filter((post) => {
    let postAuthorId = null;

    if (typeof post.authorId === "string") {
      postAuthorId = post.authorId; 
    } else if (post.authorId && typeof post.authorId === "object") {
      postAuthorId = post.authorId._id; 
    }

    const userId = user?._id || user?.id;
    return postAuthorId?.toString() === userId?.toString();
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchPosts());
    }
  }, [dispatch, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Yazı eklemek için giriş yapmalısınız.");
      return;
    }

    if (editingId) {
      await dispatch(updatePost({ id: editingId, updates: form }));
      setEditingId(null);
    } else {
      await dispatch(createPost(form));
    }
    setForm({ title: "", content: "", category: "" });

    dispatch(fetchPosts());
  };

  const handleEdit = (post) => {
    const postAuthorId =
      typeof post.authorId === "string" ? post.authorId : post.authorId?._id;

    const userId = user?._id || user?.id;

    if (postAuthorId?.toString() === userId?.toString()) {
      setForm({ title: post.title, content: post.content, category: post.category });
      setEditingId(post._id);
    } else {
      alert("Bu yazıyı düzenleme yetkiniz yok.");
    }
  };

  const handleDelete = (postId, authorId) => {
    const postAuthorId =
      typeof authorId === "string" ? authorId : authorId?._id;

    const userId = user?._id || user?.id;

    if (postAuthorId?.toString() === userId?.toString()) {
      dispatch(deletePost(postId));
      setTimeout(() => {
        dispatch(fetchPosts());
      }, 500);
    } else {
      alert("Bu yazıyı silme yetkiniz yok.");
    }
  };

  if (!token) {
    return <p className="text-center mt-10">Lütfen önce giriş yapın.</p>;
  }

  if (loading && allPosts.length === 0) {
    return <p className="text-center mt-10">Yazılar yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {user && <p className="mb-4 px-4">Hoş geldin, {user?.name || "Yazar"}!</p>}

      <form onSubmit={handleSubmit} className=" post-card space-y-3 mb-6">
        <input
          type="text"
          placeholder="Başlık"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="İçerik"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Güncelle" : "Ekle"}
        </button>
      </form>

      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {userPosts.map((post) => (
    <div key={post._id} className="post-card">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="mb-2">{post.content}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Kategori: {post.category}</span>
        <span>{new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleEdit(post)}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Düzenle
        </button>
        <button
          onClick={() => handleDelete(post._id, post.authorId)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Sil
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}
