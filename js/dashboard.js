let currentKeyword = '';

window.onload = async function(){

const user =
JSON.parse(
localStorage.getItem(
STORAGE_USER
)
);

if(user){


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


}

const token =
localStorage.getItem(
STORAGE_TOKEN
);

if(!token){


location.href =
'index.html';

return;


}

await loadSummary();
await loadSystemCache();
await loadTrend();
await loadAreaRangking();
await loadTickets();
await loadFSORanking();


};

async function loadSummary(){

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
    'totalOpen'
  )
  .innerHTML =
  result.open;
  
  document
  .getElementById(
    'totalP1'
  )
  .innerHTML =
  result.p1;
  
  document
  .getElementById(
    'totalP2'
  )
  .innerHTML =
  result.p2;
  
  document
  .getElementById(
    'totalHVC'
  )
  .innerHTML =
  result.hvc;

}


}

catch(err){


console.log(err);


}

}

async function loadTrend(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'trendCache',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        )

      })

    });

    const result =
    await response.json();

    if(result.status){

      renderTrendChart(
        result.data
      );
      
      renderTrendKPI(
        result.kpi
      );

    }

  }

  catch(err){

    console.log(err);

  }

}

async function loadTickets(){

try{


const response =
await fetch(API_URL,{

  method:'POST',

  body:JSON.stringify({

    action:'dashboard',

    token:
    localStorage.getItem(
      STORAGE_TOKEN
    ),

    page:1,

    keyword:
    currentKeyword

  })

});

const result =
await response.json();

if(result.status){

  renderTickets(
    result.data
  );

}


}

catch(err){


console.log(err);


}

}

function renderTickets(data){

let html='';

if(data.length===0){


html =

`

<div class="ticket-card">

  <center>

    Ticket Tidak Ditemukan

  </center>

</div>

`;


}

else{


data.forEach(function(item){

  html +=

  `

  <div
  class="ticket-card"
  onclick="openTicket('${item.tt}')">

    <div class="ticket-header">
    
      <div>
    
        <span class="${
          item.priority=='P1'
          ? 'badge-red'
          : 'badge-yellow'
        }">
    
          ${item.priority}
    
        </span>
    
        ${
          item.p2c === 'YES'
    
          ?
    
          `<span class="p2c-badge">
    
            🟢 P2C
            (${formatP2CDate(item.p2cDate)})
    
          </span>`
    
          :
    
          ''
    
        }
    
      </div>
    
      <span>
    
        ${item.agingLabel}
    
      </span>
    
    </div>

    <div class="ticket-tt">

      ${item.tt}

    </div>

    <div class="ticket-reference">
    
      TT NOC :
      ${item.ttNoc || '-'}
    
    </div>
    
    <div class="ticket-reference">
    
      WO FSO :
      ${item.ttFso || '-'}
    
    </div>

    <div>

      ${item.siteName}

    </div>

    <div>

      Site ID :
      ${item.siteId}

    </div>

    <div>

      Severity :
      ${item.severity}

    </div>

    <div>

      Open :
      ${item.openDate}

    </div>

  </div>

  `;

});


}

document
.getElementById(
'ticketList'
)
.innerHTML =
html;

}

async function searchTickets(){

currentKeyword =

document
.getElementById(
'searchKeyword'
)
.value
.trim();

showLoading();

try{


await loadTickets();


}

finally{


hideLoading();


}

}

function handleSearchEnter(event){

if(
event.key === 'Enter'
){


searchTickets();


}

}

function showLoading(){

const overlay =

document
.getElementById(
'loadingOverlay'
);

if(overlay){


overlay.style.display =
'flex';


}

}

function hideLoading(){

const overlay =

document
.getElementById(
'loadingOverlay'
);

if(overlay){


overlay.style.display =
'none';


}

}

function openTicket(tt){

location.href =

'ticket.html?tt=' +

encodeURIComponent(tt);

}

function logout(){

localStorage.removeItem(
STORAGE_TOKEN
);

localStorage.removeItem(
STORAGE_USER
);

window.location.href =
'index.html';

}

let trendChart = null;

function renderTrendChart(data){

  const ctx =
  document
  .getElementById(
    'trendChart'
  );

  if(!ctx){

    return;

  }

  const labels =
  data.map(function(x){
  
    const d =
    new Date(x.date);
  
    return d.toLocaleDateString(
      'en-GB',
      {
        day:'2-digit',
        month:'short'
      }
    );
  
  });

  const totalOpen =
  data.map(
    x => x.totalOpen
  );

  const overSla =
  data.map(
    x => x.overSla
  );

  const meetSla =
  data.map(
    x => x.meetSla
  );

  if(trendChart){

    trendChart.destroy();

  }

  trendChart =
  new Chart(ctx,{

    data:{

      labels:labels,

      datasets:[

        {

          type:'bar',

          label:'Meet SLA',

          data:meetSla,

          backgroundColor:
          '#22c55e',

          stack:'sla'

        },

        {

          type:'bar',

          label:'Over SLA',

          data:overSla,

          backgroundColor:
          '#ef4444',

          stack:'sla'

        },

        {

          type:'line',

          label:'Total Open',

          data:totalOpen,

          borderColor:
          '#3b82f6',

          borderWidth:3,

          tension:.3,

          fill:false

        }

      ]

    },

    options:{

      responsive:true,

      maintainAspectRatio:false,

      plugins:{

        legend:{

          display:false

        }

      },

      scales:{

        x:{

          stacked:true,

          ticks:{

            color:'#cbd5e1'

          }

        },

        y:{

          stacked:true,

          ticks:{

            color:'#cbd5e1'

          }

        }

      }

    }

  });

}

