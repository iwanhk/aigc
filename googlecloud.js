import {initializeApp} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getStorage, ref, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js" ;

//IMPORTANT API INFO KEEP THIS FOR GOOGLE CLOUD
const firebaseConfig = {
  apiKey: "AIzaSyDWlKvENKk3VifFekISeucVGnaUd3PS4LQ",
  authDomain: "dreambooth-ai.firebaseapp.com",
  projectId: "dreambooth-ai",
  storageBucket: "dreambooth-ai.appspot.com",
  messagingSenderId: "271111459915",
  appId: "1:271111459915:web:dde6b8c8bdfa23c863e9ce",
};
var checkpoint;
var linklist = [];


//calls dreambooth api
async function dreamboothjob(){
  let response = await fetch('https://api.dreamlook.ai/dreambooth', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer dl-DB09B60A8F9A4E4089B79B4D5EB8626F'
    },
    // body: '{\n        "steps": 925,\n        "learning_rate": 0.000003,\n        "enable_offset_noise": true,\n        "extract_lora": "original",\n        "instance_prompt": "photo of ukj person",\n        "base_model": "realistic-vision-v3-0",\n        "saved_model_format": "original",\n        "saved_model_weights_format": "safetensors",\n        "crop_method": "face",\n        "image_urls": [\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/d918eb1e_7fl9229z_10.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/b62c91d2_0sqjrraw_9.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/b481b705_64yhra1i_8.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/86a8c745_lez8m8dk_7.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/7ce86e77_txm1hply_6.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/3fd572d0_rdgpd42g_5.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/acf116f0_9wmigxr1_4.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/da877ea9_nrd13l3s_3.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/88a5d4f5_bv6yo962_2.jpg",\n            "gs://nyxai-galactus-prd.appspot.com/dreambooth/fLilAfMpduWY16MCWxdDNnH68pz2/2023-7-29-17-15_m4xnsg8t2b/images/4c468b3b_otipzsd7_1.jpg"\n        ]\n    }',
    body: JSON.stringify({
      'steps': 975,
      'learning_rate': 0.000003,
      'enable_offset_noise': true,
      'extract_lora': 'disabled',
      'instance_prompt': 'photo of ukj person',
      'base_model': 'realistic-vision-v3-0',
      'saved_model_format': 'original',
      'saved_model_weights_format': 'safetensors',
      'crop_method': 'face',
      'image_urls': linklist, 
    })
  })
  let data = await response.json();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  var toreturn = data['job_id'];
  return toreturn;
}

var checkpointidgen;
// Initialize Firebase
initializeApp(firebaseConfig);
export async function uploadImages() {
  //ensure jpeg passed
  const metadata = {
    contentType: 'image/jpeg',
  };
  //getting file input from user
  const fileInput = document.getElementById("imageFiles");
  const files = fileInput.files;
  if (files.length <1) {
      alert("Please select  more images to upload.");
      return;
  }
  //storage and unique identifier
  const storage1 = getStorage();
  const uploadStatus = document.getElementById("uploadStatus");
  const identifier = Math.floor(Math.random()*10000);
  uploadStatus.textContent = "Uploading...";
  // Loop through each selected image file and upload it to Firebase Storage
  for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage1, `images/${identifier}/${file.name}`);
      console.log(identifier);
      //uploads to firebase to get direct url for api
      const uploadTask = await uploadBytesResumable(storageRef, file,metadata);
      const upload = document.getElementById("stat");
      upload.textContent = "started";
      //pushing download urls into list for api
      var downloadURL=await getDownloadURL(ref(storage1, `images/${identifier}/${file.name}`));
      linklist.push(downloadURL);
  }

  console.log(linklist);
  //getting info from dreambooth job
  let jobid = await dreamboothjob();
  console.log(jobid);
  document.getElementById("id2").textContent = jobid; 
  alert("done");
  //db_70c859a2 test job id
  //status progress bar update
  document.getElementById('Progress_Status').style.display = 'block'; 
  var stat = await checkstatus('dreambooth', jobid);
  while(stat === false){
    await sleep(5000);
    stat = await checkstatus('dreambooth', jobid)
  }
  //getting dreambooth checkpoint for image gen
  let checkpointid = await checkpointget(jobid);
  const upload2 = document.getElementById("final");
  upload2.textContent = "Image generate started";
  generate(checkpointid);
} 

