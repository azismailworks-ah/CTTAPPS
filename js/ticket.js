let currentTT='';
let isSubmitting = false;

window.onload = async function(){

  const token =
  localStorage.getItem(
    STORAGE_TOKEN
  );

  if(!token){

    location.href =
    'index.html';

    return;

  }

  const params =
  new URLSearchParams(
    window.location.search
  );

  currentTT =
  params.get('tt');

  if(!currentTT){

    alert(
      'TT Not Found'
    );

    location.href =
    'dashboard.html';

    return;

  }

  await loadTicketDetail();

  await loadHistory();

};

function backDashboard(){

  location.href =
  'dashboard.html';

}

async function loadTicketDetail(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'detail',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        ),

        tt:
        currentTT

      })

    });

    const result =
    await response.json();

    if(
      !result.status
    ){

      alert(
        result.message
      );

      return;

    }

    renderDetail(
      result.data
    );

  }

  catch(err){

    console.log(err);

  }

}

async function loadHistory(){

  try{

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'history',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        ),

        tt:
        currentTT

      })

    });

    const result =
    await response.json();

    if(
      result.status
    ){

      renderHistory(
        result.data
      );

    }

  }

  catch(err){

    console.log(err);

  }

}

function renderDetail(item){

  const hvcBadge =

  item.typeUrgent == 'HVC'

  ?

  '<span class="badge-purple">HVC</span>'

  :

  '';

  document
  .getElementById(
    'ticketHeader'
  )
  .innerHTML =

  `

  <div class="ticket-detail-top">

    <div>

      <h1>

        ${item.tt}

      </h1>

      <br>

      <span class="${
        item.priority=='P1'
        ?
        'badge-red'
        :
        'badge-yellow'
      }">

        ${item.priority}

      </span>

      ${hvcBadge}

      <span class="badge-green">

        OPEN

      </span>

    </div>

  </div>

  `;

  document
  .getElementById(
    'ticketInfo'
  )
  .innerHTML =

  `

  <h2>

    Ticket Information

  </h2>

  <br>

  <table class="detail-table">

    <tr>
    
      <td>TT NOC</td>
    
      <td>
        ${item.ttNoc || '-'}
      </td>
    
    </tr>
    
    <tr>
    
      <td>WO FSO</td>
    
      <td>
        ${item.ttFso || '-'}
      </td>
    
    </tr>

    <tr>

      <td>Site ID</td>

      <td>${item.siteId}</td>

    </tr>

    <tr>

      <td>Site Name</td>

      <td>${item.siteName}</td>

    </tr>

    <tr>

      <td>Region</td>

      <td>${item.region}</td>

    </tr>

    <tr>

      <td>Area</td>

      <td>${item.area}</td>

    </tr>

    <tr>

      <td>Severity</td>

      <td>${item.severity}</td>

    </tr>

    <tr>

      <td>Open Date</td>

      <td>${item.openDate}</td>

    </tr>

    <tr>

      <td>Aging</td>

      <td>${item.agingLabel}</td>

    </tr>

    <tr>

      <td>SLA</td>

      <td>${item.sla}</td>

    </tr>

  </table>

  `;

  document
  .getElementById(
    'summaryCard'
  )
  .innerHTML =

  `

  <h2>

    Summary Issue

  </h2>

  <br>

  <div>

    ${item.summaryIssue || '-'}

  </div>

  `;

   const resolutionText =
   String(
     item.resolution || '-'
   )
   .replace(/\r\n/g,'<br>')
   .replace(/\n/g,'<br>')
   .replace(/\r/g,'<br>');
   
   document
   .getElementById(
     'resolutionCard'
   )
   .innerHTML =
   
   `
   
   <h2>
   
     Resolution Information
   
   </h2>
   
   <br>
   
   <div class="resolution-text">
   
     ${resolutionText}
   
   </div>
   
   `;

}

