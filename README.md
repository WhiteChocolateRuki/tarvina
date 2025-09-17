Tarvina Web Mülakat Görevi
Blog Battle 

Proje Hakkında  
Blog Battle, kullanıcıların yazılarını oluşturabildiği ve bu yazıların birbirine karşı yarıştığı bir oylama platformudur.  
Amaç; hem yazarların içerik üretebilmesi hem de okuyucuların oylarıyla en iyi yazıyı seçebilmesidir.  
Sistem, bir eleme turnuvası (bracket)mantığında ilerler.  

Roller  
Yazar (Kayıtlı Kullanıcı)  
- Kayıt olur ve giriş yapar.  
- Profil oluşturur.  
- Blog yazısı ekler (başlık, içerik, kategori).  
- Yazısı oylamaya çıktığında bildirim alır.  

Okuyucu / Ziyaretçi  
- Giriş yapmadan yazıları okuyabilir.  
- Oy verebilmek için giriş yapması gerekir.  
- Oylama sonuçlarını anlık (% oranlı) görebilir.  
- Kazanan yazılar özel işaretle gösterilir.  

Kullanılan Teknolojiler  
-> Frontend (Client)  
- React  
- TailwindCSS  
- Redux Toolkit  
- Vite  

-> Backend (Server)  
- Node.js + Express.js  
- MongoDB (Mongoose ile)  
- JWT (kimlik doğrulama için)  

Kullanım Senaryosu  
1. Kullanıcı kayıt olur veya giriş yapar.  
2. Yazar blog yazısı ekler (başlık, içerik, görsel, kategori).  
3. Sistem yazıyı başka bir yazıyla eşleştirir.  
4. Okuyucular oy kullanır.  
5. Oy verme sonrası yüzdesel sonuçlar ekrana yansır.  
6. Kazanan yazı üst tura taşınır.  

Proje Özellikleri  
- Kullanıcı kayıt/giriş sistemi (JWT).  
- Blog CRUD (oluşturma, güncelleme, silme).  
- Rastgele veya kategoriye göre eşleşme mantığı.  
- Oylama sistemi (her kullanıcı bir eşleşmeye yalnızca 1 kez oy verebilir ve oyunu düzenleyebilir).  
- Oylama sonuçlarının anlık % oranıyla gösterilmesi.  
- Kazanan yazıların özel işaretle belirtilmesi.  


Not  
Bu proje, sistem mimarisi, kullanıcı deneyimi, veri akışı ve eşleşme algoritmaları üzerine geliştirilmiştir.  
Kullanıcı dostu arayüz ve güvenli kimlik doğrulama yöntemleri gözetilmiştir. İstenilen görevlerin tamamını bu kısa süre zarfında karşılayamasa da projenin büyük bir kısmı bitmiştir.
