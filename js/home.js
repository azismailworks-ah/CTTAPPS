window.onload =
async function(){

  const token =
  localStorage.getItem(
    STORAGE_TOKEN
  );

  if(!token){

    location.href =
    'index.html';

    return;

  }

  const user =
  JSON.parse(

    localStorage.getItem(
      STORAGE_USER
    )

  );

  document
  .getElementById(
    'userInfo'
  )
  .innerHTML =

  user.fullname +
  ' (' +
  user.role +
  ') - ' +
  user.area;

  await loadCTTSummary();

};

async function loadCTTSummary(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'summaryCache',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        )

      })

    });

    const result =
    await response.json();

    if(result.status){
    
      document
      .getElementById(
        'cttOpen'
      )
      .innerHTML =
    
      result.open;
    
      document
      .getElementById(
        'cttMiniKpi'
      )
      .innerHTML =
    
      `
      <div class="mini-box p1">
    
        <span>P1</span>
        <br>
    
        <b>
          ${result.p1}
        </b>
    
      </div>
    
      <div class="mini-box p2">
    
        <span>P2</span>
        <br>
    
        <b>
          ${result.p2}
        </b>
    
      </div>
    
      <div class="mini-box hvc">
    
        <span>HVC</span>
        <br>
    
        <b>
          ${result.hvc}
        </b>
    
      </div>
      `;
    
    }

  }

  catch(err){

    console.log(err);

  }

}

function openCTT(){

  location.href =
  'dashboard.html';

}

function openTraffic(){

  location.href =
  'traffic.html';

}

function logout(){

  localStorage.removeItem(
    STORAGE_TOKEN
  );

  localStorage.removeItem(
    STORAGE_USER
  );

  location.href =
  'index.html';

}
