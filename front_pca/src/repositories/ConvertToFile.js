export default {

  convertBase64ToFile (image) {
  
    const byteString = atob(image.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    const newBlob = new File([ab], "Foto",{
      type: "image/jpeg"
    });
    return newBlob;
  },

}
  