async function login(){

  const username =
  document
  .getElementById('username')
  .value
  .trim();

  const password =
  document
  .getElementById('password')
  .value
  .trim();

  if(!username || !password){

    showError(
      'Username dan Password wajib diisi'
    );

    return;
  }

  showLoading(true);

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'login',

        username:username,

        password:password

      })

    });

    const result =
    await response.json();

    if(result.status){

      localStorage.setItem(

        STORAGE_TOKEN,

        result.token

      );

      localStorage.setItem(

        STORAGE_USER,

        JSON.stringify(
          result.user
        )

      );

      location.href =
      'dashboard.html';

    }else{

      showError(
        result.message ||
        'Login gagal'
      );

    }

  }catch(err){

    showError(
      String(err)
    );

  }

  showLoading(false);

}

function showLoading(flag){

  document
  .getElementById('loading')
  .style.display =
  flag ? 'block' : 'none';

}

function showError(msg){

  document
  .getElementById('error')
  .innerHTML =
  msg;

}