function renderHistory(data){

  let html='';

  if(
    data.length===0
  ){

    html =

    `

    <div>

      No Update History

    </div>

    `;

  }

  else{

    data.forEach(

      function(item){

        html +=

        `

        <div class="history-item">

          <div class="history-date">

            ${item.timestamp}

          </div>

          <br>

          <b>

            ${item.fullname}

          </b>

          <br><br>

          <b>

            Update Progress

          </b>

          <br>

          ${item.progress || '-'}

          <br><br>

          <b>

            Action Taken

          </b>

          <br>

          ${item.actionTaken || '-'}

          <br><br>

          <b>

            ETA Recovery

          </b>

          <br>

          ${item.etaRecovery || '-'}

        </div>

        `;

      }

    );

  }

  document
  .getElementById(
    'historyList'
  )
  .innerHTML =
  html;

  renderPhotos(data);
  
}
async function submitUpdate(){

  if(isSubmitting){

    return;

  }

  isSubmitting = true;

  const btn =
  document.querySelector(
    '#updateCard .btn'
  );

  if(btn){

    btn.disabled = true;

    btn.innerHTML =
    'SUBMITTING...';

  }

  showSubmitLoading();

  try{

    const updateProgress =
    document
    .getElementById(
      'updateProgress'
    )
    .value
    .trim();

    const actionTaken =
    document
    .getElementById(
      'actionTaken'
    )
    .value
    .trim();

    const etaRecovery =
    document
    .getElementById(
      'etaRecovery'
    )
    .value;

    const proposeClose =
    document
    .getElementById(
    'proposeClose'
    )
    .checked;

    if(!updateProgress){

      resetSubmitButton(btn);

      alert(
        'Update Progress wajib diisi'
      );

      return;

    }

    let photoUrls = [];

    const files =
    document
    .getElementById(
      'photoUpload'
    )
    .files;

    if(files.length > 0){

      photoUrls =
      await uploadPhotos(
        files
      );

    }

    const detailResponse =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'detail',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        ),

        tt:
        currentTT

      })

    });

    const detailResult =
    await detailResponse.json();

    if(!detailResult.status){

      resetSubmitButton(btn);

      alert(
        'Detail Ticket gagal dibaca'
      );

      return;

    }

    const item =
    detailResult.data;

    console.log(
    'SUBMIT PHOTO URLS:',
    photoUrls
    );
    
    console.log(
    'SUBMIT PHOTO URLS JOIN:',
    photoUrls.join(',')
    );

    const response =
    await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

        action:'submit',

        token:
        localStorage.getItem(
          STORAGE_TOKEN
        ),

        tt:item.tt,

        siteId:item.siteId,

        region:item.region,

        area:item.area,

        priority:item.priority,

        updateProgress:updateProgress,

        actionTaken:actionTaken,

        etaRecovery:etaRecovery,

        photoUrls:
        photoUrls.join(','),
		
		proposeClose:
        proposeClose

      })

    });

    const result =
    await response.json();

    resetSubmitButton(btn);

    if(result.status){

      alert(
        'Update berhasil disimpan'
      );

      document
      .getElementById(
        'updateProgress'
      )
      .value='';

      document
      .getElementById(
        'actionTaken'
      )
      .value='';

      document
      .getElementById(
        'etaRecovery'
      )
      .value='';

      document
      .getElementById(
        'photoUpload'
      )
      .value='';

      await loadHistory();

    }

    else{

      alert(
        result.message ||
        'Gagal menyimpan update'
      );

    }

  }

  catch(err){

    resetSubmitButton(btn);

    console.log(err);

    alert(
      'Submit gagal'
    );

  }

}

async function uploadPhotos(files){

  let payload=[];

  for(

    let i=0;
    i<files.length;
    i++

  ){

    const file =
    files[i];

    const base64 =
    await fileToBase64(
      file
    );

    payload.push({

      base64:
      base64.includes(',')
      ?
      base64.split(',')[1]
      :
      base64,

      mimeType:
      file.type

    });

  }

  const response =
  await fetch(API_URL,{

    method:'POST',

    body:JSON.stringify({

      action:'upload',

      token:
      localStorage.getItem(
        STORAGE_TOKEN
      ),

      tt:
      currentTT,

      files:
      payload

    })

  });

  const result =
  await response.json();

  if(!result.status){

    throw new Error(
      result.error ||
      result.message
    );

  }

  return result.urls;

}

function fileToBase64(file){

  return new Promise(

    function(resolve,reject){

      const reader =
      new FileReader();

      reader.onload =
      function(){

        resolve(
          reader.result
        );

      };

      reader.onerror =
      reject;

      reader.readAsDataURL(
        file
      );

    }

  );

}

function showSubmitLoading(){

  const overlay =
  document.getElementById(
    'submitOverlay'
  );

  if(overlay){

    overlay.style.display =
    'flex';

  }

}

function hideSubmitLoading(){

  const overlay =
  document.getElementById(
    'submitOverlay'
  );

  if(overlay){

    overlay.style.display =
    'none';

  }

}

function resetSubmitButton(btn){

  hideSubmitLoading();

  isSubmitting = false;

  if(btn){

    btn.disabled = false;

    btn.innerHTML =
    'SUBMIT UPDATE';

  }

}

function renderPhotos(data){

  let html = '';

  data.forEach(function(item){

    if(!item.photos){

      return;

    }

    const photos =
    String(item.photos)
    .split(',');

    photos.forEach(function(url){

      url = url.trim();

      if(!url){

        return;

      }

      let previewUrl =
      url;

      const match =
      url.match(
        /\/d\/([^\/]+)\//
      );

      if(match){

        const fileId =
        match[1];

        previewUrl =
        'https://drive.google.com/thumbnail?id=' +
        fileId +
        '&sz=w1000';

      }

      html += `

      <a
      href="${url}"
      target="_blank">

        <img
        src="${previewUrl}"
        class="photo-thumb">

      </a>

      `;

    });

  });

  document
  .getElementById(
    'photoGallery'
  )
  .innerHTML =

  html ||

  '<div>No Photos</div>';