export async function checkpointget(jobid){
  var checkpointid;
  let response = await fetch(`https://api.dreamlook.ai/jobs/dreambooth/${jobid}`, {
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer dl-DB09B60A8F9A4E4089B79B4D5EB8626F'
    }
  })
  let data = await response.json();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  console.log('second API Response:', data); 
  var data1 = data['dreambooth_result'];
  checkpointid = data1['checkpoints'][0];
  checkpointidgen = checkpointid['checkpoint_id'];
  console.log(checkpointid);
  console.log(checkpointidgen);
  return checkpointidgen;
}

//api call to checkstatus of dreambooth/ image gen task
export async function checkstatus(jobtype, idvar){
  let response = await fetch(`https://api.dreamlook.ai/jobs/${jobtype}/${idvar}`, {
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer dl-DB09B60A8F9A4E4089B79B4D5EB8626F'
    }
  })
  let data = await response.json();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  var percent = data['percentage_done'];
  console.log('API Response:', data['state']); 
  console.log('API Response:', data); 
  if(data['state'] == 'running'){
    const element = document.getElementById("myprogressBar");   
    var width = percent; 
    element.style.width = width + '%'; 

    return false;
  }
  if(data['state'] === 'success'){ return true;}
  else{ return false;}

}
// test checkpoint: ckp_3ab44e7a
//functions to generate images 
export async function generate(checkpointid){
  let response= await fetch('https://api.dreamlook.ai/image_gen', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'authorization': 'Bearer dl-DB09B60A8F9A4E4089B79B4D5EB8626F'
  },
  // body: '{\n    "prompt": "high quality photo of ukj in an suit standing under the northern lights, one person, natural face, face of a model, looking at camera, full body, studio quality, 4 k, hdr, smooth, sharp focus, high resolution, award winning photo, detailed clothing, smooth skin, cinematic lighting",\n    "negative_prompt": "nudity, amputee, bad anatomy, blurry, fuzzy, disfigured, misshaped, mutant, deformed, bad art, out of frame, off center",\n    "num_samples": 8,\n    "width": 768,\n    "height": 1024,\n    "num_inference_steps": 20,\n    "enable_hrf": true,\n    "scheduler_type": "dpm++",\n    "seed": 42,\n    "model_type": "sd-v1",\n    "guidance_scale": 7.5,\n    "checkpoint_id": "ckp_44e69b4f"\n}',
  body: JSON.stringify({
    'prompt': 'high quality photo of ukj in an suit standing under the northern lights, one person, natural face, face of a model, looking at camera, full body, studio quality, 4 k, hdr, smooth, sharp focus, high resolution, award winning photo, detailed clothing, smooth skin, cinematic lighting',
    'negative_prompt': 'nudity, amputee, bad anatomy, blurry, fuzzy, disfigured, misshaped, mutant, deformed, bad art, out of frame, off center',
    'num_samples': 8,
    'width': 768,
    'height': 1024,
    'num_inference_steps': 20,
    'enable_hrf': true,
    'scheduler_type': 'dpm++',
    'seed': -1,
    'model_type': 'sd-v1',
    'guidance_scale': 8.0,
    'checkpoint_id': checkpointid
  })
})
let data = await response.json();
data = JSON.stringify(data);
data = JSON.parse(data);
var jobid = data['job_id'];
var stat = await checkstatus('image-gen', jobid);
while(stat === false){
  await sleep(5000);
  stat = await checkstatus('image-gen', jobid)
}
await resultsget(jobid);
}


export async function resultsget(jobid){
  var checkpointid;
  let response = await fetch(`https://api.dreamlook.ai/jobs/image-gen/${jobid}`, {
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer dl-DB09B60A8F9A4E4089B79B4D5EB8626F'
    }
  })
  let data = await response.json();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  console.log('third API Response:', data); 
  var data1 = data['image_gen_results'][0];
  console.log(data1);
  var imageurls= data1['generated_images'];
  console.log(imageurls);
  var resultlist=[];
  for(let i = 0; i < imageurls.length;i++){
    var temp = imageurls[i];
    var url = temp['url'];
    resultlist.push(url);
  }
  console.log(resultlist);
  const container = document.getElementById('image-container');
     
  for (let i = 0; i < resultlist.length; i++) {
      const img = document.createElement('img');
      img.src = resultlist[i];
      container.appendChild(img);
  }
  return resultlist;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function testgen(){
  document.getElementById('Progress_Status').style.display = 'block'; 
  generate('ckp_3ab44e7a');
}

export const pls = document.getElementById("pls");
pls.addEventListener('click', uploadImages, false);
//uploadImages
//generate('ckp_3ab44e7a')
export const gen = document.getElementById("hiddenButton");
gen.addEventListener('click', generate, false);
