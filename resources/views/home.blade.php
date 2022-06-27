<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
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
                    <tr class="clone-element hidden" data-number="0" data-person="0">
                        <th></th>
                        <td class="name"></td>
                        <td class="date"></td>
                        <td class="gender"></td>
                        <td class="address_detail">
                            <div class="tooltip">
                                <div class="text">Detay</div>
                                <div class="tooltip-box">
                                    <div class="item"><b>Ülke : </b> <span class="country"></span></div>
                                    <div class="item"><b>Şehir : </b> <span class="city"></span></div>
                                    <div class="item"><b>Posta Kodu : </b> <span class="post_code"></span></div>
                                </div>
                            </div>
                            <span class="address"></span>
                        </td>
                        <td class="button">
                            <button class="btn btn-update">Güncelle</button>
                        </td>
                        <td class="button">
                            <button class="btn btn-delete">Sil</button>
                        </td>
                    </tr>
                    @foreach ($persons as $key=>$person)
                        <tr data-number="{{ $key + 1 }}"
                            data-person="{{ $person->id }}"
                            class="{{ $key + 1 > 5 ? 'hidden' : '' }}"
                        >
                            <th>{{ $key + 1 }}</th>
                            <td class="name">{{ $person->name }}</td>
                            <td class="date">{{ date('d/m/Y', strtotime($person->birthday)) }}</td>
                            <td class="gender">{{ $person->gender === 0 ? 'Erkek' : 'Kadın' }}</td>
                            <td class="address_detail">
                                <div class="tooltip">
                                    <div class="text">Detay</div>
                                    <div class="tooltip-box">
                                        <div class="item"><b>Ülke : </b> <span
                                                class="country">{{ $person->address->city->country->name }}</span>
                                        </div>
                                        <div class="item"><b>Şehir : </b> <span
                                                class="city">{{ $person->address->city->name }}</span></div>
                                        <div class="item"><b>Posta Kodu : </b> <span
                                                class="post_code">{{ $person->address->post_code }}</span></div>
                                    </div>
                                </div>
                                <span class="address">
                                    {{ $person->address->address }}
                                </span>
                            </td>
                            <td class="button">
                                <button class="btn btn-update">Güncelle</button>
                            </td>
                            <td class="button">
                                <button class="btn btn-delete">Sil</button>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="pagination">
                    @for($i=1; $i<=ceil((count($persons) / 5)); $i++)
                        <div class="item {{ $i === 1 ? 'active' : '' }}"
                             data-page="{{ $i }}">{{ $i }}</div>
                    @endfor
                </div>
            </div>
        </div>
        <div class="box create">
            <div class="header add">Yeni Kişi Ekleme</div>
            <div class="header update hidden">Kişi Güncelle</div>
            <div class="new-add hidden">Yeni kayıt ekranına geç</div>
            <div class="content">
                <form class="form" onsubmit="return false;" novalidate>
                    @csrf
                    <input type="hidden" name="person_id" id="person_id" value="">
                    <div class="form-container">
                        <div class="input-row">
                            <label for="name">İsim</label>
                            <input type="text" required id="name" name="name" class="input" autocomplete="off">
                        </div>
                        <div class="input-row">
                            <label for="date">Doğum Tarihi <small>(GG/AA/YYYY)</small></label>
                            <input type="text" name="birthday" pattern="[0-9]{2}/[0-9]{2}/[1-9]{1}[0-9]{3}"
                                   id="date" required class="input" autocomplete="off">
                        </div>
                        <div class="input-row">
                            <label for="gender">Cinsiyet</label>
                            <select name="gender" id="gender" required class="input">
                                <option value=""></option>
                                <option value="0">Erkek</option>
                                <option value="1">Kadın</option>
                            </select>
                        </div>
                        <div class="input-row">
                            <label for="country">Ülke</label>
                            <select name="country_id" id="country" required class="input">
                                <option value=""></option>
                                @foreach($countries as $country)
                                    <option value="{{ $country->id }}"> {{ $country->name }} </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="input-row">
                            <label for="city">Şehir</label>
                            <select name="city_id" id="city" required class="input">
                                <option class="city-clone-element hidden"></option>
                            </select>
                        </div>
                        <div class="input-row">
                            <label for="post_code">Posta Kodu</label>
                            <input type="text" required id="post_code" name="post_code" class="input"
                                   autocomplete="off">
                        </div>
                        <div class="input-row" style="flex: 100%;">
                            <label for="address">Adres</label>
                            <textarea minlength="10" name="address" required id="address" class="input"
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
