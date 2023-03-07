
import './App.css'

function App() {
  let peerConnection
  let localStream
  let remoteStream
  let servers={
    iceServers:[
      {
        urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
      }
    ]
  }
  let init= async ()=>{
    localStream=await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream
    
  }
  let createOffer= async ()=>{
    let peerConnection= new RTCPeerConnection(servers)
    remoteStream= new MediaStream();

    console.log("this is localStream"+localStream)
    localStream.getTracks().forEach((track)=>{
      peerConnection.addTrack(track, localStream)
    })
    peerConnection.ontrack= async (event)=>{
      event.streams[0].getTracks().forEach((track)=>{
        remoteStream.addTrack(track)
    })}

    peerConnection.onicecandidate= async (event)=>{
      if(event.candidate){
        document.getElementById('offer-sdp').value= JSON.stringify(peerConnection.localDescription)
      }
    }

    document.getElementById('user-2').srcObject = remoteStream
    let offer= await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    document.getElementById('offer-sdp').value=JSON.stringify(offer)
    
  }
  let createAnswer= async ()=>{
    let peerConnection= new RTCPeerConnection(servers)
    remoteStream= new MediaStream();

    console.log("this is localStream"+localStream)
    localStream.getTracks().forEach((track)=>{
      peerConnection.addTrack(track, localStream)
    })
    peerConnection.ontrack= async (event)=>{
      event.streams[0].getTracks().forEach((track)=>{
        remoteStream.addTrack(track)
    })}

    peerConnection.onicecandidate= async (event)=>{
      if(event.candidate){
        document.getElementById('answer-sdp').value= JSON.stringify(peerConnection.localDescription)
      }
    }

    let offer= document.getElementById('offer-sdp').value
    if(!offer) return alert('Retrieve offer first')
    offer=JSON.parse(offer)
    await peerConnection.setRemoteDescription(offer)
    let answer= await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    document.getElementById('answer-sdp').value=JSON.stringify(answer)
  }
  let addAnswer= async ()=>{
    let answer= document.getElementById('answer-sdp').value
    if(!answer) return alert('Retrieve answer from peer first')
    answer = JSON.parse(answer)
    if(!peerConnection.currentRemoteDescription){
      peerConnection.setRemoteDescription(answer)
    }
  }

  return (
    <div className="App">
    <div>
      
    </div>
    <h1>test app</h1>
    <div className="card">
     <div id="videos">
        <video className='video-player' id='user-1' autoPlay playsInline></video>
        <video className='video-player' id='user-2' autoPlay playsInline></video>
     </div>
    <button onClick={()=>init()}>start</button>

    <div className='test12'>

    <button id='create-offer' onClick={createOffer}>create offer</button>
    <label>sdp offer</label>
    <textarea id='offer-sdp'>

    </textarea>
    </div>
    <div className='test12'>
    
    <button id='create-answer' onClick={createAnswer}>create answer</button>
    <label>sdp answer</label>
    <textarea id='answer-sdp'>

    </textarea>
    </div>
    <button id='add-answer' onClick={addAnswer}>add answer</button>
    </div>

    

  </div>
  )
}

export default App
