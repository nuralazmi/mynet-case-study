<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mynet Case Study</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
</head>
<body>
<div class="main-container">
    <div class="page-header">Mynet Case Study</div>
    <div class="page-content">
        <div class="box list">
            <div class="header">Kişilerin Listesi</div>
            <div class="content">
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>İsim</th>
                        <th>Doğum Tarihi</th>
                        <th>Cinsiyet</th>
                        <th>Adres</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr data-number="11" data-person="10">
                        <th scope="row">0</th>
                        <td class="name">Azmi</td>
                        <td class="date">18/05/1995</td>
                        <td class="age">Erkek</td>
                        <td class="address">Maltepe/Istanbul</td>
                        <td>
                            <button class="btn btn-update" data-number="11" data-person="10">Güncelle</button>
                        </td>
                        <td>
                            <button class="btn btn-delete" data-number="11">Sil</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="box create">
            <div class="header add">Yeni Kişi Ekleme</div>
            <div class="header update hidden">Kişi Güncelle</div>
            <div class="new-add hidden">Yeni kayıt ekranına geç</div>
            <div class="content">
                <form class="form" onsubmit="return false;" novalidate>
                    <input type="hidden" name="person_id" id="person_id" value="">
                    <div class="form-container">
                        <div class="input-row">
                            <label for="name">İsim</label>
                            <input type="text" required id="name" class="input" autocomplete="off">
                        </div>
                        <div class="input-row">
                            <label for="date">Doğum Tarihi <small>(GG/AA/YYYY)</small></label>
                            <input type="text" pattern="[0-9]{2}/[0-9]{2}/[1-9]{1}[0-9]{3}"
                                   id="date" required class="input" autocomplete="off">
                        </div>
                        <div class="input-row">
                            <label for="age">Cinsiyet</label>
                            <select name="age" id="age" required class="input">
                                <option value="0">Erkek</option>
                                <option value="1">Kadın</option>
                            </select>
                        </div>
                        <div class="input-row">
                            <label for="adress">Adres</label>
                            <textarea minlength="15" name="adress" required id="adress" class="input"
                                      rows="3"></textarea>
                        </div>
                        <div class="input-row">
                            <button type="submit" class="btn btn-save">Kaydet</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="{{ asset('assets/js/index.js') }}"></script>
</body>
</html>