function renderTrendKPI(kpi){

  document.getElementById(
    'kpiOpenValue'
  ).innerHTML =
  kpi.totalOpen;

  document.getElementById(
    'kpiMeetValue'
  ).innerHTML =
  kpi.meetSla;

  document.getElementById(
    'kpiOverValue'
  ).innerHTML =
  kpi.overSla;

  document.getElementById(
    'kpiComplianceValue'
  ).innerHTML =
  kpi.compliance + '%';

  if(!kpi.previous){

    document.getElementById(
      'kpiOpenTrend'
    ).innerHTML='-';

    document.getElementById(
      'kpiMeetTrend'
    ).innerHTML='-';

    document.getElementById(
      'kpiOverTrend'
    ).innerHTML='-';

    document.getElementById(
      'kpiComplianceTrend'
    ).innerHTML='-';

    return;

  }

  setTrend(
    'kpiOpenTrend',
    kpi.totalOpen -
    kpi.previous.totalOpen,
    true
  );
  
  setTrend(
    'kpiMeetTrend',
    kpi.meetSla -
    kpi.previous.meetSla,
    false
  );
  
  setTrend(
    'kpiOverTrend',
    kpi.overSla -
    kpi.previous.overSla,
    true
  );
  
  setTrend(
    'kpiComplianceTrend',
    parseFloat(kpi.compliance)
    -
    parseFloat(kpi.previous.compliance),
    false
  );
}

function setTrend(
id,
value,
lowerIsBetter
){

  const el =
  document.getElementById(id);

  if(value === 0){

    el.innerHTML = '-';

    el.style.color =
    '#94a3b8';

    return;

  }

  const isGood =

  lowerIsBetter

  ?

  value < 0

  :

  value > 0;

  const arrow =

  value > 0

  ?

  '▲'

  :

  '▼';

  const absValue =
  Math.abs(value);

  el.innerHTML =

  arrow +
  ' ' +
  absValue;

  el.style.color =

  isGood

  ?

  '#22c55e'

  :

  '#ef4444';

}

async function loadFSORanking(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'fsoRanking',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        )

      })

    });

    const result =
    await response.json();

    if(result.status){

      renderFSORanking(
        result.data
      );

    }

  }

  catch(err){

    console.log(err);

  }

}

async function loadAreaRangking(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'areaRangkingCache',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        )

      })

    });

    const result =
    await response.json();

    if(result.status){

      renderAreaRangking(
        result.data
      );

    }

  }

  catch(err){

    console.log(err);

  }

}

function renderFSORanking(data){

  let html='';

  const medal =

  ['🥇','🥈','🥉','4️⃣','5️⃣'];

  data.forEach(

    function(item,index){

      html +=

      `

      <div class="rank-item">

        <div>

          <div class="rank-name">

            ${medal[index]}
            ${item.fullname}

          </div>

          <div class="rank-sub">

            ${item.updates}
            Updates

          </div>

        </div>

        <div class="rank-score">

          ${item.ttHandling}

          TT

        </div>

      </div>

      `;

    }

  );

  document
  .getElementById(
    'fsoRankingList'
  )
  .innerHTML =
  html;

}

function renderAreaRangking(data){

  let html='';

  const medal =

  ['🥇','🥈','🥉','4️⃣','5️⃣'];

  data.forEach(

    function(item,index){

      html +=

      `

      <div class="rank-item">

        <div>

          <div class="rank-name">

            ${medal[index] || ''}

            ${item.area}

          </div>

        </div>

        <div class="rank-score">

          ${item.achievement}%

        </div>

      </div>

      `;

    }

  );

  document
  .getElementById(
    'areaRangkingList'
  )
  .innerHTML =
  html;

}

async function loadSystemCache(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'systemCache',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        )

      })

    });

    const result =
    await response.json();

    if(result.status){

      const dt =
      new Date(
        result.lastRefresh
      );

      document
      .getElementById(
        'lastRefreshInfo'
      )
      .innerHTML =

      '🟢 Last Refresh : ' +

      dt.toLocaleString(
        'id-ID'
      );

    }

  }catch(err){

    console.log(err);

  }

}

function formatP2CDate(value){

  if(!value){

    return '';

  }

  const d =
  new Date(value);

  return d.toLocaleString(
    'en-GB',
    {
      day:'2-digit',
      month:'short',
      hour:'2-digit',
      minute:'2-digit'
    }
  );

}

function goHome(){

  location.href =
  'home.html';

}
