# Yerel-only veri saklama

Tüm kullanıcı verileri cihazda saklanır: kaza borcu ve kayıtlar SQLite'ta, ayarlar AsyncStorage'da, PIN SecureStore'da. Bulut yedekleme, senkronizasyon veya uzaktan veri toplama planlanmıyor.

Bu karar bilinçli bir tercihtir: kaza namazı borcu kişisel ve hassas bir dini veridir; kullanıcının cihazından çıkmaması güven ve gizlilik açısından doğru varsayılandır. Ayrıca tek kullanıcılı bir uygulama olarak senkronizasyon maliyeti ve karmaşıklığı gereksizdir.
