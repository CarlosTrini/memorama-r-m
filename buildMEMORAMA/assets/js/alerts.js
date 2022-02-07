const alertBasic = (title, text, icon = "success") => {
  Swal.fire(title, text, icon);
};

export { alertBasic };
