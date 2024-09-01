const imageInput = document.getElementById("fileInput");
const previewImage = document.getElementById("imgPreview");
const inputImage = document.getElementById("input-image");
const convertButton = document.getElementById("btnConvert");
const copyButton = document.getElementById("btnCopy");

let file;
let base64;

document.getElementById("btnSelectFile").addEventListener("click", function () {
  imageInput.click();
});

imageInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    file = this.files[0];

    // Check if file is image
    if (isImageFile(file)) {
      const imageUrl = URL.createObjectURL(file);
      previewImage.src = imageUrl;
      inputImage.value = "local://" + file.name;
      document.getElementById("output").classList.remove("hide-element");
      //   document.getElementById("copy").classList.remove("hide-element");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "This image is not supported",
        toast: true,
      });
    }
  }
});

convertButton.addEventListener("click", async function () {
  if (file == null) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select file first",
      toast: true,
    });
  }
  base64 = await convertToBase64(file);
});

copyButton.addEventListener("click", async function () {
  await copyToClipboard(base64);
});

function isImageFile(file) {
  const validImageTypes = ["image/jpeg", "image/png"];
  return validImageTypes.includes(file.type);
}

async function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    document.getElementById("btnCopy").classList.remove("hide-element");
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    Swal.fire({
      title: "Success",
      text: "Copied to clipboard!",
      icon: "success",
      toast: true,
    });
  } catch (error) {
    console.error("Gagal menyalin ke clipboard: ", error);
  }
}
