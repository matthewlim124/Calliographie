# Project Integrated System Technology

## Api description

**Project url: https://calliographie.et.r.appspot.com**

1.POST url/api/user/register (example: https://calliographie.et.r.appspot.com/api/user/register)

Allows user to register an account using username and password

2.POST url/api/user/login

Allows user to login using registered credentials (username & password)


## Call the api from your browser 

You could use the html element if you do not want to do it manually or if you want to, <br>

1.Go to the https://calliographie.et.r.appspot.com
2.Navigate to developer tools (F12) and go to console <br> 
3.Paste following code into your browser console, allow pasting if your browser rejects <br>
4.Before clicking enter, change inside of the fetch() into https://calliographie.et.r.appspot.com/api/user/ **api name** <br>
5.Also change the username or pasword in the request body
```
const response = await fetch(' url/api/user/register or login' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "username": "any new username", 
                    "password": "any password" }),
                });
            
            if (response.ok) {
                const data = await response.json();
                alert("Sign-up/login successful!")
                
            } else {
                
                alert("sign up/login fail");
            }
        
```
