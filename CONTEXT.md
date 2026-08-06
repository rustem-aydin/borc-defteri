# Borç Defteri — Kaza Namazı Takibi

Bireysel bir Müslümanın kaza namazı borcunu hesaplayıp takip ettiği mobil uygulama. Kullanıcı geçmişte kılmadığı namazları hesaplar, sonra her kıldığı kaza namazında borç düşer.

## Language

**Kaza borcu**:
Kullanıcının geçmişte vaktinde kılmadığı ve şimdi telafi etmesi gereken namaz sayısı. Altı vakit için ayrı ayrı takip edilir.
_Avoid_: debt, balance, score

**Vakit**:
Bir namaz vakti. Altı tanedir: sabah, öğle, ikindi, akşam, yatsı, vitr. Uygulamanın temel kategorisi.
_Avoid_: prayer time, slot, period

**Kaza kaydı**:
Kullanıcının bir vakit kaza namazı kıldığını işaretlediği tekil olay. Borcu bir azaltır.
_Avoid_: log entry, transaction, event

**Hesaplama yöntemi**:
Kaza borcunu belirlemenin giriş yolu. İki yöntem vardır — otomatik (doğum tarihi, ergenlik yaşı, cinsiyet, hayz/nifas muafiyeti üzerinden hesap) ve manuel (her vakit için doğrudan sayı girişi). İkisi de aynı kaza borcunu yazar.
_Avoid_: mode, wizard, calculator

**Vitr**:
Hanefi mezhebine göre vacip, diğerlerine göre sünnet olan namaz. Varsayılan olarak kapalıdır; kullanıcı açtığında altıncı vakit olarak borç takibine dahil olur. Kapalıyken borç hesabına dahil edilmez.
_Avoid_: witr prayer, optional prayer

**Hedef**:
Kullanıcının kendine koyduğu günlük veya haftalık kaza kılma sayısı. Sadece görsel ilerleme göstergesidir; bildirim veya hatırlatma tetiklemez.
_Avoid_: goal, quota, streak

**Mezhep**:
İslami fıkhi ekol. Hesaplama her zaman Hanefi kurallarına göre yapılır. Info ekranındaki dört mezhep içeriği (Hanefi, Şafii, Maliki, Hanbeli) yalnızca bilgilendirme amaçlıdır.
_Avoid_: madhab, sect, school

**Dil**:
Uygulama Türkçe ve İngilizce destekler. Kullanıcı ayarlardan dil seçebilir; seçim kalıcıdır ve cihaz dilini geçersiz kılar.
_Avoid_: locale, language pack

**Hatırlatma**:
Kullanıcının belirlediği saatte gönderilen günlük bildirim. Sabit bir mesaj içerir; kalan borç veya hedef ilerlemesi gibi kişiselleştirilmiş veri içermez.
_Avoid_: notification, alert, reminder

**Geri alma**:
Yoktur. Kullanıcı +/− tuşlarına dikkat etmelidir; yanlış kayıt geçmişten silinemez veya düzeltilemez.
_Avoid_: undo, revert, rollback

**Borç sıfırlanması**:
Tüm vakitlerde kaza borcu sıfıra ulaştığında uygulama boş durum gösterir. Kullanıcı istediğinde tekrar borç ekleyebilir; döngü kapanmaz.
_Avoid_: completion, done state

**PIN koruması**:
Uygulama açılışında tüm ekranları kilitler. Sıfırlama mekanizması yoktur; PIN unutulursa uygulama verileri silinip yeniden kurulmalıdır.
_Avoid_: passcode, lock screen

**Tema**:
Kullanıcı açık, koyu veya sistem teması seçebilir. Sistem seçiliyse cihaz tema değişikliği anında yansır.
_Avoid_: dark mode, appearance
