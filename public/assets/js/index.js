document.addEventListener("DOMContentLoaded", function (event) {

    //Doğum tarihi input alanına mask uygulanacak.
    document.querySelector('#date').addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '' + x[1] + '/' + x[2] + (x[3] ? '/' + x[3] : '');
    });

    //Kaydet butonuna tıklanıldığında form kontrolü yapılacak ve istek atılacak.
    document.querySelector('.btn-save').addEventListener('click', function () {
        let form = document.querySelector('.form');
        form.classList.add('validate');
        if (form.checkValidity()) {
            console.log('kayıt isteği atılacak');

            /*
            İstek başarılı ise tabloyu yenilemek gerekiyor.
            Tüm verileri yeniden backend den alıp sistemi yormamak için eğer güncelleme ise
            tablodaki ilgili satırın içeriğini değiştirmek aynı sonuca götürecektir.
            Yeni kayıt ise tabloya yeni bir "tr" etiketi eklenecektir.
             */

            //Backend den dönen başarılı değer
            let data = {
                person_id: 10,
                name: 'Azmi 2',
                date: '18/05/1995',
                age: 1,
                address: 'Maltepe/İstanbul XYZ Mahallesi'
            }

            //Eğer güncelleme ise person_id ilgili "tr" etiketinin içeriği değiştirilecek.
            if (document.querySelector('#person_id').value !== '') {
                changeTrTag(data);
                removeForm();
                form.classList.remove('validate');
            } else {
                //yeni kayıt ise "tr" etiketi oluşturulacak.
                addTrTag(data);
            }
        }
    });


    //Güncelle butonuna tıklanıldığında form otomatik doldurulacak.
    document.querySelectorAll('.btn-update').forEach(function (btn) {
        /*
        Güncelle butonuna tıklanıldığında ilgili kişinin verileri için backend e istek atılacak.
        Bilgiler veri tabanından değil cache den gelecek veri tabanını yormamak için.
        Bu sebeple verilen doğrudan html deki tablodan da alınabilir ancak cache de veri tabanını yorma
        probleminin önüne geçeceği için veriler backend den alınacak.
         */
        btn.addEventListener('click', function (e) {
            let person_id = btn.getAttribute('data-person'); 
            let element = document.querySelector('tr[data-person="' + person_id + '"]');
            let person_detail = {
                person_id,
                name: element.querySelector('.name').innerText,
                date: element.querySelector('.date').innerText,
                age: element.querySelector('.age').innerText,
                address: element.querySelector('.address').innerText
            };
            setForm(person_detail);
        })
    });


    //Sil butonuna tıklanıldığında backend e istek atılacak. İşlem başarılı ise tablodan ilgili satır silinecek.
    document.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            let person_id = btn.getAttribute('data-person');
            let row_number = btn.getAttribute('data-number');

            console.log('silme isteği atılacak');
            document.querySelector('tr[data-number="' + row_number + '"]').remove();

        })
    });


    /*
    Güncelleme ekranından tekrar yeni kayıt açma ekranına geçmeyi sağlayacak."Yeni kayıt ekranına dön"
    butonunun işlemleri
     */
    document.querySelector('.new-add').addEventListener('click', function () {
        removeForm();
        document.querySelector('.form').classList.remove('validate');
    });

    function changeTrTag(person_detail) {
        let element = document.querySelector('tr[data-person="' + person_detail.person_id + '"]');
        element.querySelector('.name').innerText = person_detail.name;
        element.querySelector('.date').innerText = person_detail.date;
        element.querySelector('.age').innerText = person_detail.age;
        element.querySelector('.address').innerText = person_detail.address;
    }


    function addTrTag(person_detail) {
        let element = document.querySelector('tr[data-person="' + person_detail.person_id + '"]');
        let clone = element.cloneNode(true);
        let countTr = document.querySelectorAll('.list .content table tbody tr').length;
        let age = person_detail.age;
        age = age === 1 || age === 0 ? (age === 1 ? 'Erkek' : 'Kadın') : age;

        clone.setAttribute('data-number', countTr + 1);
        clone.setAttribute('data-person', person_detail.person_id);
        clone.querySelector('.name').innerText = person_detail.name;
        clone.querySelector('.date').innerText = person_detail.date;
        clone.querySelector('.age').innerText = age;
        clone.querySelector('.address').innerText = person_detail.address;
        document.querySelector('.list .content table tbody').insertAdjacentHTML('beforeend', clone.outerHTML);
    }

    function setForm(person_detail) {
        document.querySelector('.create .header.add').classList.add('hidden');
        document.querySelector('.create .header.update').classList.add('visible');
        document.querySelector('.create .header.update').classList.remove('hidden');
        document.querySelector('.create .new-add').classList.remove('hidden');
        document.querySelector('.create .new-add').classList.add('visible');

        let age = person_detail.age.toString().toLowerCase();
        age = age === 'kadın' || age === 'erkek' ? (age === 'erkek' ? 0 : 1) : age;
        document.querySelector('#person_id').value = person_detail.person_id;
        document.querySelector('#name').value = person_detail.name;
        document.querySelector('#date').value = person_detail.date;
        document.querySelector('#age').value = age;
        document.querySelector('#adress').value = person_detail.address;
    }

    function removeForm() {
        document.querySelector('.create .header.add').classList.add('visible');
        document.querySelector('.create .header.add').classList.remove('hidden');
        document.querySelector('.create .header.update').classList.add('hidden');
        document.querySelector('.create .header.update').classList.remove('visible');
        document.querySelector('.create .new-add').classList.remove('visible');
        document.querySelector('.create .new-add').classList.add('hidden');

        document.querySelector('#person_id').value = '';
        document.querySelector('#name').value = '';
        document.querySelector('#date').value = '';
        document.querySelector('#age').value = 0;
        document.querySelector('#adress').value = '';
    }
});
