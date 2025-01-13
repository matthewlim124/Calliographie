# Project Integrated System and Technology 18222005

**Project without integration : https://calliographie-744429109192.asia-southeast2.run.app**<br>
**Project with integration (pairfect) : https://calliographie-integrated-744429109192.asia-southeast2.run.app**

## Before you start

Terdapat 2 projek yaitu original tanpa integrasi dan yang integrasi dengan Lydia Gracia (18222035) dengan nama projek pairfec dimana semua endpoint bisa diakses pada project original dan integrasi kecuali /pairfect dimana merupakan endpoint pada project integrasi saja.

**Tidak perlu mengkopi JWT Token saat setelah sign-in, sudah diuruskan oleh server**

**Terdapat API yang public dan private (memerlukan api key atau JWT)**.<br>
Jika ingin mendapatkan api key mohon untuk membuat akun di website terlebih dahulu dan login untuk mendapatkan jwt baru bisa generate api key.

Ada 2 cara untuk mendapatkan api key,<br>
**Melalui frontend**: interaksi melalui html / front end dari **Hosting url**/profile.html kemudian generate API Key.

**Melalui endpoints**: /api/user/register -> /api/user/login -> api/user/apiKey untuk detil masing masing endpoint mohon refer ke bagian selanjutnya.

## Dokumentasi API

**Hosting url**:<br>
https://calliographie-744429109192.asia-southeast2.run.app<br>
atau <br>
https://calliographie-integrated-744429109192.asia-southeast2.run.app

**Endpoint sisi User**

1.  **Hosting url**/api/user/register<br>
    Endpoint untuk mendaftarkan akun.<br>

    Header yang diterima:

    ```
    "Content-Type: application/json"
    ```

    Request body (JSON):

    ```
    {
        "username": "username anda",
        "password": "password anda"
    }
    ```

    Response (JSON):

    ```
    {
        "_id": "user_id pada database",
        "username": "username anda"

    }
    ```

    Curl Format

    ```
    curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/register \
    -H "Content-Type: application/json" \
    -d '{"username":"john-doe","password":"12345"}'
    ```

2.  **Hosting url**/api/user/login<br>
    Endpoint untuk masuk ke akun dan mendapatkan jwt token dan refresh token yang disimpan pada httpOnly cookie.<br>

    Header yang diterima:

    ```
    "Content-Type: application/json"
    ```

    Request body (JSON):

    ```
    {
        "username": "username anda",
        "password": "password anda"
    }
    ```

    Response (JSON):

    ```
    HTTP/1.1 200 OK
    Set-Cookie: ref_tok="your cookie httponly refresh token"; Path=/; HttpOnly
    Content-Type: application/json
    ...
    {
        "accessToken": "access token jwt, expire dalam 3 menit",
        "username": "username anda"

    }
    ```

    Curl Format

    ```
    curl -i -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/login \
    -H "Content-Type: application/json" \
    -d '{"username":"john-doe","password":"12345"}'
    ```

3.  **Hosting url**/api/user/refresh<br>
    Endpoint untuk merefresh jwt.<br>

    Header yang diterima:

    ```
    "Content-Type: application/json"
    ```

    Request body (JSON):

    ```
    {
        "username": "username anda"
        
    }
    ```

    Response (JSON):

    ```

    {
        "accessToken": "access token jwt baru, expire dalam 15 menit",
        "username": "username anda"

    }
    ```

    Curl Format

    ```
    curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/refresh \
    -H "Content-Type: application/json" \
    -d '{"username":"john-doe"}' \
    --cookie "ref_tok=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ```

4.  **Hosting url**/api/user/apiKey<br>
    Endpoint untuk mendapatkan api key.<br>
    Api key hanya ditunjukkan sekali, jika keluar page html maka tidak lagi ditunjukkan.<br>

    Header yang diterima:<br>

    ```
    "Content-Type: application/json",
    "Authorization: Bearer <your-access-token>"
    ```

    Request body (JSON):

    ```
    {
        "username": "username anda",

    }
    ```

    Response (JSON):

    ```

    {
        "message": "api key success generated",
        "string_api": "api key anda"

    }
    ```

    Curl Format

    ```
    curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/apiKey \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer abc123" \
    -d '{"username":"john-doe"}'
    ```

5.  **Hosting url**/api/user/update<br>
    Endpoint untuk mengupdate skor atau point user ke database.<br>

    Header yang diterima:<br>

    ```
    "Content-Type: application/json",
    "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
    ```

    Request body (JSON):

    ```
    {
        "username": "username anda",
        "user_score":"skor tambahan, misal 5, nanti skor di database akan ditambah 5"
    }
    ```

    Response (JSON):

    ```

    {
        "mesage": "Score update success"

    }
    ```

    Curl Format

    ```
    curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/update \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer abc123 atau ApiKey def123" \
    -d '{"username":"john-doe", "user_score":"5"}'
    ```

6.  **Hosting url**/api/user/current<br>
    Endpoint untuk mendapatkan reward apa saja dan skor user sekarang.<br>

    Header yang diterima:<br>

        ```
        "Content-Type: application/json",
        "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
        ```

    Request body (JSON):

        ```
        {
            "username": "username anda",

        }
        ```

    Response (JSON):

        ```

        {
            "user_score": "skor atau poin anda sekarang",
            "user_reward": "reward apa saja yang dipunyai user",

        }
        ```

    Curl Format

        ```
        curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/current \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer abc123 atau ApiKey def123" \
        -d '{"username":"john-doe"}'
        ```

