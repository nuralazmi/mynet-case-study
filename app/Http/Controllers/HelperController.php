<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use App\Models\Country;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Faker\Factory as Faker;

class HelperController extends Controller
{
    /*
     * Ülkelerin listesini verir
     */
    public function getCountries($random = false): Collection
    {
        if ($random) return Country::all()->random(1);
        return Cache::rememberForever('countries', function () {
            return Country::all();
        });
    }

    public function getCities($country_id): JsonResponse
    {
        $response = array(
            'ok' => false,
            'messages' => [],
            'logs' => [],
            'datas' => [],
        );

        /*
         * Burada laravelin validasyon sınıfını kullanmak için yaptım. Tek bir değişken için if bloğu kullanılabilir
         */
        $response['logs'][] = 'Parametre kontrolü yapılıyor';
        $validator = Validator::make(['country_id' => $country_id], [
            'country_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            $response['logs'][] = 'Parametre kontrolü başarısız';
            $response['messages'] = $validator->messages();
            return response()->json($response);
        }
        $response['logs'][] = 'Parametre kontrolü başarılı';


        //Gelen ülke numarasında şehir var mı kontrol edilecek
        $response['logs'][] = 'Şehir listesi alınıyor';
        $cities = Cache::rememberForever('cities_country_' . $country_id, function () use ($country_id) {
            return City::where('country_id', $country_id)->get();
        });
        if (count($cities) > 0) {
            $response['logs'][] = 'Şehir listesi bulundu';
            $response['ok'] = true;
            $response['datas'] = $cities;
        } else $response['logs'][] = 'Şehir listesi bulunamadı';


        return response()->json($response);

    }
}
