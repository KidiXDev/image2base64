window.onload = function () {
  const base64 = sessionStorage.getItem("base64Data");
  document.getElementById("resultField").value = base64;
};
