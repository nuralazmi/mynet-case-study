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
                age: convertToString('age', 1),
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
    /*
    Güncelle butonuna tıklanıldığında form otomatik doldurulacak.
    Yeni satır ekleneceği için sonra eklenen butonlar olacaktır. Onları da yakalayabilmek için
    elementin kendisi değil de document dinleniyor.
     */
    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('btn-update')) {
            let btn = e.target;
            let trElement = btn.parentElement.closest('tr');
            let person_id = trElement.getAttribute('data-person');
            /*
            Güncelle butonuna tıklanıldığında ilgili kişinin verileri için backend e istek atılacak.
            */
            console.log(person_id, 'detayları için istek atılacak');

            //işlem başarılı ise ilgili person için veriler
            let person_detail = {
                person_id,
                name: 'Azmi 2',
                date: '18/05/1995',
                age: 1,
                address: 'Maltepe/İstanbul XYZ Mahallesi'
            }

            setForm(person_detail);
        }
    });

    //Sil butonuna tıklanıldığında backend e istek atılacak. İşlem başarılı ise tablodan ilgili satır silinecek.
    document.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            let person_id = btn.getAttribute('data-person');
            console.log(person_id, 'detayları için istek atılacak');

            //işlem başarılı ise tablodan ilgili satır silinecek
            btn.parentElement.closest('tr').remove();
            //Eğer güncelleme sayfası açıksa kapatılacak.
            if (document.querySelector('#person_id').value !== '') {
                removeForm();
            }
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
        if (typeof person_detail === "object") {
            let trElement = document.querySelector('tr[data-person="' + person_detail.person_id + '"]');
            if (trElement) {
                Object.entries(person_detail).forEach(([key, value]) => {
                    if (trElement.querySelector('.' + key))
                        trElement.querySelector('.' + key).innerText = value;
                });
            }
        }
    }

    function addTrTag(person_detail) {
        if (typeof person_detail === "object") {
            if (document.querySelector('.clone-element')) {
                let clone = document.querySelector('.clone-element').cloneNode(true);
                clone.classList.remove('hidden');
                clone.classList.remove('clone-element');
                let countTr = document.querySelectorAll('.list .content table tbody tr').length;
                clone.setAttribute('data-number', countTr + 1);
                clone.setAttribute('data-person', person_detail.person_id);
                Object.entries(person_detail).forEach(([key, value]) => {
                    if (clone.querySelector('.' + key)) clone.querySelector('.' + key).innerText = value;
                });
                document.querySelector('.list .content table tbody').insertAdjacentHTML('beforeend', clone.outerHTML);
            }
        }
    }

    function setForm(person_detail) {
        document.querySelector('.create .header.add').classList.add('hidden');
        document.querySelector('.create .header.update').classList.add('visible');
        document.querySelector('.create .header.update').classList.remove('hidden');
        document.querySelector('.create .new-add').classList.remove('hidden');
        document.querySelector('.create .new-add').classList.add('visible');
        if (typeof person_detail === "object") {
            let element = false;
            Object.entries(person_detail).forEach(([key, value]) => {
                element = document.querySelector('#' + key);
                if (element) element.value = value;
            });
        }
    }

    function removeForm() {
        document.querySelector('.create .header.add').classList.add('visible');
        document.querySelector('.create .header.add').classList.remove('hidden');
        document.querySelector('.create .header.update').classList.add('hidden');
        document.querySelector('.create .header.update').classList.remove('visible');
        document.querySelector('.create .new-add').classList.remove('visible');
        document.querySelector('.create .new-add').classList.add('hidden');

        let inputs = document.querySelector('form.form').elements;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].nodeName === "INPUT" || inputs[i].nodeName === "TEXTAREA") inputs[i].value = '';
            else if (inputs[i].nodeName === "SELECT") inputs[i].value = 0;
        }
    }

    function convertToString(key, value) {
        if (key === 'age' && !isNaN(value)) return value === 0 ? 'Erkek' : 'Kadın';
        return value;
    }
});
