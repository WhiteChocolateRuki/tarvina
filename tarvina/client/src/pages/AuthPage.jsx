import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../features/authSlice";

export default function AuthPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email: form.email, password: form.password }));
    } else {
      dispatch(register({ name: form.name, email: form.email, password: form.password }));
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-xl shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? "Giriş Yap" : "Kayıt Ol"}</h1>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Adınız"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {isLogin ? "Giriş" : "Kayıt"}
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        {isLogin ? (
          <p>
            Hesabın yok mu?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setIsLogin(false)}
            >
              Kayıt ol
            </button>
          </p>
        ) : (
          <p>
            Hesabın var mı?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Giriş yap
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
