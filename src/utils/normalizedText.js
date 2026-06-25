



 const normalizeText = (text) => {
  return text.trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");


};

export default normalizeText;

