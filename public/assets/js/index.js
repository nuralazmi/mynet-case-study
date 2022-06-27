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
            if (document.querySelector('#person_id').value !== '') {
                let formData = new FormData(form);
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                fetch('person/' + document.querySelector('#person_id').value, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json, text-plain, */*",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": csrfToken
                    },
                    body: JSON.stringify(Object.fromEntries(formData.entries()))
                })
                    .then(response => response.json())
                    .then(data => {
                        if (typeof data === "object" && data.hasOwnProperty('ok') && data.ok === true) {
                            changeTrTag(data.datas);
                            removeForm();
                        }
                    });
            } else {
                console.log('kayıt isteği atılacak');
                let formData = new FormData(form);
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                fetch('person', {
                    method: 'POST',
                    headers: {
                        "X-CSRF-TOKEN": csrfToken
                    },
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (typeof data === "object" && data.hasOwnProperty('ok') && data.ok === true) {

                            //yeni kayıt ise "tr" etiketi oluşturulacak.
                            addTrTag(data.datas);
                        }
                    });
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
            document.querySelector('#person_id').value = person_id;
            /*
            Güncelle butonuna tıklanıldığında ilgili kişinin verileri için backend e istek atılacak.
            */
            fetch('person/' + person_id)
                .then(response => response.json())
                .then(data => {
                    if (typeof data === "object" && data.hasOwnProperty('ok') && data.ok === true) {
                        setForm(data.datas);
                    }
                });
        }
    });

    //Sil butonuna tıklanıldığında backend e istek atılacak. İşlem başarılı ise tablodan ilgili satır silinecek.
    document.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            let trElement = btn.parentElement.closest('tr');
            let person_id = trElement.getAttribute('data-person');

            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            fetch('person/' + person_id, {
                method: 'DELETE',
                credentials: "same-origin",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (typeof data === "object" && data.hasOwnProperty('ok') && data.ok) {
                        btn.parentElement.closest('tr').remove();
                        paginationRefresh('delete');
                    }
                });

            //işlem başarılı ise tablodan ilgili satır silinecek

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


    //Sayfalama işlemi
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('item') && e.target.parentElement.classList.contains('pagination')) {
            let number = parseInt(e.target.getAttribute('data-page'));

            //Tıklanılan sayfayı active yap
            document.querySelectorAll('.pagination .item').forEach(function (item) {
                item.classList.remove('active');
            });
            e.target.classList.add('active');


            //Tüm sayfaları gizle
            document.querySelectorAll('.list .content table tbody tr').forEach(function (tr) {
                tr.classList.add('hidden');
            });

            //İlgili sayfayı göster
            let start = number <= 1 ? 1 : (number * 5) - 4;
            let end = number <= 1 ? 6 : start + 5;
            for (let i = start; i < end; i++) {
                if (document.querySelector('tr[data-number="' + i + '"]')) {
                    document.querySelector('tr[data-number="' + i + '"]').classList.remove('hidden');
                }
            }
        }
    });


    //Ülke değişim sonrası şehir listesinin getirilmesi
    document.querySelector('#country').addEventListener('change', function (e) {
        let value = e.target.value;
        document.querySelectorAll('.city-select-item').forEach(function (e) {
            e.remove();
        });
        fetch('cities/' + value)
            .then(response => response.json())
            .then(data => {
                if (typeof data === "object" && data.hasOwnProperty('ok') && data.ok === true) {
                    let citySelectElement = document.querySelector('#city');
                    let selectedCity = citySelectElement.getAttribute('selected-value');
                    let clone = document.querySelector('.city-clone-element').cloneNode(true);
                    clone.classList.remove('city-clone-element');
                    clone.classList.remove('hidden');
                    clone.classList.add('city-select-item');
                    data.datas.forEach(function (item, index) {
                        clone.value = item.id;
                        clone.innerText = item.name;

                        if (item.id === parseInt(selectedCity)) clone.setAttribute('selected', 'selected');
                        else clone.removeAttribute('selected');
                        document.querySelector('#city').insertAdjacentHTML('afterbegin', clone.outerHTML);
                    });
                }
            });
    });


    function changeTrTag(person_detail) {
        if (typeof person_detail === "object") {
            let trElement = document.querySelector('tr[data-person="' + person_detail.id + '"]');
            if (trElement) {
                trElement.querySelector('td.name').innerText = person_detail.name;
                trElement.querySelector('td.date').innerText = dateFormString(person_detail.birthday);
                trElement.querySelector('td.gender').innerText = person_detail.gender === 0 ? 'Erkek' : 'Kadın';
                trElement.querySelector('.address_detail span.address').innerText = person_detail.address.address;
                trElement.querySelector('.address_detail .tooltip-box span.country').innerText = person_detail.address.city.country.name;
                trElement.querySelector('.address_detail .tooltip-box span.city').innerText = person_detail.address.city.name;
                trElement.querySelector('.address_detail .tooltip-box span.post_code').innerText = person_detail.address.post_code;
            }
        }
    }

    function addTrTag(person_detail) {
        if (typeof person_detail === "object") {
            if (document.querySelector('.clone-element')) {
                let clone = document.querySelector('.clone-element').cloneNode(true);
                clone.classList.add('hidden');
                clone.classList.remove('clone-element');
                let countTr = document.querySelectorAll('.list .content table tbody tr').length;
                clone.setAttribute('data-number', countTr.toString());
                clone.setAttribute('data-person', person_detail.id);
                clone.querySelector('.name').innerText = person_detail.name;
                clone.querySelector('th').innerText = countTr.toString();
                clone.querySelector('.gender').innerText = person_detail.gender === 0 ? 'Erkek' : 'Kadın';
                clone.querySelector('.date').innerText = dateFormString(person_detail.birthday);
                clone.querySelector('.address_detail span.address').innerText = person_detail.address.address;
                clone.querySelector('.address_detail .tooltip-box span.country').innerText = person_detail.address.city.country.name;
                clone.querySelector('.address_detail .tooltip-box span.city').innerText = person_detail.address.city.name;
                clone.querySelector('.address_detail .tooltip-box span.post_code').innerText = person_detail.address.post_code;
                document.querySelector('.list .content table tbody').insertAdjacentHTML('beforeend', clone.outerHTML);


                paginationRefresh('add', clone);
                document.querySelector('form.form').classList.remove('validate');
                removeForm();

            }
        }
    }

    function setForm(person_detail) {
        document.querySelector('.create .header.add').classList.add('hidden');
        document.querySelector('.create .header.update').classList.add('visible');
        document.querySelector('.create .header.update').classList.remove('hidden');
        document.querySelector('.create .new-add').classList.remove('hidden');
        document.querySelector('.create .new-add').classList.add('visible');

        document.querySelector('#name').value = person_detail.name;
        document.querySelector('#date').value = dateFormString(person_detail.birthday);
        document.querySelector('#gender').value = person_detail.gender;
        document.querySelector('#city').setAttribute('selected-value', person_detail.address.city.id);
        document.querySelector('#country').value = person_detail.address.city.country.id;
        document.querySelector('#country').dispatchEvent(new Event('change'));
        document.querySelector('#post_code').value = person_detail.address.post_code;
        document.querySelector('#address').value = person_detail.address.address;
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

    function dateFormString(string) {
        let date = new Date(string.toString());
        return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1) + '/' + date.getFullYear();
    }

    function addZero(number) {
        return parseInt(number) > 0 && parseInt(number) <= 9 ? '0' + number : number;
    }

    function paginationRefresh(type, clone = null) {

        //Son sayfadaki satır sayısı
        let countLine = 0;
        document.querySelectorAll('tbody tr').forEach(function (e) {
            if (!e.classList.contains('hidden') && !e.classList.contains('clone-element')) countLine++;
        });

        if (type === 'add' && clone !== null) {
            /*
            Eğer yeni bir kayıt eklenmişse ve son sayfada 5 eleman varsa yeni sayfa açılacak(Her sayfada 5 satır gösterilmektedir).
             */
            let endPage = document.querySelectorAll('.pagination .item').length;
            if (countLine === 5) {
                let clonePagination = document.querySelectorAll('.pagination .item')[0].cloneNode(true);
                clonePagination.setAttribute('data-page', endPage + 1);
                clonePagination.innerText = (endPage + 1).toString();
                document.querySelector('.pagination').insertAdjacentHTML('beforeend', clonePagination.outerHTML);
                document.querySelector('.pagination .item[data-page="' + (endPage + 1) + '"]').click();
            } else document.querySelector('.pagination .item[data-page="' + endPage + '"]').click();
        } else if (type === 'delete') {
            /*
            Satırı silme işlemi sonrasında eğer ilgili sayfadan sonra da sayfalar var ise bir sonraki sayfanın
            birinci satırı aktif olan sayfaya ekle.
            Eğer aktif olan sayfadaki son eleman silinmişse aktif olan sayfayı sil, sayfalamadan ilgili numarayı kaldır.
             */

            //Veri silindikten sonra tüm tabloyu dolaş ve numaralarını sıralı yap
            document.querySelectorAll('tbody tr').forEach(function (e, key) {
                if (!e.classList.contains('clone-element')) {
                    e.querySelector('th').innerText = key.toString();
                    e.setAttribute('data-number', key.toString());
                }
            });

            let activePage = document.querySelector('.pagination .item.active');
            if (activePage) {
                activePage.click();
                activePage = parseInt(activePage.getAttribute('data-page'));
            }

            //Boş sayfaları kalan numaraları(sayfalama) sil
            let controlNumber = 0;
            document.querySelectorAll('.pagination .item').forEach(function (item, key) {
                controlNumber = key + 1;
                controlNumber = controlNumber === 1 ? 1 : (controlNumber * 5) - 4;
                if (!document.querySelector('tr[data-number="' + controlNumber + '"]')) item.remove();
            });
        }
    }

    function tableRefresh() {

    }

});