**Endpoint sisi Logic atau Bisnis**

7.  **Hosting url**/api/service/getProduct<br>
    Endpoint untuk mendapatkan product apa saja.<br>

    Header yang diterima:<br>

            ```
            "Content-Type: application/json"

            ```

    Request body (JSON):

            ```
            {


            }
            ```

    Response (JSON):

            ```

            {
                [
                    {
                        "product_category": "Electronics",
                        "product_name": "Smartphone",
                        "stock": 25,
                        "price": 599.99,
                        "description": "A high-end smartphone with 128GB storage."
                    },
                    {
                        "product_category": "Home Appliances",
                        "product_name": "Air Conditioner",
                        "stock": 10,
                        "price": 799.99,
                        "description": "Energy-efficient air conditioner with smart features."
                    },
                    {
                        "product_category": "Books",
                        "product_name": "The Great Gatsby",
                        "stock": 100,
                        "price": 9.99,
                        "description": "A classic novel by F. Scott Fitzgerald."
                    }
                    ]

            }
            ```

    Curl Format

            ```
            curl -X GET https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/service/getProduct \
            -H "Content-Type: application/json"
            ```

8.  **Hosting url**/api/user/checkout<br>
    Endpoint untuk membuat dan mengupdate data order pada database dan redirect user untuk membayar ke stripe checkout.<br>

    Header yang diterima:<br>

        ```
        "Content-Type: application/json,"
        "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
        ```

    Request body (JSON):

        ```
        {
            "items": ["product1", "product2", ...],
            "username": "username anda",
            "isCoupon": "nama reward yang dipakai, bisa diconfirm pada page Hosting url/reward.html",

        }
        ```

    Response (JSON):

        ```

        {
            "url": "url checkout stripe, nanti bisa tinggal redirect user ke url ini"

        }
        ```

    Curl Format

        ```
        curl -X POST "https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/service/checkout" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer abc123 atau ApiKey def123" \
        -d '{"items":["product1"], "username":"john-doe", "isCoupon": "5% discount next purchase"}'
        ```

9.  **Hosting url**/api/user/personal<br>
    Endpoint untuk bertanya kepada ai mengenai kaligrafi dan meminta cek hasil pekerjaan kaligrafi.<br>

    Header yang diterima:<br>

        ```
        "Content-Type: application/json",
        "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
        ```

    Request body (JSON):

        ```
        {

            "text": "pertanyaan atau prompt",
            "image": "data:image/png;base64,base64_encoded_image_data_here, image file kaligrafi anda"

        }
        ```

    Response (JSON):

        ```

        {
            "jawaban dari ai"

        }
        ```

    Curl Format

        ```
        curl -X POST "https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/service/personal" \
        -H "Authorization: Bearer abc123 atau ApiKey def123" \
        -F "text=${promptInput_value}" \
        -F "image=@${imageInput_file_path}"
        ```

10. **Hosting url**/api/user/pairfect<br>
    Endpoint untuk matching image kepada servis pairfect untuk mendapatkan gambar baru.<br>
    Dengan tujuan untuk mencari inspirasi <br>

    Header yang diterima:<br>

            ```
            "Content-Type: application/json",
            "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
            ```

    Request body (JSON):

            ```
            {

                "keyword": "keyword untuk mencari gambar baru",
                "image": "data:image/png;base64,base64_encoded_image_data_here, image file kaligrafi anda"

            }
            ```

    Response (JSON):

            ```

            {
                "result_image_uri":"url dari image yang didapatkan dari pairfect"

            }
            ```

    Curl Format

            ```
            curl -X POST "https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/service/pairfect" \
            -H "Authorization: Bearer abc123  atau ApiKey def123" \
            -F "text=${promptInput_value}" \
            -F "image=@${imageInput_file_path}"
            ```

11. **Hosting url**/api/user/exchange<br>
    Endpoint untuk menukar reward pada suatu user berdasarkan skor atau poin yang dimiliki.<br>

    Header yang diterima:<br>

            ```
            "Content-Type: application/json",
            "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
            ```

    Request body (JSON):

            ```
            {

                "reward": "nama reward yang ingin ditukar, bisa diconfirm pada page Hosting url/reward.html",
                "username": "username anda"

            }
            ```

    Response (JSON):

            ```

            {
                "message": "Exchanged finished !! atau Points not Enough !!"

            }
            ```

    Curl Format

            ```
            curl -X POST "https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/service/exchange" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer acb123 atau ApiKey def123" \
            -d '{"reward": "5 iscount next purchase", "username": "john-doe"}'
            ```

12. **Hosting url**/api/user/getOrder<br>
    Endpoint untuk mendapatkan order apa saja pada suatu user.<br>

    Header yang diterima:<br>

            ```
            "Content-Type: application/json",
            "Authorization: Bearer <your-access-token> atau ApiKey <api-key>"
            ```

    Request body (JSON):

            ```
            {

                "username": "username anda"

            }
            ```

    Response (JSON):

            ```

            {
                "orderData": [{"order_id": "id order pada database"
                , "order_product": ["product1", "product2", ...]
                , "status": false / true, jika sudah bayar maka true sebaliknya false
                , "stripe_payment_url": null / "url", jika sudah bayar maka null, sebaliknya ada"
                }]

            }
            ```

    Curl Format

            ```
            curl -X POST "https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/service/getOrder" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer abc123 atau ApiKey def123" \
            -d '{"username": "john_doe"}'
            ```
