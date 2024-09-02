const imageInput = document.getElementById("fileInput");
const previewImage = document.getElementById("imgPreview");
const inputImage = document.getElementById("input-image");
const convertButton = document.getElementById("btnConvert");
const copyButton = document.getElementById("btnCopy");
const resultButton = document.getElementById("btnShowResult");

let file;
let base64;

document.getElementById("btnSelectFile").addEventListener("click", function () {
  imageInput.value = "";
  imageInput.click();
});

imageInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    file = this.files[0];

    // check if the file is an image
    if (isImageFile(file)) {
      const imageUrl = URL.createObjectURL(file);
      inputImage.value = "local://" + file.name;
      showImage(imageUrl);
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

function showImage(imageUrl) {
  previewImage.src = imageUrl;
  document.getElementById("output").classList.remove("hide-element");
  document.getElementById("result-item").classList.add("hide-element");
}

function hideImage() {
  document.getElementById("output").classList.add("hide-element");
  document.getElementById("result-item").classList.add("hide-element");
}

function isEmpty(str) {
  return !str.trim().length;
}

convertButton.addEventListener("click", async function () {
  if (!inputImage.value.startsWith("local://") && !isEmpty(inputImage.value)) {
    base64 = await urlToBase64(inputImage.value);
    return;
  } else if (file == null || isEmpty(inputImage.value)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select an image",
      toast: true,
    });

    return;
  }
  base64 = await convertToBase64(file);
});

copyButton.addEventListener("click", async function () {
  await copyToClipboard(base64);
});

resultButton.addEventListener("click", function () {
  try {
    sessionStorage.setItem("base64Data", base64);
    window.open("result.html", "_blank");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Sorry, this base64 string is too large to display in the result.\nPlease just copy it.",
      toast: true,
    });
  }
});

function isImageFile(file) {
  const validImageTypes = ["image/jpeg", "image/png"];
  return validImageTypes.includes(file.type);
}

async function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
      document.getElementById("result-item").classList.remove("hide-element");

      const toastApp = new SvelteToast({
        target: document.body,
      });
      toast.push("Done", {
        duration: 1000,
        theme: {
          "--toastBarHeight": 0,
        },
      });
    };
    reader.onerror = (error) => reject(error);
  });
}

async function urlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);

        document.getElementById("result-item").classList.remove("hide-element");

        const toastApp = new SvelteToast({
          target: document.body,
        });
        toast.push("Done", {
          duration: 1000,
          theme: {
            "--toastBarHeight": 0,
          },
        });
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert image to Base64"));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.push("Copied to clipboard", {
      theme: {
        "--toastBarHeight": 0,
      },
    });
  } catch (error) {
    console.error("Failed to copy into clipboard: ", error);
  }
}

inputImage.addEventListener("focusout", async function () {
  if (isEmpty(inputImage.value)) {
    hideImage();
  } else if (
    !inputImage.value.startsWith("local://") &&
    !isEmpty(inputImage.value)
  ) {
    showImage(inputImage.value);
  }
});

async function checkURL(url) {
  return url.match(/\.(jpeg|jpg|png)$/) != null;
}

async function urlToFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}
