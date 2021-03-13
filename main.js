let ih='';
const n=100,p=9;
document.querySelector(':root').style.setProperty("--number",n);
document.querySelector(':root').style.setProperty("--pixel",`${p}px`);

for(let i=0;i<n;i++){
  ih+=`<div class='small-grid'>`
  for(let j=0;j<n;j++){
    if(i%10===9&&j%10===9){ih+=`<div class='cell hcell vcell' id='${i}-${j}'></div>`}
    else if(i%10===9){ih+=`<div class='cell hcell nvcell' id='${i}-${j}'></div>`}
    else if(j%10===9){ih+=`<div class='cell nhcell vcell' id='${i}-${j}'></div>`}
    else{ih+=`<div class='cell nhcell nvcell' id='${i}-${j}'></div>`}
  }
  ih+=`</div>`;
}

document.querySelector('#large-grid').innerHTML=ih;
let shape=new Array(n);
for(let i=0;i<n;i++){
  shape[i]=new Array(n);
  for(let j=0;j<n;j++){
    shape[i][j]=false;
  }
}

calc();

let mouseClicked=false;

document.querySelector('#large-grid').addEventListener('mousedown',()=>{mouseClicked=true;});
document.querySelector('#large-grid').addEventListener('mouseup',()=>{mouseClicked=false;});

const list=document.querySelectorAll('.cell');
list.forEach((element)=>{
  element.addEventListener('mousedown',()=>{whenClick(element);});
  element.addEventListener('mouseover',()=>{
    if(mouseClicked){
      whenClick(element);
    }
  });
});

function whenClick(element){
  const idx=element.id.split('-');
  shape[Number(idx[0])][Number(idx[1])]=!shape[Number(idx[0])][Number(idx[1])];
  if(shape[Number(idx[0])][Number(idx[1])]){
    element.style.backgroundColor='#333333';
  }
  else{
    element.style.backgroundColor='#ffffff';
  }
  calc();
}

function counter(k){
  let c=Math.floor((n-1)/k)+1;
  let a=0,f;
  for(let i=0;i<c;i++){
    for(let j=0;j<c;j++){
      f=0;
      for(let u=i*k;u<i*k+k;u++){
        if(u>=n)continue;
        for(let v=j*k;v<j*k+k;v++){
          if(v>=n)continue;
          if(shape[u][v] && f===0){
            a++;
            f=1;
          }
        }
      }
    }
  }
  return a;
}

function calc(){
  const resultElement=document.querySelector('#result');
  if(counter(1)===0){
    resultElement.style.fontSize='20px';
    resultElement.innerText='격자에 도형을 그리면 여기에 차원이 표시됩니다.';
  }
  else{
    let maxk=Math.floor(Math.sqrt(n));
    let count=0;
    let dataX=new Array(maxk),dataY=new Array(maxk);
    let avgX=0,avgY=0;
    for(let i=1;i<=maxk;i++){
      if(n%i!==0)continue;
      dataX[count]=Math.log(1/i);
      dataY[count]=Math.log(counter(i));
      avgX+=dataX[count];
      avgY+=dataY[count];
      count++;
    }
    avgX/=count;
    avgY/=count;
    let numerator=0,denominator=0;
    for(let i=0;i<count;i++){
      numerator+=(dataX[i]-avgX)*(dataY[i]-avgY);
      denominator+=(dataX[i]-avgX)*(dataX[i]-avgX);
    }
    let dimension=numerator/denominator;
    resultElement.style.fontSize='60px';
    resultElement.innerText=`${dimension.toFixed(2)}차원`;
  }
}

document.querySelector('#save').onclick=function(){save();}
document.querySelector('#load').onclick=function(){load();}
document.querySelector('#clear').onclick=function(){clear();}
document.querySelector('#inverse').onclick=function(){inverse();}

function save(){
  if(counter(1)===0)return;
  let data='';
  for(let i=0;i<n;i++){
    for(let j=0;j<n;j++){
      if(shape[i][j]===true){
        data+=`${i}-${j} `;
      }
    }
  }
  console.log(data);
  alert('F12를 눌러 콘솔을 보시면 텍스트가 있습니다. 복사해 두시기 바랍니다.')
}

function load(){
  const data=prompt('저장할 때 나타났던 텍스트를 입력해 주세요.','');
  if(data===null)return;
  for(let i=0;i<n;i++){
    for(let j=0;j<n;j++){
      if(shape[i][j]===true){
        whenClick(document.getElementById(`${i}-${j}`));
      }
    }
  }
  const coords=data.split(' ');
  coords.forEach((element)=>{
    whenClick(document.getElementById(element));
  });
}

function clear(){
  if(counter(1)===0)return;
  const conf=confirm('정말로 전체를 지우겠습니까? 저장해 놓지 않았다면 복구할 수 없습니다.');
  if(conf===false)return;
  for(let i=0;i<n;i++){
    for(let j=0;j<n;j++){
      if(shape[i][j]===true){
        whenClick(document.getElementById(`${i}-${j}`));
      }
    }
  }
}

function inverse(){
  for(let i=0;i<n;i++){
    for(let j=0;j<n;j++){
      whenClick(document.getElementById(`${i}-${j}`));
    }
  }
}
