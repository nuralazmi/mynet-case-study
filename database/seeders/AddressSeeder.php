<?php

namespace Database\Seeders;

use App\Models\Country;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\HelperController;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('addresses')->delete();
        $addresses = array();
        $faker = Faker::create();
        $helperController = new HelperController();
        for ($i = 1; $i <= 20; $i++) {
            $randomCountry = $helperController->getCountries(true);
            $randomCountry = count($randomCountry) > 0 ? $randomCountry[0]['id'] : 0;
            $randomCity = $helperController->getCities($randomCountry)->getData();
            $randomCity = $randomCity->ok === true ? (array)$randomCity->datas[array_rand((array)$randomCity->datas)] : false;
            $randomCity = $randomCity !== false ? $randomCity['id'] : 0;

            $addresses[] = [
                'person_id' => $i,
                'city_id' => $randomCity,
                'country_id' => $randomCountry,
                'address' => $faker->address,
                'post_code' => $faker->postcode,
            ];
        }
        DB::table('addresses')->insert($addresses);
    }
}
