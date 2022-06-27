<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\HelperController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $personController = new PersonController();
    $helperController = new HelperController();

    $datas = array(
        'persons' => $personController->index(),
        'countries' => $helperController->getCountries()
    );
    return view('home', $datas);
});

Route::get('/test', function () {
    return view('test');
});

//Person istekleri için rotalar - Resource Controller
Route::resource('person', PersonController::class);

//Ülkelerin listesi
Route::get('countries', [HelperController::class, 'getCountries']);
//Şehirlerin listesi - Ülke numarası parametresini alır
Route::get('cities/{country_id}', [HelperController::class, 'getCities']);

