# Project Integrated System and Technology 18222005

**Project without integration : https://calliographie-744429109192.asia-southeast2.run.app**
**Project with integration (pairfect) : https://calliographie-integrated-744429109192.asia-southeast2.run.app**

## Before you start

Terdapat 2 projek yaitu original tanpa integrasi dan yang integrasi dengan Lydia Gracia (18222035) dengan nama projek pairfec dimana semua endpoint bisa diakses pada project original dan integrasi kecuali /pairfect dimana merupakan endpoint pada project integrasi saja.

**Terdapat API yang public dan private (memerlukan api key atau JWT)**.
Jika ingin mendapatkan api key mohon untuk membuat akun di website terlebih dahulu dan login untuk mendapatkan jwt baru bisa generate api key.

Ada 2 cara untuk mendapatkan api key,
**Melalui frontend**: interaksi melalui html / front end dari profile.html dari home.html kemudian gnerate API Key.

**Melalui endpoints**: /api/user/register -> /api/user/login -> api/user/apiKey untuk detil masing masing endpoint mohon refer ke bagian selanjutnya.

## Dokumentasi API

**Hosting url**:
https://calliographie-744429109192.asia-southeast2.run.app

atau

https://calliographie-integrated-744429109192.asia-southeast2.run.app

**Endpoint sisi User**

1.  **Hosting url**/api/user/register
    Endpoint untuk mendaftarkan akun.

    Header yang diterima:
    "Content-Type: application/json"

    Request body:
    "username": string
    "password": string

    Response:

    ```
    {
        "_id": "user_id pada database"
        "username": "username anda"

    }
    ```

    Curl Format

    ```
    curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/register \
    -H "Content-Type: application/json" \
    -d '{"username":"<your-username>","password":"<your-password>"}'
    ```

2.  **Hosting url**/api/user/login
    Endpoint untuk masuk ke akun.

        Header yang diterima:
        "Content-Type: application/json"

        Request body:
        "username": string
        "password": string

        Response:
        ```
        {
            "_id": "user_id pada database"
            "username": "username anda"

        }
        ```
        Curl Format
        ```
        curl -X POST https://calliographie-integrated-744429109192.asia-southeast2.run.app/api/user/register \
        -H "Content-Type: application/json" \
        -d '{"username":"<your-username>","password":"<your-password>"}'
        ```

    api/user/login
    api/user/refresh

Private - perlu autentikasi JWT / API Key
api/user/apiKey
api/user/update
api/user/current

**Endpoint sisi Logic atau Bisnis**

## Call the api from your browser

1.Navigate to developer tools (F12) and go to console
2.Paste following code into your browser console, allow pasting if your browser rejects
3.Before clicking enter, change the fetch() into https://calliographie.et.r.appspot.com/api/user/**api name\*\*
4.Also change the username or pasword in the request body

```
const response = await fetch(' url/api/user/register or login' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "any new username",
                    password: "any password" }),
                };

            if (response.ok) {
                const data = await response.json();
                alert("Sign-up successful!")

            } else {

                alert("sign up fail");
            }

```
