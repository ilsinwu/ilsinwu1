let audioContext
let analyser
let microphone
let dataArray

let nativePitch=[220,220,220,220,220]

function playNative(){

let audio=new Audio("https://upload.wikimedia.org/wikipedia/commons/2/22/Zh-ma1.ogg")

audio.play()

}

async function startRecording(){

audioContext=new AudioContext()

const stream=await navigator.mediaDevices.getUserMedia({audio:true})

microphone=audioContext.createMediaStreamSource(stream)

analyser=audioContext.createAnalyser()

microphone.connect(analyser)

dataArray=new Float32Array(analyser.fftSize)

setTimeout(processPitch,2000)

}

function processPitch(){

analyser.getFloatTimeDomainData(dataArray)

const detectPitch=Pitchfinder.YIN()

let pitches=[]

for(let i=0;i<5;i++){

let pitch=detectPitch(dataArray)

if(pitch) pitches.push(pitch)

}

draw(nativePitch,pitches)

let score=calculateScore(nativePitch,pitches)

document.getElementById("score").innerText="Score: "+score

}

function calculateScore(native,user){

let diff=0

let len=Math.min(native.length,user.length)

for(let i=0;i<len;i++){

diff+=Math.abs(native[i]-user[i])

}

let score=100-diff/5

return Math.max(0,Math.round(score))

}

function draw(native,user){

const ctx=document.getElementById('chart')

new Chart(ctx,{

type:'line',

data:{

labels:[1,2,3,4,5],

datasets:[

{
label:'Native',
data:native,
borderColor:'blue'
},

{
label:'You',
data:user,
borderColor:'red'
}

]

}

})

}