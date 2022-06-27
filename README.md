## Başlangıç

Projeyi canlı sunucuda sunamadığım için eğer sizler yerel ortamda çalıştıracaksanız web sunucu yazılımı kurmalısınız. Örnek: Xampp

- Projeyi indirdiğinizde .env dosyasının adı .env.example olarak değişmiş olabilir. Eğer böyleyse dosya adını .env olarak güncellemelisiniz.
- Node bağımlılıklarını kurmak için terminalde proje dizininde "npm install" komutunu çalıştırmalısınız.
- Php bağımlılıklarını kurmak için terminalde proje dizininde "composer install" komutunu çalıştırmalısınız.
- Mysql Veri tabanı oluşturmalısınız. Host:127.0.0.1, Port:3306, Database:mynet_case_study, User:root. Bu bilgileri değiştirmek veya kontrol etmek için .env dosyasını inceleyebilirsiniz.
- Oluşturulan veri tabanına projede ilgili tabloların kurulması için "php artisan migrate" komutunu çalıştırmalısınız.
- Oluşturulan veri tabanı tablolarına fake veri girmek için "php artisan db:seed" komutunu çalıştırmalısınız.
- "php artisan serve" komutunu çalıştırarak projeyi görüntüleyebilirsiniz.

## Algoritma ve Akış

### Client
Tek sayfadan oluşmaktadır(home.blade.php). Sayfa içerisinde kişileri listelendiği tablo ve yeni kayıt veya güncellemenin yapılacağını form alanı mevcuttur.
Güncelleme butonu ile mevcut form otomatik doldurulmaktadır ilgili kişinin bilgileriyle. Güncelleme işlemi başarılı olmuş ise tablodaki ilgili satırın 
sütunları değiştirilmektedir. 
Yeni kayıt yapıldığında tablo yeniden oluşturulmaz veya veri tabanında güncel liste alınmaz. Yeni eklenen kişi, yeni bir "tr" etiketiyle tabloya ilave edilir.
Tablodaki her sayfada 5 satır bulunmaktadır. Eğer yeni eklenen kişi için sayfada yer yoksa tablonun sayfalaması bir attırılır ve yeni kişi diğer sayfada gösterilir.
Kişinin silinme işleminde de veri tabanından güncel veriler alınmadan ilgili "tr" etiketi silinir. Tablo satırları, numaraları ve tablonun sayfalaması
javascript yardımıyla düzenlenir. Veri silindikçe sayfalamanın da düşmesi gerekir.

### Server
Rotalar routes/web.php altındadır. Resource controller yardımıyla rest istekler karşılanmaktadır.
Kişiler, adres tablosuyla, adres tablosu şehir tablosuyla, şehir tablosu ise ülke tablosuyla ilişkilidir. Migration tanımlamasında bu ilişkiler de tanımlanmıştır.
Factory kütüphanesi kullanılarak da modeller birbirine bağlanmıştır. Bu sayede kişiyi/kişileri listelerken relationship kullanarak kişiye ait tüm bu detayları alabilmekteyiz, tek bir model kullanarak.
Veri aldığımız tüm tablolar da cache yapısı kullanılmaktadır. Kurulum gerektirdiği için ve projeyi çalıştırmada engel olabileceği için redis veya memcached kullanmadım. File kullandım.
Ancak bu yapı için redis veya memcached daha sağlıklı olacaktır.
Kişilerin bilgileri güncellendikten sonra veya yeni kişi eklendikten sonra cache silinmektedir.
Cache kullanımı: eğer ilgili key için cache varsa cacheden getir yoksa veri tabanından getir ve getirdikten sonra ilgili key için cache oluştur.

Sormak istediğiniz veya yaşanılan bir sorunda e-posta adresimden bana ulaşabilirsiniz
nuralazmi@gmail.com
