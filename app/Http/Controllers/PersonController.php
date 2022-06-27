<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use App\Models\Person;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class PersonController extends Controller
{
    /*
     * Tüm person listesini döner
     */
    public function index(): Collection|array
    {
        /*
         * Kişilerin listesi eğer cache de varsa cache den gelecek. Yoksa veri tabanından gelecek
          ve cache oluşacak.
           Redis ve memcached kullanılması daha sağlıklıdır ancak yerel ortamda sürücünün yüklü olması
            gerektiği için projenin çalıştırılması zorlaşabilir. Bu nedenle file kullandım.
         */
        return Cache::rememberForever('people', function () {
            return Person::with('address.city.country')->get();
        });
    }

    public function store(Request $request): JsonResponse
    {
        $response = array(
            'ok' => false,
            'status_code' => 100,
            'messages' => [],
            'logs' => [],
            'datas' => [],
        );

        $requestDatas = $request->all();

        $response['logs'][] = 'Parametre kontrolü yapılıyor';
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'birthday' => 'required|date_format:d/m/Y',
            'gender' => 'required|integer|min:0|max:1',
            'address' => 'required|min:5',
            'city_id' => 'required|integer|min:1',
            'country_id' => 'required|integer|min:1',
            'post_code' => 'required',
        ]);
        if ($validator->fails()) {
            $response['logs'][] = 'Parametre kontrolü başarısız';
            $response['messages'] = $validator->messages();
            return response()->json($response);
        }
        $response['logs'][] = 'Parametre kontrolü başarılı';

        //Kayıt işlemine başlamadan önce şehir ve ülke kontrol edilecek
        $response['logs'][] = 'Şehir ve ülke kontrol ediliyor';
        $city = Cache::rememberForever('city_detail_' . $requestDatas['city_id'], function () use ($requestDatas) {
            return City::find($requestDatas['city_id']);
        });
        if ($city) {
            $response['logs'][] = 'Şehir veri tabanında bulundu';
            if ($city->country_id === (int)$requestDatas['country_id']) {
                $response['logs'][] = 'Şehir ve ülke ilişkişi başarılı';

                $response['logs'][] = 'Yeni kişi oluşturulacak';
                $requestDatas['birthday'] = Carbon::createFromFormat('d/m/Y', $requestDatas['birthday'])->format('Y-m-d');

                $person = new Person();
                $person->name = $requestDatas['name'];
                $person->birthday = $requestDatas['birthday'];
                $person->gender = $requestDatas['gender'];
                if ($person->save()) {
                    $response['logs'][] = 'Kişi ekleme başarılı';
                    $requestDatas['person_id'] = $person->id;

                    $address = new Address();
                    $address->person_id = $requestDatas['person_id'];
                    $address->city_id = (int)$requestDatas['city_id'];
                    $address->country_id = (int)$requestDatas['country_id'];
                    $address->address = $requestDatas['address'];
                    $address->post_code = $requestDatas['post_code'];
                    if ($address->save()) {
                        $response['logs'][] = 'Adres ekleme başarılı';
                        $response['ok'] = true;
                        $this->removeCache();
                        $response['datas'] = $this->show($person)->getData()->datas;
                    } else $response['logs'][] = 'Adres ekleme başarısız';
                } else $response['logs'][] = 'Kişi ekleme başarısız';

            } else $response['logs'][] = 'Şehir ile ülke eşleşmiyor';
        } else  $response['logs'][] = 'Şehir veri tabanında bulunamadı';

        if ($response['ok']) $response['status_code'] = 201;
        return response()->json($response);
    }

    public function show(Person $person): JsonResponse
    {
        $response = array(
            'ok' => false,
            'status_code' => 100,
            'messages' => [],
            'logs' => [],
            'datas' => [],
        );
        $response['logs'][] = 'Kişi bilgisi alınıyor';
        if ($person) {
            $response['logs'][] = 'Kişi bilgisi bulundu';
            $response['ok'] = true;
            $response['datas'] = Cache::rememberForever('person_' . $person->id, function () use ($person) {
                return Person::with('address.city.country')->find($person->id);
            });
        } else $response['logs'][] = 'Kişi bilgisi bulunamadı';

        if ($response['ok']) $response['status_code'] = 200;
        return response()->json($response);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $response = array(
            'ok' => false,
            'status_code' => 100,
            'messages' => [],
            'logs' => [],
            'datas' => [],
        );

        $response['logs'][] = 'Parametre kontrolü yapılıyor';
        $validator = Validator::make($request->all(), [
            'name' => 'min:1',
            'birthday' => 'date_format:d/m/Y',
            'gender' => 'integer|min:0|max:1',
            'address' => 'min:15',
            'city_id' => 'integer|min:1',
            'country_id' => 'integer|min:1',
            'post_code' => 'min:1',
        ]);

        if ($validator->fails()) {
            $response['logs'][] = 'Parametre kontrolü başarısız';
            $response['messages'] = $validator->messages();
            return response()->json($response);
        }
        $response['logs'][] = 'Parametre kontrolü başarılı';
        $response['logs'][] = 'Kişi bilgisi alınıyor';
        $person = Person::find($id);
        if ($person) {
            $response['logs'][] = 'Kişi bilgisi bulundu';
            $person->name = $request->has('name') ? $request->input('name') : $person->name;
            $person->birthday = $request->has('birthday') ? Carbon::createFromFormat('d/m/Y', $request->input('birthday'))->format('Y-m-d') : $person->birthday;
            $person->gender = $request->input('gender') ?? $person->name;
            if ($person->save()) {
                $response['logs'][] = 'Kişi güncellendi';
                $response['ok'] = true;

                $response['logs'][] = 'Adres güncellenmesi için işlemler yapılıyor';
                if (!$request->has('address') || !$request->has('post_code') || !$request->has('city_id') || !$request->has('country_id'))
                    $response['logs'][] = 'Adres güncellemek için gerekli parametreler yeterli değil. address, post_code, city_id, country_id';
                else {
                    $response['logs'][] = 'Şehir ve ülke kontrol ediliyor';
                    $city = City::find($request->input('city_id'));
                    if ($city) {
                        $response['logs'][] = 'Şehir veri tabanında bulundu';
                        if ($city->country_id === (int)$request->input('country_id')) {
                            $response['logs'][] = 'Şehir ve ülke ilişkişi başarılı';
                            $address = Address::all()->where('person_id', $person->id)->first();
                            if ($address) {
                                $address->city_id = (int)$request->input('city_id');
                                $address->country_id = (int)$request->input('country_id');
                                $address->address = $request->input('address');
                                $address->post_code = $request->input('post_code');
                                if ($address->save()) $response['logs'][] = 'Adres güncellendi';
                                else $response['logs'][] = 'Adres güncellenemedi';
                            }
                        } else $response['logs'][] = 'Şehir ülke ilişkisi başarısız';
                    }
                }

                //Kişinin güncel bilgisi
                $this->removeCache(true, $person->id);
                $response['datas'] = $this->show($person)->getData()->datas;
            }
        } else $response['logs'][] = 'Kişi bilgisi bulunamadı';

        if ($response['ok']) $response['status_code'] = 200;
        return response()->json($response);
    }

    public function destroy($id): JsonResponse
    {
        $response = array(
            'ok' => false,
            'status_code' => 100,
            'messages' => [],
            'logs' => [],
        );
        $response['ok'] = Person::destroy($id);

        if ($response['ok']) {
            $response['status_code'] = 204;
            $this->removeCache();
        }
        return response()->json($response);
    }

    private function removeCache($update = false, $person_id = 0)
    {
        if ($update) Cache::pull('person_' . $person_id);
        Cache::pull('people');
    }
}
