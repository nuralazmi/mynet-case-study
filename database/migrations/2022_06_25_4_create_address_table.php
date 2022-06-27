<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('person_id')->comment('People tablosundaki kişiyi ifade eder');
            $table->unsignedBigInteger('city_id')->comment('Cities tablosundaki şehri ifade eder');
            $table->unsignedBigInteger('country_id')->comment('Countries tablosundaki ülkeyi ifade eder');
            $table->longText('address')->comment('Adres bilgisini ifade eder');
            $table->string('post_code')->comment('Adresin posta kodunu ifade eder');
            $table->foreign('person_id')->references('id')->on('people')->onDelete('CASCADE');
            $table->foreign('city_id')->references('id')->on('cities')->onDelete('CASCADE');
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('CASCADE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('address');
    }
};
